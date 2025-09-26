import { useState, useEffect, useRef } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { useAuthStore } from '@/auth/authStore';

interface UseVoiceCallWebRTCProps {
  channel_id: string;
  user_id: string;
  project_id?: string;
}

interface PeerConnection {
  user_id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream; // For remote audio stream
  dataChannel?: RTCDataChannel;
  remoteDataChannel?: RTCDataChannel;
  isRemoteAudioMuted?: boolean;
  dataChannelReady?: boolean;
  remoteDataChannelReady?: boolean;
}

interface SignalingMessage {
  type: string;
  user_id?: string;
  target?: string;
  sdp?: RTCSessionDescription | null;
  candidate?: RTCIceCandidate;
}

interface StatusMessage {
  type: 'status';
  audioMuted: boolean;
}

type DataChannelMessage = StatusMessage; // Simplified, only status messages for now

const useVoiceCallWebRTC = ({ channel_id, user_id, project_id }: UseVoiceCallWebRTCProps) => {
  const { project } = useProject(); // Keep for participant names in status messages if needed
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("연결 중...");
  
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const pendingConnectionsRef = useRef<{user_id: string, isInitiator: boolean}[]>([]);

  const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    const startCall = async () => {
      try {
        console.log("Starting voice call, requesting media permissions...");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: false, // Request audio only
          audio: true,
        });
        
        console.log("Audio access granted, setting up local stream");
        setLocalStream(stream);
        
      } catch (error) {
        console.error('Error accessing audio devices:', error);
        setConnectionStatus("마이크 접근에 실패했습니다.");
      }
    };
    
    startCall();
    
    return () => {
      cleanupResources();
    };
  }, []);

  useEffect(() => {
    if (localStream) {
      console.log("Local audio stream is ready, connecting to signaling server");
      connectSignalingServer();
      
      if (pendingConnectionsRef.current.length > 0) {
        console.log(`Processing ${pendingConnectionsRef.current.length} pending connections`);
        pendingConnectionsRef.current.forEach(async pending => {
          await createPeerConnection(pending.user_id, pending.isInitiator);
        });
        pendingConnectionsRef.current = [];
      }
    }
  }, [localStream, project_id, channel_id, user_id]);

  useEffect(() => {
    peersRef.current = peers;
  }, [peers]);

  const connectSignalingServer = () => {
    const token = useAuthStore.getState().token;
    const socketProtocol = SERVER_URL?.startsWith('https://') ? 'wss' : 'ws';
    const serverUrl = `${socketProtocol}://${SERVER_URL?.replace('http://', '').replace('https://', '')}/api/v1/projects/${project_id}/voice-calls/ws?channel_id=${channel_id}&user_id=${user_id}&access_token=${token}`;
    
    console.log(`Connecting to signaling server for voice call at ${serverUrl}`);
    socketRef.current = new WebSocket(serverUrl);
    
    socketRef.current.onopen = () => {
      console.log('Connected to signaling server (voice call)');
      setConnectionStatus("다른 참가자를 기다리는 중...");
    };
    
    socketRef.current.onmessage = async (event) => {
      console.log('Received message (voice call):', event.data);
      const message = JSON.parse(event.data) as SignalingMessage;
      
      switch(message.type) {
        case 'user-joined':
          if (message.user_id) {
            console.log(`User joined (voice call): ${message.user_id}, creating offer`);
            setConnectionStatus(`${project?.members.find(member => member.user.id === Number(message.user_id))?.user.name}님이 참여했습니다.`);
            const existingPeer = peersRef.current.find(p => p.user_id === message.user_id);
            if (!existingPeer) {
              if (localStream) {
                await createPeerConnection(message.user_id, true);
              } else {
                console.log(`Local audio stream not ready, queueing connection with ${message.user_id}`);
                pendingConnectionsRef.current.push({
                  user_id: message.user_id,
                  isInitiator: true
                });
              }
            } else {
              console.log(`Already have a voice connection with user ${message.user_id}, skipping`);
            }
          }
          break;
          
        case 'user-left':
          if (message.user_id) {
            console.log(`User left (voice call): ${message.user_id}`);
            setConnectionStatus(`${project?.members.find(member => member.user.id === Number(message.user_id))?.user.name}님이 나갔습니다.`);
            removePeer(message.user_id);
          }
          break;
          
        case 'offer':
          console.log('Received offer (voice call) from:', message.user_id);
          if (localStream) {
            await handleOffer(message);
          } else {
            console.log(`Local audio stream not ready, queueing offer from ${message.user_id}`);
            pendingConnectionsRef.current.push({
              user_id: message.user_id!,
              isInitiator: false
            });
            if (message.user_id) {
              localStorage.setItem(`pending_voice_offer_${message.user_id}`, JSON.stringify(message));
            }
          }
          break;
          
        case 'answer':
          console.log('Received answer (voice call) from:', message.user_id);
          await handleAnswer(message);
          break;
          
        case 'ice-candidate':
          console.log('Received ICE candidate (voice call) from:', message.user_id);
          await handleIceCandidate(message);
          break;
      }
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error (voice call):', error);
      setConnectionStatus("WebSocket 연결 오류가 발생했습니다.");
    };
    
    socketRef.current.onclose = () => {
      console.log('Disconnected from signaling server (voice call)');
      setConnectionStatus("서버와 연결이 종료되었습니다.");
    };
  };

  const createPeerConnection = async (targetUserId: string, isInitiator: boolean) => {
    try {
      if (!localStream) {
        console.error('No local audio stream available for voice call peer connection.');
        setConnectionStatus("로컬 오디오 스트림을 사용할 수 없습니다. 새로고침 후 다시 시도해주세요.");
        return null;
      }
      
      const existingPeer = peersRef.current.find(p => p.user_id === targetUserId);
      if (existingPeer) {
        console.log(`Voice peer connection with ${targetUserId} already exists`);
        return existingPeer.connection;
      }
      
      console.log(`Creating voice peer connection with ${targetUserId}, isInitiator: ${isInitiator}`);
      const peerConnection = new RTCPeerConnection(iceServers);
      let dataChannel: RTCDataChannel | undefined;
      
      if (isInitiator) {
        dataChannel = peerConnection.createDataChannel('voice-status');
        console.log(`Created data channel for voice peer ${targetUserId}`);
        setupDataChannel(dataChannel, targetUserId, true);
      } else {
        peerConnection.ondatachannel = (event) => {
          console.log(`Received data channel from voice peer ${targetUserId}`);
          const remoteDataChannel = event.channel;
          setupDataChannel(remoteDataChannel, targetUserId, false);
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === targetUserId);
            if (peerIndex !== -1) {
              newPeers[peerIndex].remoteDataChannel = remoteDataChannel;
              const refIndex = peersRef.current.findIndex(p => p.user_id === targetUserId);
              if (refIndex !== -1) peersRef.current[refIndex].remoteDataChannel = remoteDataChannel;
            }
            return newPeers;
          });
        };
      }
      
      const newPeer = { user_id: targetUserId, connection: peerConnection, dataChannel };
      setPeers(prev => [...prev, newPeer]);
      peersRef.current = [...peersRef.current, newPeer];
      
      peerConnection.onconnectionstatechange = () => {
        console.log(`Voice connection state: ${peerConnection.connectionState} for peer ${targetUserId}`);
        if (peerConnection.connectionState === 'connected') {
          console.log(`Successfully voice connected with ${targetUserId}`);
          setConnectionStatus(`${targetUserId}님과 음성 통화 연결됨.`);
        }
      };
      
      peerConnection.oniceconnectionstatechange = () => console.log(`Voice ICE state: ${peerConnection.iceConnectionState} for ${targetUserId}`);
      peerConnection.onicegatheringstatechange = () => console.log(`Voice ICE gathering state: ${peerConnection.iceGatheringState} for ${targetUserId}`);
      peerConnection.onsignalingstatechange = () => console.log(`Voice signaling state: ${peerConnection.signalingState} for ${targetUserId}`);
      
      console.log(`Adding ${localStream.getTracks().length} local audio tracks to voice peer connection`);
      localStream.getAudioTracks().forEach(track => { // Only add audio tracks
        peerConnection.addTrack(track, localStream);
      });
      
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`Generated voice ICE candidate for ${targetUserId}:`, event.candidate);
          sendSignalingMessage({ type: 'ice-candidate', candidate: event.candidate, user_id, target: targetUserId });
        } else {
          console.log(`All voice ICE candidates generated for ${targetUserId}`);
        }
      };
      
      peerConnection.ontrack = (event) => {
        console.log(`Received remote audio track from ${targetUserId}`, event.streams);
        if (event.track.kind === 'audio' && event.streams && event.streams[0]) {
          console.log(`Setting remote audio stream for peer ${targetUserId}`);
          const remoteStream = new MediaStream();
          event.streams[0].getAudioTracks().forEach(track => remoteStream.addTrack(track));
          
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === targetUserId);
            if (peerIndex !== -1) {
              newPeers[peerIndex].stream = remoteStream; // Store remote audio stream
              const refIndex = peersRef.current.findIndex(p => p.user_id === targetUserId);
              if (refIndex !== -1) peersRef.current[refIndex].stream = remoteStream;
            }
            return newPeers;
          });
        } else {
          console.warn('Received non-audio track or track event without streams for voice call');
        }
      };
      
      if (isInitiator) {
        console.log('Creating voice offer as initiator');
        try {
          const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: false // No video needed for voice call
          });
          await peerConnection.setLocalDescription(offer);
          sendSignalingMessage({ type: 'offer', sdp: peerConnection.localDescription, user_id, target: targetUserId });
        } catch (error) {
          console.error(`Error creating voice offer for ${targetUserId}:`, error);
        }
      } else {
        const storedOffer = localStorage.getItem(`pending_voice_offer_${targetUserId}`);
        if (storedOffer) {
          console.log(`Found stored voice offer for ${targetUserId}, processing`);
          localStorage.removeItem(`pending_voice_offer_${targetUserId}`);
          await handleOffer(JSON.parse(storedOffer));
        }
      }
      return peerConnection;
    } catch (error) {
      console.error('Error creating voice peer connection:', error);
      setConnectionStatus("음성 피어 연결 생성 중 오류.");
      return null;
    }
  };

  const handleOffer = async (message: SignalingMessage) => {
    if (!message.user_id || !message.sdp) return;
    if (!localStream) {
      console.log(`Cannot handle voice offer from ${message.user_id} - local audio stream not ready`);
      pendingConnectionsRef.current.push({ user_id: message.user_id, isInitiator: false });
      localStorage.setItem(`pending_voice_offer_${message.user_id}`, JSON.stringify(message));
      return;
    }
    const peerId = message.user_id;
    console.log(`Handling voice offer from ${peerId}`);
    const existingPeer = peersRef.current.find(p => p.user_id === peerId);
    const peerConnection = existingPeer ? existingPeer.connection : await createPeerConnection(peerId, false);
    
    if (peerConnection && message.sdp) {
      try {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        sendSignalingMessage({ type: 'answer', sdp: peerConnection.localDescription, user_id, target: peerId });
        setConnectionStatus("음성 통화 연결 설정 중...");
      } catch (error) {
        console.error(`Error handling voice offer from ${peerId}:`, error);
        setConnectionStatus("음성 오퍼 처리 중 오류.");
      }
    }
  };

  const handleAnswer = async (message: SignalingMessage) => {
    if (!message.user_id || !message.sdp) return;
    const peerId = message.user_id;
    console.log(`Handling voice answer from ${peerId}`);
    const peer = peersRef.current.find(p => p.user_id === peerId);
    if (peer) {
      try {
        await peer.connection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        setConnectionStatus("음성 통화 연결됨.");
      } catch (error) {
        console.error(`Error handling voice answer from ${peerId}:`, error);
        setConnectionStatus("음성 앤서 처리 중 오류.");
      }
    } else console.warn(`No voice peer found for ID ${peerId} when handling answer`);
  };

  const handleIceCandidate = async (message: SignalingMessage) => {
    if (!message.user_id || !message.candidate) return;
    const peerId = message.user_id;
    console.log(`Handling voice ICE candidate from ${peerId}`);
    const peer = peersRef.current.find(p => p.user_id === peerId);
    if (peer) {
      try {
        await peer.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
      } catch (error) {
        console.error(`Error handling voice ICE candidate from ${peerId}:`, error);
      }
    } else console.warn(`No voice peer found for ID ${peerId} when handling ICE candidate`);
  };

  const removePeer = (peerId: string) => {
    console.log(`Removing voice peer ${peerId}`);
    const peerIndex = peersRef.current.findIndex(p => p.user_id === peerId);
    if (peerIndex !== -1) {
      const peer = peersRef.current[peerIndex];
      peer.dataChannelReady = false;
      peer.remoteDataChannelReady = false;
      try {
        if (peer.dataChannel && peer.dataChannel.readyState !== 'closed') peer.dataChannel.close();
        if (peer.remoteDataChannel && peer.remoteDataChannel.readyState !== 'closed') peer.remoteDataChannel.close();
        peer.dataChannel = undefined;
        peer.remoteDataChannel = undefined;
      } catch (e) { console.warn(`Error closing data channels for voice peer ${peerId}:`, e); }
      
      try {
        peer.connection.getSenders().forEach(sender => peer.connection.removeTrack(sender));
        peer.connection.getTransceivers?.().forEach(transceiver => transceiver.stop?.());
        peer.connection.close();
      } catch (e) { console.warn(`Error closing connection for voice peer ${peerId}:`, e); }
      
      peersRef.current = peersRef.current.filter(p => p.user_id !== peerId);
      setPeers(prev => prev.filter(p => p.user_id !== peerId));
    }
  };

  const sendSignalingMessage = (message: SignalingMessage) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      console.log('Sending voice signaling message:', message);
      socketRef.current.send(JSON.stringify(message));
    } else console.warn('Cannot send voice signaling message, socket not open');
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const newMutedState = !isAudioMuted;
      audioTracks.forEach(track => track.enabled = !newMutedState);
      
      try {
        peersRef.current.flatMap(peer => 
          peer.connection.getSenders().filter(s => s.track?.kind === 'audio')
        ).forEach(s => { if (s.track) s.track.enabled = !newMutedState; });
      } catch (e) { console.warn("Error updating audio tracks on senders (voice call):", e); }
      
      console.log(`Audio track muted (voice call): ${newMutedState}`);
      peersRef.current.forEach(peer => {
        const statusMessage: StatusMessage = { type: 'status', audioMuted: newMutedState };
        safeSendThroughDataChannel(peer.user_id, statusMessage);
      });
      setIsAudioMuted(newMutedState);
    }
  };

  const cleanupResources = () => {
    console.log("Cleaning up voice call WebRTC resources");
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'disconnect' })); // Inform server
      socketRef.current.close();
      socketRef.current = null;
    }
    
    localStream?.getTracks().forEach(track => {
      console.log(`Stopping ${track.kind} track on unmount (voice call)`, track);
      track.enabled = false;
      track.stop();
    });
    
    peersRef.current.forEach(peer => {
      peer.stream?.getTracks().forEach(track => { track.enabled = false; track.stop(); });
      if (peer.connection) {
        peer.connection.getTransceivers?.().forEach(transceiver => transceiver.stop?.());
        peer.connection.close();
      }
    });
    
    peersRef.current = [];
    setPeers([]);
    setLocalStream(null);
    
    navigator.mediaDevices.getUserMedia({ audio: false, video: false }) // Force release
      .catch(() => console.log('Forced microphone release attempt complete'));
  };

  const endCall = () => {
    cleanupResources();
    window.location.reload(); 
  };
  
  const setupDataChannel = (dataChannel: RTCDataChannel, peerId: string, isPrimaryChannel: boolean) => {
    dataChannel.onopen = () => {
      console.log(`Voice data channel with ${peerId} is open. Primary: ${isPrimaryChannel}`);
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        if (peerIndex !== -1) {
          if (isPrimaryChannel) newPeers[peerIndex].dataChannelReady = true;
          else newPeers[peerIndex].remoteDataChannelReady = true;
        }
        return newPeers;
      });
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isPrimaryChannel) peersRef.current[refIndex].dataChannelReady = true;
        else peersRef.current[refIndex].remoteDataChannelReady = true;
      }
      if (isAudioMuted) { // Send initial mute state
        safeSendThroughDataChannel(peerId, { type: 'status', audioMuted: isAudioMuted });
      }
    };
    
    dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as DataChannelMessage;
        console.log(`Received voice data message from ${peerId}:`, message);
        if (message.type === 'status') {
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
            if (peerIndex !== -1) {
              newPeers[peerIndex].isRemoteAudioMuted = message.audioMuted;
              const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
              if (refIndex !== -1) peersRef.current[refIndex].isRemoteAudioMuted = message.audioMuted;
            }
            return newPeers;
          });
        }
      } catch (error) { console.error(`Error parsing voice data message from ${peerId}:`, error); }
    };
    
    dataChannel.onclose = () => {
      console.log(`Voice data channel with ${peerId} is closed`);
      const isInitiator = !dataChannel.label.includes('remote'); // Basic check
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        if (peerIndex !== -1) {
          if (isInitiator) newPeers[peerIndex].dataChannelReady = false;
          else newPeers[peerIndex].remoteDataChannelReady = false;
        }
        return newPeers;
      });
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isInitiator) peersRef.current[refIndex].dataChannelReady = false;
        else peersRef.current[refIndex].remoteDataChannelReady = false;
      }
    };
    
    dataChannel.onerror = (error) => {
      console.error(`Voice data channel error with ${peerId}:`, error);
      const isInitiator = !dataChannel.label.includes('remote');
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        if (peerIndex !== -1) {
          if (isInitiator) newPeers[peerIndex].dataChannelReady = false;
          else newPeers[peerIndex].remoteDataChannelReady = false;
        }
        return newPeers;
      });
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isInitiator) peersRef.current[refIndex].dataChannelReady = false;
        else peersRef.current[refIndex].remoteDataChannelReady = false;
      }
    };
  };

  const safeSendThroughDataChannel = (peerId: string, data: DataChannelMessage | string) => {
    const peer = peersRef.current.find(p => p.user_id === peerId);
    if (!peer) return false;
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    if (peer.dataChannel?.readyState === 'open' && peer.dataChannelReady) {
      try { peer.dataChannel.send(message); return true; }
      catch (error) { console.warn(`Error sending through primary voice data channel to ${peerId}:`, error); peer.dataChannelReady = false; }
    }
    if (peer.remoteDataChannel?.readyState === 'open' && peer.remoteDataChannelReady) {
      try { peer.remoteDataChannel.send(message); return true; }
      catch (error) { console.warn(`Error sending through remote voice data channel to ${peerId}:`, error); peer.remoteDataChannelReady = false; }
    }
    return false;
  };

  return {
    localStream, // Expose local stream for potential local audio visualization or direct manipulation
    peers, // Expose peers to render participant list, their audio status, etc.
    isAudioMuted,
    connectionStatus,
    toggleAudio,
    endCall,
    // No video or screen share related exports
  };
};

export default useVoiceCallWebRTC;
export type { PeerConnection as VoicePeerConnection }; // Exporting PeerConnection with a more specific name if needed
