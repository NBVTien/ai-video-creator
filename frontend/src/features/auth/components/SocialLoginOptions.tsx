"use client";

import React from 'react';
import { signIn } from 'next-auth/react';

interface SocialLoginOptionsProps {
  mode?: 'login' | 'register';
}

export const SocialLoginOptions: React.FC<SocialLoginOptionsProps> = ({ mode = 'login' }) => {
  const handleGoogleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  return (
    <div className="w-full max-w-sm mx-auto space-y-3">
      <h2 className="text-xl font-bold text-center mb-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        {mode === 'login' ? 'Hoặc đăng nhập với' : 'Hoặc đăng ký với'}
      </h2>

      <button 
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 p-2.5 rounded-xl border hover:bg-blue-50 transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-blue-100 transform hover:-translate-y-0.5"
      >
        <div className="w-4 h-4">
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>
        <span className="font-medium text-sm">{mode === 'login' ? 'Đăng nhập bằng Google' : 'Đăng ký bằng Google'}</span>
      </button>

      <div className="text-center text-xs text-gray-600 mt-5 px-3 border-t pt-4">
        <p className="text-xs">
          Tôi đã đọc và xác nhận{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
          >
            Điều khoản của dịch vụ
          </a>{" "}
          cũng{" "}
          <a
            href="#"
            className="text-blue-600 hover:text-blue-700 hover:underline transition-colors font-medium"
          >
            Chính sách quyền riêng tư
          </a>{" "}
          của VideoCut
        </p>
      </div>
    </div>
  );
};
