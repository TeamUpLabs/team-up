import { useState, useEffect, useRef, useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import type { SharedFile } from '@/components/project/VideoCall/VideoCall';

interface UseWebRTCProps {
  channel_id: string;
  user_id: string;
  project_id?: string;
}

interface PeerConnection {
  user_id: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
  dataChannel?: RTCDataChannel;
  remoteDataChannel?: RTCDataChannel;
  isRemoteVideoOff?: boolean;
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
  videoOff: boolean;
  audioMuted: boolean;
}

interface FileShareMessage {
  type: 'file-shared';
  file: SharedFile;
}

type DataChannelMessage = StatusMessage | FileShareMessage;

const useWebRTC = ({ channel_id, user_id, project_id }: UseWebRTCProps) => {
  const { project } = useProject();
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isScreenSharePaused, setIsScreenSharePaused] = useState(false);
  const [screenShareError, setScreenShareError] = useState<string | null>(null);
  const [screenShareWithAudio, setScreenShareWithAudio] = useState(true);
  const [peers, setPeers] = useState<PeerConnection[]>([]);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<string>("연결 중...");
  const [sharedFiles, setSharedFiles] = useState<SharedFile[]>([]);
  
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const pendingConnectionsRef = useRef<{user_id: string, isInitiator: boolean}[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const SERVER_URL = process.env.NEXT_PUBLIC_API_URL;

  // Enhanced ICE servers configuration for NAT traversal
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
      { urls: 'stun:stun2.l.google.com:19302' },
      { urls: 'stun:stun3.l.google.com:19302' },
      { urls: 'stun:stun4.l.google.com:19302' },
      // Free TURN servers from Twilio or other providers could be added here
      // for production use, you should use your own TURN server
    ],
  };

  // Initialize WebRTC and get media stream
  useEffect(() => {
    const startCall = async () => {
      try {
        console.log("Starting video call, requesting media permissions...");
        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        
        console.log("Media access granted, setting up local stream");
        setLocalStream(stream);
        
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        
      } catch (error) {
        console.error('Error accessing media devices:', error);
        setConnectionStatus("카메라 또는 마이크 접근에 실패했습니다.");
      }
    };
    
    startCall();
    
    // Cleanup on component unmount
    return () => {
      cleanupResources();
    };
  }, []);

  // Connect to signaling server after media stream is available
  useEffect(() => {
    if (localStream) {
      console.log("Local stream is ready, connecting to signaling server");
      connectSignalingServer();
      
      // Process any pending connections that were waiting for the stream
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
    // Sync peersRef with peers state
    peersRef.current = peers;
  }, [peers, project_id, channel_id, user_id]);

  const connectSignalingServer = () => {
    const socketProtocol = SERVER_URL?.startsWith('https://') ? 'wss' : 'ws';
    const serverUrl = `${socketProtocol}://${SERVER_URL?.replace('http://', '').replace('https://', '')}/api/v1/projects/${project_id}/video-calls/ws?channel_id=${channel_id}&user_id=${user_id}`;
    
    console.log(`Connecting to signaling server at ${serverUrl}`);
    socketRef.current = new WebSocket(serverUrl);
    
    socketRef.current.onopen = () => {
      console.log('Connected to signaling server');
      setConnectionStatus("다른 참가자를 기다리는 중...");
    };
    
    socketRef.current.onmessage = async (event) => {
      console.log('Received message:', event.data);
      const message = JSON.parse(event.data) as SignalingMessage;
      
      switch(message.type) {
        case 'user-joined':
          // Create offer when a new user joins
          if (message.user_id) {
            console.log(`User joined: ${message.user_id}, creating offer`);
            setConnectionStatus(`${project?.members.find(member => member.user.id === Number(message.user_id))?.user.name}님이 참여했습니다.`);
            
            // Check if we already have a connection with this user
            const existingPeer = peersRef.current.find(p => p.user_id === message.user_id);
            if (!existingPeer) {
              if (localStream) {
                await createPeerConnection(message.user_id, true);
              } else {
                console.log(`Local stream not ready, queueing connection with ${message.user_id}`);
                pendingConnectionsRef.current.push({
                  user_id: message.user_id,
                  isInitiator: true
                });
              }
            } else {
              console.log(`Already have a connection with user ${message.user_id}, skipping`);
            }
          }
          break;
          
        case 'user-left':
          // Remove peer when a user leaves
          if (message.user_id) {
            console.log(`User left: ${message.user_id}`);
            setConnectionStatus(`${project?.members.find(member => member.user.id === Number(message.user_id))?.user.name}님이 나갔습니다.`);
            removePeer(message.user_id);
          }
          break;
          
        case 'offer':
          // Handle received offer
          console.log('Received offer from:', message.user_id);
          if (localStream) {
            await handleOffer(message);
          } else {
            console.log(`Local stream not ready, queueing offer from ${message.user_id}`);
            pendingConnectionsRef.current.push({
              user_id: message.user_id!,
              isInitiator: false
            });
            // Store the offer to handle it later
            if (message.user_id) {
              localStorage.setItem(`pending_offer_${message.user_id}`, JSON.stringify(message));
            }
          }
          break;
          
        case 'answer':
          // Handle received answer
          console.log('Received answer from:', message.user_id);
          await handleAnswer(message);
          break;
          
        case 'ice-candidate':
          // Handle received ICE candidate
          console.log('Received ICE candidate from:', message.user_id);
          await handleIceCandidate(message);
          break;
      }
    };
    
    socketRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      setConnectionStatus("WebSocket 연결 오류가 발생했습니다.");
    };
    
    socketRef.current.onclose = () => {
      console.log('Disconnected from signaling server');
      setConnectionStatus("서버와 연결이 종료되었습니다.");
    };
  };

  const createPeerConnection = async (targetUserId: string, isInitiator: boolean) => {
    try {
      if (!localStream) {
        console.error('No local stream available when creating peer connection. This should not happen.');
        setConnectionStatus("로컬 스트림을 사용할 수 없습니다. 새로고침 후 다시 시도해주세요.");
        return null;
      }
      
      // Check if peer connection already exists
      const existingPeer = peersRef.current.find(p => p.user_id === targetUserId);
      if (existingPeer) {
        console.log(`Peer connection with ${targetUserId} already exists`);
        return existingPeer.connection;
      }
      
      console.log(`Creating peer connection with ${targetUserId}, isInitiator: ${isInitiator}`);
      const peerConnection = new RTCPeerConnection(iceServers);
      
      // Create data channel or set up data channel handler
      let dataChannel: RTCDataChannel | undefined;
      
      if (isInitiator) {
        // If we're the initiator, create the data channel
        dataChannel = peerConnection.createDataChannel('status');
        console.log(`Created data channel for peer ${targetUserId}`);
        
        // Set up data channel event handlers
        setupDataChannel(dataChannel, targetUserId, true);
      } else {
        // If we're not the initiator, set up the handler for the data channel
        peerConnection.ondatachannel = (event) => {
          console.log(`Received data channel from peer ${targetUserId}`);
          const remoteDataChannel = event.channel;
          setupDataChannel(remoteDataChannel, targetUserId, false);
          
          // Update the peer with the remote data channel
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === targetUserId);
            
            if (peerIndex !== -1) {
              newPeers[peerIndex].remoteDataChannel = remoteDataChannel;
              
              // Also update the ref
              const refIndex = peersRef.current.findIndex(p => p.user_id === targetUserId);
              if (refIndex !== -1) {
                peersRef.current[refIndex].remoteDataChannel = remoteDataChannel;
              }
            }
            
            return newPeers;
          });
        };
      }
      
      // Create new peer object
      const newPeer = { 
        user_id: targetUserId, 
        connection: peerConnection,
        dataChannel
      };
      
      // Add the new peer to state
      setPeers(prev => [...prev, newPeer]);
      peersRef.current = [...peersRef.current, newPeer];
      
      // Log connection state changes for debugging
      peerConnection.onconnectionstatechange = () => {
        console.log(`Connection state changed to: ${peerConnection.connectionState} for peer ${targetUserId}`);
        if (peerConnection.connectionState === 'connected') {
          console.log(`Successfully connected with ${targetUserId}`);
          setConnectionStatus(`${targetUserId}님과 연결되었습니다.`);
        }
      };
      
      // Log ICE connection state changes
      peerConnection.oniceconnectionstatechange = () => {
        console.log(`ICE connection state changed to: ${peerConnection.iceConnectionState} for peer ${targetUserId}`);
      };

      peerConnection.onicegatheringstatechange = () => {
        console.log(`ICE gathering state: ${peerConnection.iceGatheringState} for peer ${targetUserId}`);
      };
      
      peerConnection.onsignalingstatechange = () => {
        console.log(`Signaling state: ${peerConnection.signalingState} for peer ${targetUserId}`);
      };
      
      // Add local tracks to the peer connection
      console.log(`Adding ${localStream.getTracks().length} local tracks to peer connection`);
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
      
      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`Generated ICE candidate for peer ${targetUserId}:`, event.candidate);
          sendSignalingMessage({
            type: 'ice-candidate',
            candidate: event.candidate,
            user_id,
            target: targetUserId
          });
        } else {
          console.log(`All ICE candidates have been generated for peer ${targetUserId}`);
        }
      };
      
      // Handle remote tracks
      peerConnection.ontrack = (event) => {
        console.log(`Received remote track from ${targetUserId}`, event.streams);
        
        if (event.streams && event.streams[0]) {
          console.log(`Setting remote stream for peer ${targetUserId}`);
          
          // Create a clone of the stream to ensure it's properly captured
          const remoteStream = new MediaStream();
          event.streams[0].getTracks().forEach(track => {
            remoteStream.addTrack(track);
          });
          
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === targetUserId);
            
            if (peerIndex !== -1) {
              newPeers[peerIndex].stream = remoteStream;
              
              // Also update the ref
              const refIndex = peersRef.current.findIndex(p => p.user_id === targetUserId);
              if (refIndex !== -1) {
                peersRef.current[refIndex].stream = remoteStream;
              }
            }
            
            return newPeers;
          });
        } else {
          console.warn('Received track event without streams');
        }
      };
      
      // If we're the initiator, create and send an offer
      if (isInitiator) {
        console.log('Creating offer as initiator');
        try {
          const offer = await peerConnection.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: true
          });
          
          console.log(`Setting local description (offer) for peer ${targetUserId}`);
          await peerConnection.setLocalDescription(offer);
          
          console.log(`Sending offer to peer ${targetUserId}`);
          sendSignalingMessage({
            type: 'offer',
            sdp: peerConnection.localDescription,
            user_id,
            target: targetUserId
          });
        } catch (error) {
          console.error(`Error creating offer for peer ${targetUserId}:`, error);
        }
      } else {
        // Check if we have a stored offer for this peer
        const storedOffer = localStorage.getItem(`pending_offer_${targetUserId}`);
        if (storedOffer) {
          console.log(`Found stored offer for ${targetUserId}, processing it now`);
          localStorage.removeItem(`pending_offer_${targetUserId}`);
          await handleOffer(JSON.parse(storedOffer));
        }
      }
      
      return peerConnection;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      setConnectionStatus("피어 연결 생성 중 오류가 발생했습니다.");
      return null;
    }
  };

  const handleOffer = async (message: SignalingMessage) => {
    if (!message.user_id || !message.sdp) {
      console.warn('Received offer without user_id or sdp');
      return;
    }
    
    if (!localStream) {
      console.log(`Cannot handle offer from ${message.user_id} - local stream not ready`);
      pendingConnectionsRef.current.push({
        user_id: message.user_id,
        isInitiator: false
      });
      localStorage.setItem(`pending_offer_${message.user_id}`, JSON.stringify(message));
      return;
    }
    
    const peerId = message.user_id;
    console.log(`Handling offer from ${peerId}`);
    
    // Check if we already have a connection with this peer
    const existingPeer = peersRef.current.find(p => p.user_id === peerId);
    let peerConnection;
    
    if (existingPeer) {
      console.log(`Using existing peer connection for ${peerId}`);
      peerConnection = existingPeer.connection;
    } else {
      peerConnection = await createPeerConnection(peerId, false);
    }
    
    if (peerConnection && message.sdp) {
      try {
        console.log(`Setting remote description (offer) from peer ${peerId}`);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        
        console.log(`Creating answer for peer ${peerId}`);
        const answer = await peerConnection.createAnswer();
        
        console.log(`Setting local description (answer) for peer ${peerId}`);
        await peerConnection.setLocalDescription(answer);
        
        console.log(`Sending answer to peer ${peerId}`);
        sendSignalingMessage({
          type: 'answer',
          sdp: peerConnection.localDescription,
          user_id,
          target: peerId
        });
        
        setConnectionStatus("연결 설정 중...");
      } catch (error) {
        console.error(`Error handling offer from peer ${peerId}:`, error);
        setConnectionStatus("오퍼 처리 중 오류가 발생했습니다.");
      }
    }
  };

  const handleAnswer = async (message: SignalingMessage) => {
    if (!message.user_id || !message.sdp) {
      console.warn('Received answer without user_id or sdp');
      return;
    }
    
    const peerId = message.user_id;
    console.log(`Handling answer from ${peerId}`);
    
    // Use ref to get the most up-to-date peers list
    const peer = peersRef.current.find(p => p.user_id === peerId);
    
    if (peer) {
      try {
        console.log(`Setting remote description (answer) from peer ${peerId}`);
        await peer.connection.setRemoteDescription(new RTCSessionDescription(message.sdp));
        setConnectionStatus("연결이 설정되었습니다.");
      } catch (error) {
        console.error(`Error handling answer from peer ${peerId}:`, error);
        setConnectionStatus("앤서 처리 중 오류가 발생했습니다.");
      }
    } else {
      console.warn(`No peer found for ID ${peerId} when handling answer`);
    }
  };

  const handleIceCandidate = async (message: SignalingMessage) => {
    if (!message.user_id || !message.candidate) {
      console.warn('Received ICE candidate without user_id or candidate');
      return;
    }
    
    const peerId = message.user_id;
    console.log(`Handling ICE candidate from ${peerId}`);
    
    // Use ref to get the most up-to-date peers list
    const peer = peersRef.current.find(p => p.user_id === peerId);
    
    if (peer) {
      try {
        console.log(`Adding ICE candidate for peer ${peerId}`);
        await peer.connection.addIceCandidate(new RTCIceCandidate(message.candidate));
      } catch (error) {
        console.error(`Error handling ICE candidate from peer ${peerId}:`, error);
      }
    } else {
      console.warn(`No peer found for ID ${peerId} when handling ICE candidate`);
    }
  };

  const removePeer = (peerId: string) => {
    console.log(`Removing peer ${peerId}`);
    
    // Find peer in ref first
    const peerIndex = peersRef.current.findIndex(p => p.user_id === peerId);
    if (peerIndex !== -1) {
      const peer = peersRef.current[peerIndex];
      
      // Mark channels as not ready first to prevent any new messages
      peer.dataChannelReady = false;
      peer.remoteDataChannelReady = false;
      
      // Safely close data channels
      try {
        if (peer.dataChannel) {
          if (peer.dataChannel.readyState !== 'closed') {
            peer.dataChannel.close();
          }
          peer.dataChannel = undefined;
        }
        
        if (peer.remoteDataChannel) {
          if (peer.remoteDataChannel.readyState !== 'closed') {
            peer.remoteDataChannel.close();
          }
          peer.remoteDataChannel = undefined;
        }
      } catch (e) {
        console.warn(`Error closing data channels for peer ${peerId}:`, e);
      }
      
      // Close the connection with proper cleanup
      try {
        // Remove all tracks
        const senders = peer.connection.getSenders();
        for (const sender of senders) {
          peer.connection.removeTrack(sender);
        }
        
        // Close all transceivers
        if (peer.connection.getTransceivers) {
          peer.connection.getTransceivers().forEach(transceiver => {
            if (transceiver.stop) {
              try {
                transceiver.stop();
              } catch (e) {
                console.warn('Error stopping transceiver:', e);
              }
            }
          });
        }
        
        // Close the connection
        peer.connection.close();
      } catch (e) {
        console.warn(`Error closing connection for peer ${peerId}:`, e);
      }
      
      // Remove from ref
      peersRef.current = peersRef.current.filter(p => p.user_id !== peerId);
      
      // Update state
      setPeers(prev => prev.filter(p => p.user_id !== peerId));
    }
  };

  const sendSignalingMessage = (message: SignalingMessage) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      console.log('Sending message:', message);
      socketRef.current.send(JSON.stringify(message));
    } else {
      console.warn('Cannot send message, socket is not open');
    }
  };

  const toggleAudio = () => {
    if (localStream) {
      const audioTracks = localStream.getAudioTracks();
      const newMutedState = !isAudioMuted;
      
      audioTracks.forEach(track => {
        // Double ensure muting by both disabling tracks and setting volume to zero
        track.enabled = !newMutedState;
        
        // Update all audio senders regardless of whether we're muting or unmuting
        try {
          // Get all audio senders from peer connections
          const sender = peersRef.current.flatMap(peer => 
            peer.connection.getSenders().filter(s => s.track?.kind === 'audio')
          );
          
          // Update all audio senders
          sender.forEach(s => {
            if (s.track) s.track.enabled = !newMutedState;
          });
        } catch (e) {
          console.warn("Error while updating audio tracks on senders:", e);
        }
        
        console.log(`Audio track ${track.id} muted: ${newMutedState}, enabled: ${!newMutedState}`);
      });
      
      // Send status update to all peers
      peersRef.current.forEach(peer => {
        const statusMessage: StatusMessage = {
          type: 'status',
          videoOff: isVideoOff,
          audioMuted: newMutedState
        };
        safeSendThroughDataChannel(peer.user_id, statusMessage);
      });
      
      setIsAudioMuted(newMutedState);
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTracks = localStream.getVideoTracks();
      const newVideoOffState = !isVideoOff;
      
      videoTracks.forEach(track => {
        track.enabled = !newVideoOffState;
      });
      
      // When turning video back ON, we need to replace all video tracks in peer connections
      // to ensure remote peers receive the updated video feed
      if (!newVideoOffState && videoTracks.length > 0) {
        const videoTrack = videoTracks[0];
        
        peersRef.current.forEach(peer => {
          try {
            const senders = peer.connection.getSenders();
            const videoSender = senders.find(sender => 
              sender.track?.kind === 'video'
            );
            
            if (videoSender) {
              console.log(`Replacing video track for peer ${peer.user_id} after turning video ON`);
              // First make sure track is enabled
              if (videoTrack) videoTrack.enabled = true;
              
              // Then replace track in sender
              videoSender.replaceTrack(videoTrack)
                .then(() => {
                  console.log(`Successfully replaced video track for peer ${peer.user_id}`);
                })
                .catch(err => {
                  console.error(`Error replacing video track for peer ${peer.user_id}:`, err);
                  
                  // Fallback: if replaceTrack fails, try to add the track directly
                  try {
                    // Remove existing track first
                    peer.connection.removeTrack(videoSender);
                    // Add the track back
                    peer.connection.addTrack(videoTrack, localStream);
                    console.log(`Fallback: Re-added video track for peer ${peer.user_id}`);
                  } catch (fallbackErr) {
                    console.error(`Fallback also failed for peer ${peer.user_id}:`, fallbackErr);
                  }
                });
            } else {
              // If no video sender exists, add the track
              console.log(`No video sender found for peer ${peer.user_id}, adding track`);
              peer.connection.addTrack(videoTrack, localStream);
            }
          } catch (e) {
            console.warn(`Error updating video track for peer ${peer.user_id}:`, e);
          }
        });
      } else {
        // When turning video OFF, just update the enabled state of existing tracks
        try {
          const senders = peersRef.current.flatMap(peer => 
            peer.connection.getSenders().filter(s => s.track?.kind === 'video')
          );
          
          senders.forEach(s => {
            if (s.track) s.track.enabled = !newVideoOffState;
          });
        } catch (e) {
          console.warn("Error while updating video tracks on senders:", e);
        }
      }
      
      console.log(`Video state changed: video off = ${newVideoOffState}, tracks enabled = ${!newVideoOffState}`);
      
      // Send status update to all peers
      peersRef.current.forEach(peer => {
        const statusMessage: StatusMessage = {
          type: 'status',
          videoOff: newVideoOffState,
          audioMuted: isAudioMuted
        };
        safeSendThroughDataChannel(peer.user_id, statusMessage);
      });
      
      setIsVideoOff(newVideoOffState);
    }
  };

  const cleanupResources = () => {
    console.log("Cleaning up WebRTC resources");
      
    // Close WebSocket connection
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ type: 'disconnect' }));
      socketRef.current.close();
      socketRef.current = null;
    }
    
    // Stop all tracks in local stream
    if (localStream) {
      const tracks = localStream.getTracks();
      tracks.forEach(track => {
        console.log(`Stopping ${track.kind} track on unmount`, track);
        track.enabled = false;
        track.stop();
      });
      
      // Clear reference in video element
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = null;
      }
    }
    
    // Close all peer connections and their streams
    peersRef.current.forEach(peer => {
      if (peer.stream) {
        const remoteTracks = peer.stream.getTracks();
        remoteTracks.forEach(track => {
          track.enabled = false;
          track.stop();
        });
      }
      
      if (peer.connection) {
        // Close all transceivers
        if (peer.connection.getTransceivers) {
          peer.connection.getTransceivers().forEach(transceiver => {
            if (transceiver.stop) {
              transceiver.stop();
            }
          });
        }
        peer.connection.close();
      }
    });
    
    // Clear references
    peersRef.current = [];
    setPeers([]);
    setLocalStream(null);
    
    // Force media devices release
    navigator.mediaDevices.getUserMedia({ audio: false, video: false })
      .catch(() => {
        // Expected error, but forces camera release
        console.log('Forced camera release attempt complete');
      });
    
    // Stop screen sharing if active
    if (screenShareStream) {
      screenShareStream.getTracks().forEach(track => track.stop());
      setScreenShareStream(null);
      setIsScreenSharing(false);
    }
  };

  const endCall = () => {
    cleanupResources();
    window.location.reload();
  };

  const setLocalVideoRef = useCallback((element: HTMLVideoElement | null) => {
    if (element) {
      localVideoRef.current = element;
      if (localStream) {
        element.srcObject = localStream;
      }
    } else {
      localVideoRef.current = null;
    }
  }, [localStream]);

  // Start screen sharing with options
  const startScreenShare = async (options?: { withAudio?: boolean }) => {
    try {
      // Clear previous errors
      setScreenShareError(null);
      
      // Stop any existing screen share
      if (screenShareStream) {
        await stopScreenShare();
      }
      
      // Set audio preference
      const withAudio = options?.withAudio !== undefined ? options.withAudio : screenShareWithAudio;
      setScreenShareWithAudio(withAudio);
      
      // Get screen stream with specified options
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          cursor: 'always',
          displaySurface: 'monitor',
          logicalSurface: true,
          frameRate: 30
        } as MediaTrackConstraints,
        audio: withAudio
      });
      
      // Store the stream
      setScreenShareStream(stream);
      setIsScreenSharing(true);
      setIsScreenSharePaused(false);
      
      // Replace video track in all peer connections with screen share track
      const videoTrack = stream.getVideoTracks()[0];
      
      if (videoTrack) {
        peersRef.current.forEach(peer => {
          const senders = peer.connection.getSenders();
          const videoSender = senders.find(sender => 
            sender.track?.kind === 'video'
          );
          
          if (videoSender) {
            videoSender.replaceTrack(videoTrack);
          }
        });
        
        // Handle track ending (user clicks "Stop sharing")
        videoTrack.onended = () => {
          stopScreenShare();
        };
      }
      
      return true;
    } catch (error) {
      console.error('Error starting screen share:', error);
      
      // Set appropriate error message
      if (error instanceof DOMException) {
        if (error.name === 'NotAllowedError') {
          setScreenShareError('화면 공유 권한이 거부되었습니다.');
        } else if (error.name === 'NotFoundError') {
          setScreenShareError('공유할 화면을 찾을 수 없습니다.');
        } else if (error.name === 'NotReadableError') {
          setScreenShareError('화면 캡처에 실패했습니다. 하드웨어 문제일 수 있습니다.');
        } else {
          setScreenShareError(`화면 공유 중 오류: ${error.message}`);
        }
      } else {
        setScreenShareError('화면 공유를 시작하는 중 알 수 없는 오류가 발생했습니다.');
      }
      
      return false;
    }
  };
  
  // Pause/Resume screen sharing
  const togglePauseScreenShare = () => {
    if (!screenShareStream) return false;
    
    const videoTracks = screenShareStream.getVideoTracks();
    if (videoTracks.length > 0) {
      const newPauseState = !isScreenSharePaused;
      videoTracks.forEach(track => {
        track.enabled = !newPauseState;
      });
      setIsScreenSharePaused(newPauseState);
      return true;
    }
    
    return false;
  };
  
  // Stop screen sharing
  const stopScreenShare = async () => {
    try {
      if (screenShareStream) {
        // Stop all tracks
        screenShareStream.getTracks().forEach(track => track.stop());
        
        // Replace screen share track with original video track in all peer connections
        if (localStream) {
          const videoTrack = localStream.getVideoTracks()[0];
          
          peersRef.current.forEach(peer => {
            const senders = peer.connection.getSenders();
            const videoSender = senders.find(sender => 
              sender.track?.kind === 'video'
            );
            
            if (videoSender && videoTrack) {
              videoSender.replaceTrack(videoTrack);
            }
          });
        }
        
        // Reset states
        setScreenShareStream(null);
        setIsScreenSharing(false);
        setIsScreenSharePaused(false);
        setScreenShareError(null);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error stopping screen share:', error);
      setScreenShareError('화면 공유를 중지하는 중 오류가 발생했습니다.');
      return false;
    }
  };

  // Update screen share audio
  const updateScreenShareAudio = (enabled: boolean) => {
    if (!screenShareStream) return false;
    
    // Update preference for future sessions
    setScreenShareWithAudio(enabled);
    
    // Try to update current session if possible
    const audioTracks = screenShareStream.getAudioTracks();
    if (audioTracks.length > 0) {
      audioTracks.forEach(track => {
        track.enabled = enabled;
      });
      return true;
    }
    
    return false;
  };

  // Setup data channel event handlers
  const setupDataChannel = (dataChannel: RTCDataChannel, peerId: string, isPrimaryChannel: boolean) => {
    dataChannel.onopen = () => {
      console.log(`Data channel with peer ${peerId} is open. Primary: ${isPrimaryChannel}`);
      
      // Update channel ready state
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        
        if (peerIndex !== -1) {
          if (isPrimaryChannel) {
            newPeers[peerIndex].dataChannelReady = true;
          } else {
            newPeers[peerIndex].remoteDataChannelReady = true;
          }
        }
        
        return newPeers;
      });
      
      // Also update the ref
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isPrimaryChannel) {
          peersRef.current[refIndex].dataChannelReady = true;
        } else {
          peersRef.current[refIndex].remoteDataChannelReady = true;
        }
      }
      
      // Send current state when data channel is open
      if (isVideoOff || isAudioMuted) {
        try {
          const statusMessage: StatusMessage = {
            type: 'status',
            videoOff: isVideoOff,
            audioMuted: isAudioMuted
          };
          safeSendThroughDataChannel(peerId, statusMessage);
        } catch (error) {
          console.warn(`Error sending initial status to peer ${peerId}:`, error);
        }
      }
    };
    
    dataChannel.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as DataChannelMessage;
        console.log(`Received message from peer ${peerId}:`, message);
        
        if (message.type === 'status') {
          // Update the peer's status in state
          setPeers(prev => {
            const newPeers = [...prev];
            const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
            
            if (peerIndex !== -1) {
              newPeers[peerIndex].isRemoteVideoOff = message.videoOff;
              newPeers[peerIndex].isRemoteAudioMuted = message.audioMuted;
              
              // Also update the ref
              const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
              if (refIndex !== -1) {
                peersRef.current[refIndex].isRemoteVideoOff = message.videoOff;
                peersRef.current[refIndex].isRemoteAudioMuted = message.audioMuted;
              }
            }
            
            return newPeers;
          });
        } else if (message.type === 'file-shared') {
          setSharedFiles(prevFiles => {
            const existingFileIndex = prevFiles.findIndex(f => f.id === message.file.id);
            let updatedFiles;
            if (existingFileIndex !== -1) {
              updatedFiles = [...prevFiles];
              updatedFiles[existingFileIndex] = message.file;
            } else {
              updatedFiles = [...prevFiles, message.file];
            }
            return updatedFiles.sort((a, b) => b.timestamp - a.timestamp);
          });
        }
      } catch (error) {
        console.error(`Error parsing message from peer ${peerId}:`, error);
      }
    };
    
    dataChannel.onclose = () => {
      console.log(`Data channel with peer ${peerId} is closed`);
      
      // Update channel ready state
      const isInitiator = !dataChannel.label.includes('remote');
      
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        
        if (peerIndex !== -1) {
          if (isInitiator) {
            newPeers[peerIndex].dataChannelReady = false;
          } else {
            newPeers[peerIndex].remoteDataChannelReady = false;
          }
        }
        
        return newPeers;
      });
      
      // Also update the ref
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isInitiator) {
          peersRef.current[refIndex].dataChannelReady = false;
        } else {
          peersRef.current[refIndex].remoteDataChannelReady = false;
        }
      }
    };
    
    dataChannel.onerror = (error) => {
      console.error(`Data channel error with peer ${peerId}:`, error);
      
      // Mark channel as not ready
      const isInitiator = !dataChannel.label.includes('remote');
      
      setPeers(prev => {
        const newPeers = [...prev];
        const peerIndex = newPeers.findIndex(p => p.user_id === peerId);
        
        if (peerIndex !== -1) {
          if (isInitiator) {
            newPeers[peerIndex].dataChannelReady = false;
          } else {
            newPeers[peerIndex].remoteDataChannelReady = false;
          }
        }
        
        return newPeers;
      });
      
      // Also update the ref
      const refIndex = peersRef.current.findIndex(p => p.user_id === peerId);
      if (refIndex !== -1) {
        if (isInitiator) {
          peersRef.current[refIndex].dataChannelReady = false;
        } else {
          peersRef.current[refIndex].remoteDataChannelReady = false;
        }
      }
    };
  };

  // Safe method to send data through a data channel
  const safeSendThroughDataChannel = (peerId: string, data: DataChannelMessage | string) => {
    const peer = peersRef.current.find(p => p.user_id === peerId);
    if (!peer) return false;
    
    const message = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Try primary data channel first
    if (peer.dataChannel && 
        peer.dataChannel.readyState === 'open' && 
        peer.dataChannelReady) {
      try {
        peer.dataChannel.send(message);
        return true;
      } catch (error) {
        console.warn(`Error sending through primary data channel to peer ${peerId}:`, error);
        // Mark as not ready
        peer.dataChannelReady = false;
      }
    }
    
    // Fall back to remote data channel if available
    if (peer.remoteDataChannel && 
        peer.remoteDataChannel.readyState === 'open' &&
        peer.remoteDataChannelReady) {
      try {
        peer.remoteDataChannel.send(message);
        return true;
      } catch (error) {
        console.warn(`Error sending through remote data channel to peer ${peerId}:`, error);
        // Mark as not ready
        peer.remoteDataChannelReady = false;
      }
    }
    
    return false;
  };

  // NEW function to share a file
  const shareFile = useCallback((file: SharedFile) => {
    // Add to local state first, ensuring it's sorted
    setSharedFiles(prevFiles => {
      const existingFileIndex = prevFiles.findIndex(f => f.id === file.id);
      let updatedFiles;
      if (existingFileIndex !== -1) {
        updatedFiles = [...prevFiles];
        updatedFiles[existingFileIndex] = file;
      } else {
        updatedFiles = [...prevFiles, file];
      }
      return updatedFiles.sort((a, b) => b.timestamp - a.timestamp);
    });

    // Broadcast to peers
    const message: FileShareMessage = { type: 'file-shared', file };
    peersRef.current.forEach(peer => {
      // No need to check peer.user_id !== userId, as peersRef should not contain self
      safeSendThroughDataChannel(peer.user_id, message);
    });
  }, []);

  return {
    localStream,
    screenShareStream,
    isScreenSharing,
    isScreenSharePaused,
    screenShareError,
    screenShareWithAudio,
    peers,
    isAudioMuted,
    isVideoOff,
    connectionStatus,
    toggleAudio,
    toggleVideo,
    startScreenShare,
    stopScreenShare,
    togglePauseScreenShare,
    updateScreenShareAudio,
    endCall,
    setLocalVideoRef,
    sharedFiles,
    shareFile
  };
};

export default useWebRTC;
export type { PeerConnection }; 