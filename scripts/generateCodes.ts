import * as fs from 'fs';
import * as path from 'path';
import { VerificationCode } from '@/lib/types';

// 生成6位随机数字验证码
function generateRandomCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 生成指定数量的验证码
function generateVerificationCodes(count: number): VerificationCode[] {
  const codes: VerificationCode[] = [];
  const usedCodes = new Set();

  while (codes.length < count) {
    const code = generateRandomCode();
    if (!usedCodes.has(code)) {
      usedCodes.add(code);
      codes.push({
        code,
        usageCount: 0,
        isValid: true
      });
    }
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

// 输出所有验证码到控制台，方便复制
console.log('生成的验证码列表:');
codes.forEach((code, index) => {
  console.log(`${index + 1}. ${code.code}`);
});

console.log('\n已生成150个验证码并保存到 data/verification-codes.json');