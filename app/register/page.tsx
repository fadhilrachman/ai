'use client';

import React from 'react';
import { Form, Input, Button, Card, Typography, Alert } from 'antd';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { message } from '@/lib/antd-static';
import Link from 'next/link';

const { Title, Text } = Typography;

const RegisterPage = () => {
  const router = useRouter();
  const [form] = Form.useForm();
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const registerMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await api.post('/auth/register/', values);
      return response.data;
    },
    onSuccess: (data, variables) => {
      message.success('Registration successful! Please verify your email.');
      router.push(`/verify-email?email=${encodeURIComponent(variables.email)}`);
    },
    onError: (error: any) => {
      if (axios.isAxiosError(error)) {
        const data = error.response?.data;
        let msg = 'Registration failed. Please check your details.';
        if (data && typeof data === 'object') {
          msg = Object.values(data).flat().join(' | ');
        } else if (typeof data === 'string') {
          msg = data;
        }
        setErrorMessage(msg);
      } else {
        setErrorMessage('An unexpected error occurred. Please try again.');
      }
    },
  });

  const onFinish = (values: any) => {
    setErrorMessage(null);
    registerMutation.mutate(values);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2b2d35] p-4 font-sans">
      <Card
        className="w-full max-w-md border-[#40434e] bg-[#1a1c22] shadow-2xl rounded-2xl p-4"
        variant="outlined"
      >
        <div className="mb-10 text-center">
          <Title level={2} className="!text-white !font-bold !mb-2 !text-3xl">
             Create Account
          </Title>
          <Text className="text-[#9ba1b0] text-base">
            Sign up to get started
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
            label={<span className="text-[#ECECF1] font-medium">Email Address</span>}
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
            rules={[
              { required: true, message: 'Please input your password!' },
              { min: 8, message: 'Password must be at least 8 characters!' },
            ]}
          >
            <Input.Password 
              placeholder="Create a password" 
              className="!bg-[#2b2d35] !border-[#40434e] !text-[#ECECF1] h-12 rounded-xl focus:!border-[#10A37F] hover:!border-[#10A37F]"
            />
          </Form.Item>

          <Form.Item
            name="confirm"
            label={<span className="text-[#ECECF1] font-medium">Confirm Password</span>}
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password 
              placeholder="Confirm your password" 
              className="!bg-[#2b2d35] !border-[#40434e] !text-[#ECECF1] h-12 rounded-xl focus:!border-[#10A37F] hover:!border-[#10A37F]"
            />
          </Form.Item>

          <Form.Item className="!mt-8 !mb-6">
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={registerMutation.isPending}
              className="h-14 font-bold text-lg rounded-full !bg-[#10A37F] hover:!bg-[#0d8e6d] border-none shadow-lg shadow-[#10A37F]/10 transition-all duration-200"
            >
              Sign Up
            </Button>
          </Form.Item>

          <div className="text-center pt-6 border-t border-[#40434e]">
            <Text className="text-[#8E8EA0] text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#3b82f6] hover:underline font-medium ml-1">
                Sign in
              </Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default RegisterPage;
