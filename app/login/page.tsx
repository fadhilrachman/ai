'use client';

import { GoogleLogin } from '@react-oauth/google';
import React from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { message } from '@/lib/antd-static';
import Link from 'next/link';

const { Title, Text } = Typography;

interface LoginResponse {
  access?: string;
  refresh?: string;
  mfa_required?: boolean;
  message?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post<LoginResponse>('/auth/login/', values);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.mfa_required) {
        message.info(data.message || 'MFA is required. Please provide your MFA token.');
      } else if (data.access) {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        message.success('Login successful!');
        router.push('/');
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
         const msg = error.response?.data?.message || 'Invalid credentials or validation error.';
         setErrorMessage(typeof error.response?.data === 'string' ? error.response.data : msg);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error(error);
      }
    },
  });

  const googleLoginMutation = useMutation({
    mutationFn: async (token: string) => {
      const response = await api.post<LoginResponse>('/auth/google-login/', { token });
      return response.data;
    },
    onSuccess: (data: any) => {
      const accessToken = data.access || data.token;
      if (accessToken) {
        localStorage.setItem('access_token', accessToken);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        message.success('Google Login successful!');
        router.push('/');
      } else {
        message.error('Login failed: Token not received from server');
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const msg = error.response?.data?.message || 'Google Login failed.';
        setErrorMessage(msg);
      } else {
        setErrorMessage('An unexpected error occurred during Google Login.');
      }
      console.error(error);
    }
  });

  const onFinish = (values: any) => {
    setErrorMessage(null);
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2b2d35] p-4 font-sans">
      <Card
        className="w-full max-w-md border-[#40434e] bg-[#1a1c22] shadow-2xl rounded-2xl p-4"
        variant="outlined"
      >
        <div className="mb-10 text-center">
           <Title level={2} className="!text-white !font-bold !mb-2 !text-3xl">
             Welcome Back
           </Title>
           <Text className="text-[#9ba1b0] text-base">
             Please login with your account
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
          requiredMark={true}
          size="large"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            label={<span className="text-[#ECECF1] font-medium">Email</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input 
              placeholder="Enter your email" 
              className="!bg-[#2b2d35] !border-[#40434e] !text-[#ECECF1] h-12 rounded-xl focus:!border-[#10A37F] hover:!border-[#10A37F]" 
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-[#ECECF1] font-medium">Password</span>}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password 
              placeholder="Enter your password" 
              className="!bg-[#2b2d35] !border-[#40434e] !text-[#ECECF1] h-12 rounded-xl focus:!border-[#10A37F] hover:!border-[#10A37F]"
            />
          </Form.Item>

          <Form.Item className="!mt-8 !mb-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
              className="h-14 font-bold text-lg rounded-full !bg-[#10A37F] hover:!bg-[#0d8e6d] border-none shadow-lg shadow-[#10A37F]/10 transition-all duration-200"
            >
              Login
            </Button>
          </Form.Item>

          <div className="flex justify-center mb-8">
             <GoogleLogin
               onSuccess={(credentialResponse) => {
                 if (credentialResponse.credential) {
                   googleLoginMutation.mutate(credentialResponse.credential);
                 }
               }}
               onError={() => {
                 message.error('Google Login Failed');
               }}
               theme="filled_black"
               shape="pill"
               width="100%"
             />
          </div>
          
          <div className="space-y-3 pt-6 border-t border-[#40434e]">
            <div>
               <Text className="text-[#8E8EA0] text-sm">
                 Verify your email <Link href="/verify-email" className="text-[#3b82f6] hover:underline font-medium ml-1">Here</Link>
               </Text>
            </div>
            <div>
               <Text className="text-[#8E8EA0] text-sm">
                 Don't have an account? <Link href="/register" className="text-[#3b82f6] hover:underline font-medium ml-1">Register</Link>
               </Text>
            </div>
            <div>
               <Text className="text-[#8E8EA0] text-sm">
                 Forgot password? <Link href="#" className="text-[#3b82f6] hover:underline font-medium ml-1">Here</Link>
               </Text>
            </div>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
