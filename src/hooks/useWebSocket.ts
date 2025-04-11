import { useState, useEffect } from 'react';
import { Message } from '@/types/Message';

export const useWebSocket = (channelId: string) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  // 초기 채팅 히스토리 로딩
  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:8000/chat/${channelId}`);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const history = await response.json();
        setMessages(history);
      } catch (error) {
        console.error('Error fetching chat history:', error);
        setMessages([]);
      }
    };

    fetchChatHistory();
  }, [channelId]);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${channelId}`);

    ws.onopen = () => {
      console.log(`채널 ${channelId} 연결됨`);
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const newMessage = JSON.parse(event.data);
      setMessages((prev) => {
        // 메시지 ID로 중복 체크
        const isDuplicate = prev.some(msg => msg.id === newMessage.id);
        if (isDuplicate) {
          return prev;
        }
        return [...prev, newMessage];
      });
    };

    ws.onclose = () => {
      console.log(`채널 ${channelId} 연결 종료`);
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      if (ws.readyState === 1) {
        ws.close();
      }
    };
  }, [channelId]);

  const sendMessage = async (message: Message) => {
    if (socket && isConnected) {
      socket.send(JSON.stringify(message));
    }
    
    try {
      // HTTP POST 요청만 수행하고 메시지 상태는 업데이트하지 않음
      await fetch(`http://localhost:8000/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return { messages, sendMessage, isConnected };
}