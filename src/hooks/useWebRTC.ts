import { useState, useEffect, useRef } from 'react';

interface UseWebRTCProps {
  channelId: string;
  userId: string;
  projectId?: string;
}

interface PeerConnection {
  userId: string;
  connection: RTCPeerConnection;
  stream?: MediaStream;
}

interface SignalingMessage {
  type: string;
  userId?: string;
  target?: string;
  sdp?: RTCSessionDescription | null;
  candidate?: RTCIceCandidate;
}

const useWebRTC = ({ channelId, userId, projectId }: UseWebRTCProps) => {
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
  
  const socketRef = useRef<WebSocket | null>(null);
  const peersRef = useRef<PeerConnection[]>([]);
  const pendingConnectionsRef = useRef<{userId: string, isInitiator: boolean}[]>([]);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

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
          await createPeerConnection(pending.userId, pending.isInitiator);
        });
        pendingConnectionsRef.current = [];
      }
    }
  }, [localStream, projectId, channelId, userId]);

  useEffect(() => {
    // Sync peersRef with peers state
    peersRef.current = peers;
  }, [peers]);

  const connectSignalingServer = () => {
    // Determine the WebSocket URL based on current protocol and host
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    
    // If in development mode (localhost), use the hardcoded backend URL
    const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
    const serverUrl = isLocalhost
      ? `ws://localhost:8000/project/${projectId}/ws/call/${channelId}/${userId}`
      : `${wsProtocol}//${host}/project/${projectId}/ws/call/${channelId}/${userId}`;
    
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
          if (message.userId) {
            console.log(`User joined: ${message.userId}, creating offer`);
            setConnectionStatus(`${message.userId} 사용자가 참여했습니다.`);
            
            // Check if we already have a connection with this user
            const existingPeer = peersRef.current.find(p => p.userId === message.userId);
            if (!existingPeer) {
              if (localStream) {
                await createPeerConnection(message.userId, true);
              } else {
                console.log(`Local stream not ready, queueing connection with ${message.userId}`);
                pendingConnectionsRef.current.push({
                  userId: message.userId,
                  isInitiator: true
                });
              }
            } else {
              console.log(`Already have a connection with user ${message.userId}, skipping`);
            }
          }
          break;
          
        case 'user-left':
          // Remove peer when a user leaves
          if (message.userId) {
            console.log(`User left: ${message.userId}`);
            setConnectionStatus(`${message.userId} 사용자가 나갔습니다.`);
            removePeer(message.userId);
          }
          break;
          
        case 'offer':
          // Handle received offer
          console.log('Received offer from:', message.userId);
          if (localStream) {
            await handleOffer(message);
          } else {
            console.log(`Local stream not ready, queueing offer from ${message.userId}`);
            pendingConnectionsRef.current.push({
              userId: message.userId!,
              isInitiator: false
            });
            // Store the offer to handle it later
            if (message.userId) {
              localStorage.setItem(`pending_offer_${message.userId}`, JSON.stringify(message));
            }
          }
          break;
          
        case 'answer':
          // Handle received answer
          console.log('Received answer from:', message.userId);
          await handleAnswer(message);
          break;
          
        case 'ice-candidate':
          // Handle received ICE candidate
          console.log('Received ICE candidate from:', message.userId);
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
      const existingPeer = peersRef.current.find(p => p.userId === targetUserId);
      if (existingPeer) {
        console.log(`Peer connection with ${targetUserId} already exists`);
        return existingPeer.connection;
      }
      
      console.log(`Creating peer connection with ${targetUserId}, isInitiator: ${isInitiator}`);
      const peerConnection = new RTCPeerConnection(iceServers);
      
      // Create new peer object
      const newPeer = { 
        userId: targetUserId, 
        connection: peerConnection 
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
            userId,
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
            const peerIndex = newPeers.findIndex(p => p.userId === targetUserId);
            
            if (peerIndex !== -1) {
              newPeers[peerIndex].stream = remoteStream;
              
              // Also update the ref
              const refIndex = peersRef.current.findIndex(p => p.userId === targetUserId);
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
            userId,
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
    if (!message.userId || !message.sdp) {
      console.warn('Received offer without userId or sdp');
      return;
    }
    
    if (!localStream) {
      console.log(`Cannot handle offer from ${message.userId} - local stream not ready`);
      pendingConnectionsRef.current.push({
        userId: message.userId,
        isInitiator: false
      });
      localStorage.setItem(`pending_offer_${message.userId}`, JSON.stringify(message));
      return;
    }
    
    const peerId = message.userId;
    console.log(`Handling offer from ${peerId}`);
    
    // Check if we already have a connection with this peer
    const existingPeer = peersRef.current.find(p => p.userId === peerId);
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
          userId,
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
    if (!message.userId || !message.sdp) {
      console.warn('Received answer without userId or sdp');
      return;
    }
    
    const peerId = message.userId;
    console.log(`Handling answer from ${peerId}`);
    
    // Use ref to get the most up-to-date peers list
    const peer = peersRef.current.find(p => p.userId === peerId);
    
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
    if (!message.userId || !message.candidate) {
      console.warn('Received ICE candidate without userId or candidate');
      return;
    }
    
    const peerId = message.userId;
    console.log(`Handling ICE candidate from ${peerId}`);
    
    // Use ref to get the most up-to-date peers list
    const peer = peersRef.current.find(p => p.userId === peerId);
    
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
    const peerIndex = peersRef.current.findIndex(p => p.userId === peerId);
    if (peerIndex !== -1) {
      // Close the connection
      peersRef.current[peerIndex].connection.close();
      
      // Remove from ref
      peersRef.current = peersRef.current.filter(p => p.userId !== peerId);
      
      // Update state
      setPeers(prev => prev.filter(p => p.userId !== peerId));
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
        
        // For some browsers, we might need to clone and replace the audio track
        if (newMutedState) {
          try {
            // Try to completely stop and replace the track in extreme cases
            const sender = peersRef.current.flatMap(peer => 
              peer.connection.getSenders().filter(s => s.track?.kind === 'audio')
            );
            
            // Update all audio senders with the mute state
            sender.forEach(s => {
              if (s.track) s.track.enabled = !newMutedState;
            });
          } catch (e) {
            console.warn("Error while enforcing audio mute:", e);
          }
        }
        
        console.log(`Audio track ${track.id} muted: ${newMutedState}, enabled: ${!newMutedState}`);
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
        
        // For some browsers, we might need to update all video senders
        if (newVideoOffState) {
          try {
            const sender = peersRef.current.flatMap(peer => 
              peer.connection.getSenders().filter(s => s.track?.kind === 'video')
            );
            
            // Update all video senders
            sender.forEach(s => {
              if (s.track) s.track.enabled = !newVideoOffState;
            });
          } catch (e) {
            console.warn("Error while enforcing video off:", e);
          }
        }
        
        console.log(`Video track ${track.id} off: ${newVideoOffState}, enabled: ${!newVideoOffState}`);
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

  const setLocalVideoRef = (element: HTMLVideoElement | null) => {
    if (element && localStream) {
      element.srcObject = localStream;
      localVideoRef.current = element;
    }
  };

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
    setLocalVideoRef
  };
};

export default useWebRTC;
export type { PeerConnection }; 