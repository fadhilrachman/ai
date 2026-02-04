'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import { message } from '@/lib/antd-static';
import Link from 'next/link';

const { Title, Text } = Typography;

const VerifyEmailContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get('email') || '';
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const verifyMutation = useMutation({
    mutationFn: async (values: { email: string; otp: string }) => {
      const response = await api.post('/auth/verify-email/', values);
      return response.data;
    },
    onSuccess: () => {
      message.success('Email verified successfully! You can now sign in.');
      router.push('/login');
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        setErrorMessage(error.response?.data?.message || error.response?.data?.detail || 'Invalid OTP.');
      } else {
        setErrorMessage('An unexpected error occurred.');
      }
    },
  });

  const resendMutation = useMutation({
    mutationFn: async (email: string) => {
      const response = await api.post('/auth/resend-email-otp/', { email });
      return response.data;
    },
    onSuccess: () => {
      message.success('OTP has been resent to your email.');
      setResendCooldown(300); // 5 minutes as per swagger
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message || 'Failed to resend OTP.');
      } else {
        message.error('An unexpected error occurred.');
      }
    }
  });

  const onFinish = (values: any) => {
    setErrorMessage(null);
    verifyMutation.mutate({
      email: values.email,
      otp: values.otp
    });
  };

  const handleResend = () => {
    const email = form.getFieldValue('email');
    if (!email) {
      message.error('Please enter your email first');
      return;
    }
    if (resendCooldown === 0) {
      resendMutation.mutate(email);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2b2d35] p-4 font-sans text-[#ECECF1]">
      <Card
        className="w-full max-w-md border-[#40434e] bg-[#1a1c22] shadow-2xl rounded-2xl p-4"
        variant="outlined"
      >
        <div className="mb-10 text-center">
          <Title level={2} className="!text-white !font-bold !mb-2 !text-3xl">
             Verify Email
          </Title>
          <Text className="text-[#9ba1b0] text-base">
            Enter the OTP code sent to your email
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="mb-8 bg-red-900/10 border-red-900/20 text-red-200 rounded-xl"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ email: initialEmail }}
          requiredMark={false}
          size="large"
          className="space-y-6"
        >
          <Form.Item
            name="email"
            label={<span className="text-[#ECECF1] font-medium">Email Address</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input 
              placeholder="Enter Email" 
              className="!bg-[#2b2d35] !border-[#40434e] !text-[#ECECF1] h-12 rounded-xl focus:!border-[#10A37F] hover:!border-[#10A37F]"
            />
          </Form.Item>

          <Form.Item
            name="otp"
            label={<span className="text-[#ECECF1] font-medium">OTP Code</span>}
            style={{ marginBottom: 12 }}
            rules={[
              { required: true, message: 'Please input the OTP!' },
              { len: 6, message: 'OTP must be 6 digits!' },
            ]}
          >
            <Input.OTP 
               length={6}
               formatter={(str) => str.toUpperCase()}
               className="verify-otp-input"
            />
          </Form.Item>

          <div className="mb-0 text-left">
            <Text className="text-[#8E8EA0] text-sm">
              Didn't receive code?
            </Text>
            <div className="mt-1">
              <button 
                type="button"
                onClick={handleResend}
                disabled={resendCooldown > 0 || resendMutation.isPending}
                className={`text-[#3b82f6] hover:text-[#60a5fa] font-medium underline transition-colors ${resendCooldown > 0 ? 'opacity-50 cursor-not-allowed no-underline' : 'cursor-pointer'}`}
              >
                {resendCooldown > 0 ? `Resend in ${Math.floor(resendCooldown/60)}m ${resendCooldown%60}s` : 'Resend OTP'}
              </button>
            </div>
          </div>

          <Form.Item className="!mt-8 !mb-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={verifyMutation.isPending}
              className="h-14 font-bold text-lg rounded-full !bg-[#10A37F] hover:!bg-[#0d8e6d] border-none shadow-lg shadow-[#10A37F]/10 transition-all duration-200"
            >
              Verify Email
            </Button>
          </Form.Item>

          <div className="text-center pt-6 border-t border-[#40434e]">
            <Text className="text-[#8E8EA0] text-sm">
              Back to <Link href="/login" className="text-[#3b82f6] hover:underline font-medium ml-1">Login</Link>
            </Text>
          </div>
        </Form>
      </Card>
      <style jsx global>{`
        .verify-otp-input .ant-input {
          background-color: #2b2d35 !important;
          border-color: #40434e !important;
          color: #ECECF1 !important;
          aspect-ratio: 1/1 !important;
          border-radius: 12px !important;
          font-size: 1.3rem !important;
          font-weight: bold !important;
          text-align: center !important;
          height: auto !important;
          width: 100% !important;
          margin: 0 !important;
        }
        .verify-otp-input .ant-input:focus {
          border-color: #10A37F !important;
          box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2) !important;
        }
        .verify-otp-input {
          display: flex !important;
          justify-content: space-between !important;
          gap: 10px !important;
        }
      `}</style>
    </div>
  );
};

const VerifyEmailPage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2b2d35] flex items-center justify-center text-[#ECECF1]">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
};

export default VerifyEmailPage;
