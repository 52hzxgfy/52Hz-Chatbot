import fs from 'fs';
import path from 'path';
import { VerificationCode } from '../lib/types';

// 生成6位随机数字
function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 生成指定数量的验证码
function generateVerificationCodes(count: number): VerificationCode[] {
  const codes: VerificationCode[] = [];
  for (let i = 0; i < count; i++) {
    codes.push({
      code: generateRandomCode(),
      usageCount: 0,
      isValid: true
    });
  }
  return codes;
}

// 确保data目录存在
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

// 生成150个验证码并保存到文件
const codes = generateVerificationCodes(150);
const filePath = path.join(dataDir, 'verification-codes.json');
fs.writeFileSync(filePath, JSON.stringify(codes, null, 2));

console.log('已生成150个验证码并保存到 data/verification-codes.json');