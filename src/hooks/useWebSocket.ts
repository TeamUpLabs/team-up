import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@/types/Message';
import { useAuthStore } from '@/auth/authStore';

const SERVER_URL = 'http://localhost:8000';

export const useWebSocket = (projectId: string, channelId: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef(false); // 연결 중 상태를 추적하는 ref
  const isUnmountedRef = useRef(false); // 컴포넌트 언마운트 상태 추적

  // 메시지 중복 방지를 위한 Set
  const messageIdsRef = useRef<Set<string>>(new Set());
  const socketRef = useRef<WebSocket | null>(null);
  
  // 웹소켓 연결 생성 함수
  const createWebSocketConnection = useCallback(() => {
    // 이미 연결 중이거나 언마운트된 상태라면 처리하지 않음
    if (isConnectingRef.current || isUnmountedRef.current) {
      return;
    }
    
    // 연결 중 상태로 설정
    isConnectingRef.current = true;
    
    try {
      // 기존 연결 정리
      if (socketRef.current) {
        console.log(`이전 웹소켓 연결 정리`);
        socketRef.current.close();
      }
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      
      const user = useAuthStore.getState().user;
      if (!user || !user.id) {
        setError('사용자 정보가 없습니다. 로그인이 필요합니다.');
        setIsLoading(false);
        isConnectingRef.current = false;
        return;
      }

      console.log(`채널 ${channelId}에 웹소켓 연결 시도...`);
      const ws = new WebSocket(`ws://${SERVER_URL.replace('http://', '')}/ws/chat/${projectId}/${channelId}?user_id=${user.id.toString()}`);
      
      // 이벤트 리스너 등록 전에 소켓 참조 저장
      socketRef.current = ws;
      
      ws.onopen = () => {
        console.log(`채널 ${channelId}에 연결되었습니다.`);
        if (isUnmountedRef.current) {
          console.log('컴포넌트가 언마운트되었으므로 연결을 닫습니다.');
          ws.close(1000, "Component unmounted");
          return;
        }
        
        setIsConnected(true);
        setError(null);
        reconnectAttempts.current = 0;
        isConnectingRef.current = false;
        
        // 핑 메시지 주기적 전송 (20초마다)
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
        }
        
        pingIntervalRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            console.log('핑 메시지 전송');
            ws.send(JSON.stringify({ type: 'pong' }));
          }
        }, 20000);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          // 핑 메시지 처리
          if (data.type === 'ping') {
            console.log('핑 메시지 수신, 퐁 응답');
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: 'pong' }));
            }
            return;
          }
          
          // 시스템 또는 일반 메시지 처리
          const newMessage = data as Message;
          
          // 메시지 ID로 중복 체크
          const messageId = typeof newMessage.id === 'string' || typeof newMessage.id === 'number' 
            ? newMessage.id.toString() 
            : '';
            
          if (!messageIdsRef.current.has(messageId)) {
            messageIdsRef.current.add(messageId);
            
            // 시스템 메시지 타입 변환 처리
            if (newMessage.type === 'system' && newMessage.senderName) {
              // 기존 타입과 호환성 맞춤
              const adaptedMessage: Message = {
                ...newMessage,
                userId: 0,
                user: newMessage.senderName || 'System'
              };
              
              if (!isUnmountedRef.current) {
                setMessages((prev) => [...prev, adaptedMessage]);
              }
            } else {
              if (!isUnmountedRef.current) {
                setMessages((prev) => [...prev, newMessage]);
              }
            }
          }
        } catch (error) {
          console.error('메시지 처리 중 오류:', error);
        }
      };

      ws.onclose = (event) => {
        console.log(`채널 ${channelId} 연결 종료. 코드: ${event.code}, 이유: ${event.reason}`);
        
        // 이미 언마운트되었다면 아무 작업도 하지 않음
        if (isUnmountedRef.current) {
          return;
        }
        
        setIsConnected(false);
        isConnectingRef.current = false;
        
        // 이벤트 발생 시 참조 초기화
        if (socketRef.current === ws) {
          socketRef.current = null;
        }
        
        // 핑 인터벌 정리
        if (pingIntervalRef.current) {
          clearInterval(pingIntervalRef.current);
          pingIntervalRef.current = null;
        }
        
        // 정상적인 종료가 아니고 최대 재시도 횟수 이내라면 재연결 시도
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && !isUnmountedRef.current) {
          const timeout = Math.min(1000 * Math.pow(2, reconnectAttempts.current), 30000);
          console.log(`${timeout}ms 후 재연결 시도 (${reconnectAttempts.current + 1}/${maxReconnectAttempts})...`);
          
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttempts.current += 1;
            if (!isUnmountedRef.current) {
              createWebSocketConnection();
            }
          }, timeout);
        }
      };

      ws.onerror = (error) => {
        console.error('웹소켓 오류:', error);
        if (!isUnmountedRef.current) {
          setError('연결 중 오류가 발생했습니다.');
          isConnectingRef.current = false;
        }
      };

      return ws;
    } catch (error) {
      console.error('웹소켓 생성 오류:', error);
      if (!isUnmountedRef.current) {
        setError('웹소켓 연결을 생성할 수 없습니다.');
        setIsLoading(false);
        isConnectingRef.current = false;
      }
      return null;
    }
  }, [channelId]);

  // 초기 채팅 히스토리 로딩
  useEffect(() => {
    const fetchChatHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${SERVER_URL}/chat/${projectId}/${channelId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const history = await response.json() as Message[];
        
        // 중복 제거 및 메시지 ID 캐싱
        messageIdsRef.current.clear();
        const uniqueMessages = history.filter(msg => {
          const isDuplicate = messageIdsRef.current.has(msg.id.toString());
          if (!isDuplicate) messageIdsRef.current.add(msg.id.toString());
          return !isDuplicate;
        });
        
        setMessages(uniqueMessages);
        setError(null);
      } catch (error) {
        console.error('채팅 히스토리 로딩 오류:', error);
        setError('채팅 기록을 불러올 수 없습니다.');
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    // 언마운트 플래그 초기화
    isUnmountedRef.current = false;
    fetchChatHistory();
    
    return () => {
      // 컴포넌트 언마운트 시 플래그 설정
      isUnmountedRef.current = true;
    };
  }, [channelId]);

  // 웹소켓 연결 관리 - 최초 한 번만 실행되어야 함
  useEffect(() => {
    isUnmountedRef.current = false;
    createWebSocketConnection();

    // 정리 함수
    return () => {
      console.log('웹소켓 연결 정리 중...');
      // 컴포넌트 언마운트 시 플래그 설정
      isUnmountedRef.current = true;
      
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      
      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }
      
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close(1000, '사용자 페이지 이탈');
        socketRef.current = null;
      }
    };
  }, [channelId, createWebSocketConnection]);

  // 메시지 전송 함수
  const sendMessage = useCallback(async (message: Message) => {
    if (!isConnected || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('연결이 끊어졌습니다. 메시지를 전송할 수 없습니다.');
      return false;
    }
    
    try {
      // 웹소켓으로 메시지 전송
      socketRef.current.send(JSON.stringify(message));
      
      // 서버에 메시지 저장 (HTTP)
      await fetch(`${SERVER_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      
      // 메시지 ID 캐싱 (클라이언트 측에서 즉시 메시지를 표시하지 않고 서버에서 전달받는 방식)
      messageIdsRef.current.add(message.id.toString());
      
      return true;
    } catch (error) {
      console.error('메시지 전송 오류:', error);
      setError('메시지를 전송하는 중 오류가 발생했습니다.');
      return false;
    }
  }, [isConnected]);

  return { 
    messages, 
    sendMessage, 
    isConnected, 
    isLoading, 
    error,
    reconnect: useCallback(() => {
      if (!isConnectingRef.current && !isUnmountedRef.current) {
        createWebSocketConnection();
      }
    }, [createWebSocketConnection])
  };
}