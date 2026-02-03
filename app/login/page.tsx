'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, message, Alert } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

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
        // Handle MFA flow here - for now just show message
        message.info(data.message || 'MFA is required. Please provide your MFA token.');
        // You might want to redirect to an MFA verification page or show an MFA input
      } else if (data.access) {
        localStorage.setItem('access_token', data.access);
        if (data.refresh) {
          localStorage.setItem('refresh_token', data.refresh);
        }
        message.success('Login successful!');
        router.push('/'); // Redirect to home/dashboard
      }
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
         const msg = error.response?.data?.message || 'Invalid credentials or validation error.';
         // Check if it's a field error struct (typical in Django/DRF sometimes)
         // Assuming simple message for now based on swagger "Invalid credentials"
         setErrorMessage(typeof error.response?.data === 'string' ? error.response.data : msg);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
        console.error(error);
      }
    },
  });

  const onFinish = (values: any) => {
    setErrorMessage(null);
    loginMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#343541] p-4">
      <Card
        className="w-full max-w-md border-[#565869] bg-[#202123] shadow-xl"
        bordered={false}
      >
        <div className="mb-8 text-center">
          <Title level={2} className="!text-[#ECECF1]">
            Welcome Back
          </Title>
          <Text className="text-[#8E8EA0]">
            Please sign in to your account
          </Text>
        </div>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            className="mb-6 bg-red-900/10 border-red-900/20 text-red-200"
          />
        )}

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          size="large"
        >
          <Form.Item
            name="email"
            label={<span className="text-[#ECECF1]">Email Address</span>}
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' },
            ]}
          >
            <Input
              placeholder="Enter your email"
              // Styles are handled by global css override for .ant-input
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-[#ECECF1]">Password</span>}
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password
              placeholder="Enter your password"
              // Styles are handled by global css override
            />
          </Form.Item>

          <Form.Item className="mb-4">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
              className="h-12 font-medium" 
              // primary button color is overridden in global css to be ChatGPT green
            >
              Sign In
            </Button>
          </Form.Item>
          
           <div className="text-center">
            <Text className="text-[#8E8EA0]">
              Don't have an account?{' '}
              <a onClick={() => message.info("Registration not implemented in this demo")} className="text-[#10A37F] hover:text-[#1ABC9C] cursor-pointer hover:underline">
                Sign up
              </a>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
