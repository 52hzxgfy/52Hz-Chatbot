import fs from 'fs';
import path from 'path';
import { VerificationCode, VerificationResponse } from '@/lib/types';

export class VerificationService {
  private static readonly CODES_FILE = path.join(process.cwd(), 'data', 'verification-codes.json');

  static async verifyCode(code: string): Promise<VerificationResponse> {
    try {
      const codes = await this.loadCodes();
      const codeData = codes.find(c => c.code === code);

      if (!codeData || !codeData.isValid) {
        return { 
          success: false, 
          message: '无效的验证码',
          remainingUses: 0 
        };
      }

      if (codeData.usageCount >= 2) {
        codeData.isValid = false;
        await this.saveCodes(codes);
        return { 
          success: false, 
          message: '验证码已达到使用次数上限',
          remainingUses: 0 
        };
      }

      codeData.usageCount += 1;
      await this.saveCodes(codes);
      return { 
        success: true, 
        message: '验证成功',
        remainingUses: 2 - codeData.usageCount 
      };
    } catch (error) {
      console.error('验证过程发生错误:', error);
      return { 
        success: false, 
        message: '验证过程发生错误',
        remainingUses: 0 
      };
    }
  }

  private static async loadCodes(): Promise<VerificationCode[]> {
    const data = await fs.promises.readFile(this.CODES_FILE, 'utf8');
    return JSON.parse(data);
  }

  private static async saveCodes(codes: VerificationCode[]): Promise<void> {
    await fs.promises.writeFile(this.CODES_FILE, JSON.stringify(codes, null, 2));
  }
}