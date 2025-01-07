import useAuth from '@/hooks/useAuth';
import { login } from '@/services/auth';
import { Button, Form, Input, message } from 'antd';
import { useEffect } from 'react';
import { history } from 'umi';
import './index.less';

interface LoginParams {
  username: string;
  password: string;
}

export default function Login() {
  const [messageApi, contextHolder] = message.useMessage();
  const canUse = useAuth();

  const onFinish = async (values: LoginParams) => {
    const res = await login({
      username: values.username,
      password: values.password,
    });
    if (res.success) {
      messageApi.open({
        type: 'success',
        content: '登录成功',
      });
      if (res.data?.session?.access_token) {
        sessionStorage.setItem('token', res.data?.session?.access_token);
        sessionStorage.setItem('expires', `${res.data?.session?.expires_at}`);
      }
      history.push('/');
      return;
    }
    messageApi.open({
      type: 'error',
      content: '登录失败',
    });
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    const body = document.querySelector('body');
    if (body) {
      body.style.backgroundImage =
        'url(https://haowallpaper.com/link/common/file/previewFileImg/15789130517090624)';
      body.style.backgroundSize = 'cover';
    }
    if (canUse) {
      history.push('/');
    }
  }, []);

  return (
    <div className="login-container">
      {contextHolder}
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        layout="vertical"
      >
        <Form.Item>
          <div className="login-title">
            <h2>共享助教后台登录</h2>
          </div>
        </Form.Item>

        <Form.Item
          label="用户名"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="密码"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            登录
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
