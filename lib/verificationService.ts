import { VerificationCode, VerificationResponse } from './types';
import { createClient } from '@vercel/edge-config';

export class VerificationService {
  private static readonly edgeConfig = createClient(process.env.EDGE_CONFIG!);

  private static async updateEdgeConfig(codes: VerificationCode[]) {
    const response = await fetch('https://api.vercel.com/v1/edge-config/items', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.VERCEL_API_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [
          {
            operation: 'upsert',
            key: 'verification-codes',
            value: codes
          }
        ]
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update Edge Config');
    }
  }

  private static async getCodesFromEdgeConfig(): Promise<VerificationCode[]> {
    try {
      const codes = await this.edgeConfig.get('verification-codes');
      if (!codes || !Array.isArray(codes)) {
        return [];
      }
      return codes as unknown as VerificationCode[];
    } catch (error) {
      console.error('Error fetching codes:', error);
      throw error;
    }
  }

  static async verifyCode(code: string): Promise<VerificationResponse> {
    try {
      if (!process.env.EDGE_CONFIG_URL || !process.env.EDGE_CONFIG_TOKEN) {
        throw new Error('Edge Config 环境变量未设置');
      }

      const codes = await this.getCodesFromEdgeConfig();
      if (!Array.isArray(codes)) {
        throw new Error('验证码数据格式错误');
      }

      const codeData = codes.find(c => c.code === code);
      
      if (!codeData) {
        return { 
          success: false, 
          message: '验证码不存在',
          remainingUses: 0 
        };
      }

      if (!codeData.isValid) {
        return { 
          success: false, 
          message: '验证码已失效',
          remainingUses: 0 
        };
      }

      codeData.usageCount += 1;
      codeData.isValid = false;
      
      await this.updateEdgeConfig(codes);

      return { 
        success: true, 
        message: '验证成功',
        code: codeData.code,
        remainingUses: 0
      };
    } catch (error) {
      console.error('验证过程发生错误:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : '验证过程发生错误',
        remainingUses: 0
      };
    }
  }

  static async getAllCodes(): Promise<VerificationCode[]> {
    return this.getCodesFromEdgeConfig();
  }
}