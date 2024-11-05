import fs from 'fs';
import path from 'path';
import { VerificationCode } from '@/lib/types';

// 生成6位随机数字验证码
function generateRandomCode(): string {
  const min = 100000;
  const max = 999999;
  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

// 生成指定数量的验证码
function generateVerificationCodes(count: number): VerificationCode[] {
  const codes: VerificationCode[] = [];
  const usedCodes = new Set<string>();

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

try {
  // 获取项目根目录路径
  const rootDir = path.resolve(__dirname, '..');
  
  // 确保 data 目录存在
  const dataDir = path.join(rootDir, 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // 生成验证码
  const codes = generateVerificationCodes(150);
  
  // 保存到文件
  const filePath = path.join(dataDir, 'verification-codes.json');
  fs.writeFileSync(filePath, JSON.stringify(codes, null, 2));

  console.log('验证码生成成功！');
  console.log(`生成的验证码已保存到: ${filePath}`);
  console.log(`共生成 ${codes.length} 个验证码`);

} catch (error) {
  console.error('生成验证码时发生错误:', error);
  process.exit(1);
}