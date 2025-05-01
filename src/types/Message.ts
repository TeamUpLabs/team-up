export interface Message {
  id: number | string;
  projectId: string;
  channelId: string;
  userId: number;
  user: string;
  message: string;
  timestamp: string;
  type?: 'system' | 'user'; // 시스템 메시지 구분용
  senderName?: string; // 시스템 메시지용 표시 이름
}