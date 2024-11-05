import { Part } from '@google/generative-ai';

export interface Conversation {
  id: number;
  title: string;
  messages: Message[];
  lastUpdated: Date;
  isEditing?: boolean;
  modelType: ModelType;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export type ModelType = "Llama 3.1 70B" | "Gemini 1.5 Flash" | "Qwen/Qwen2.5-72B-Instruct";

export interface ApiKeys {
  "Llama 3.1 70B": string;
  "Gemini 1.5 Flash": string;
  "Qwen/Qwen2.5-72B-Instruct": string;
}

export interface ChatHistoryMessage {
  role: 'user' | 'model';
  parts: Part[];
}

export interface FileData {
  inlineData: {
    data: string;
    mimeType: string;
  };
}

export interface FileContent {
  fileData: FileData;
  text?: string;
}

// 添加验证码相关的类型定义
export interface VerificationCode {
  code: string;        // 6位数字验证码
  usageCount: number;  // 使用次数
  isValid: boolean;    // 是否有效
}

export interface VerificationResponse {
  success: boolean;    // 验证是否成功
  message: string;     // 响应消息
  remainingUses?: number; // 剩余使用次数
}
