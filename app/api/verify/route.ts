import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verificationService';
import { RateLimiter } from '@/lib/rateLimiter';
import { headers } from 'next/headers';

export async function POST(request: Request) {
  try {
    // 获取客户端IP
    const forwardedFor = headers().get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';

    // 检查频率限制
    if (!RateLimiter.checkRateLimit(ip)) {
      return NextResponse.json({
        success: false,
        message: '请求过于频繁，请稍后再试',
        remainingUses: 0
      }, { status: 429 });
    }

    const { code } = await request.json();
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json({
        success: false,
        message: '请提供有效的验证码',
        remainingUses: 0
      }, { status: 400 });
    }

    const result = await VerificationService.verifyCode(code);
    return NextResponse.json({
      ...result,
      remainingAttempts: RateLimiter.getRemainingAttempts(ip)
    });
  } catch (error) {
    console.error('验证请求处理失败:', error);
    return NextResponse.json({
      success: false,
      message: '验证请求处理失败',
      remainingUses: 0
    }, { status: 500 });
  }
}