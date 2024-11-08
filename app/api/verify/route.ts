import { NextResponse } from 'next/server';
import { VerificationService } from '@/lib/verificationService';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (!code) {
      return NextResponse.json({ 
        success: false, 
        message: '验证码不能为空' 
      }, { status: 400 });
    }

    const result = await VerificationService.verifyCode(code);
    
    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        message: result.message 
      }, { status: 400 });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json({ 
      success: false, 
      message: error instanceof Error ? error.message : '验证过程发生错误' 
    }, { status: 500 });
  }
}