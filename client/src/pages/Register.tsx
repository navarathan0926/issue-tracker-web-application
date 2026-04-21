import { useState, type FC } from 'react';
import { Form, Button, Card, message, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../features/authSlice';
import { authService } from '../services/authService';
import FormInput from '../components/forms/FormInput';
import FormPassword from '../components/forms/FormPassword';
import { passwordPattern } from '../utils/patterns';

const { Title, Text } = Typography;

const Register: FC = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values: Record<string, string>) => {
    try {
      setLoading(true);
      const res = await authService.register(values);
      dispatch(loginSuccess({ token: res.data.token }));
      message.success('Registration successful');
      navigate('/');
    } catch (error: Error | unknown) {
      const msg = (error as any)?.response?.data?.message || 'Registration failed';
      message.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
      <Card
        style={{ width: 400, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', borderRadius: 12 }}
        styles={{ body: { padding: '32px' } }}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} style={{ margin: 0 }}>Create Account</Title>
          <Text type="secondary">Sign up to get started</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <FormInput
            name="email"
            placeholder="Email"
            prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
            rules={[
              { required: true, message: 'Please input your Email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          />

          <FormPassword
            name="password"
            placeholder="Password"
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            rules={[
              { required: true, message: 'Please input your Password!' },
              { pattern: passwordPattern.pattern, message: passwordPattern.message }
            ]}
          />

          <FormPassword
            name="confirm"
            placeholder="Confirm Password"
            prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
            dependencies={['password']}
            hasFeedback
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The new password that you entered do not match!'));
                },
              }),
            ]}
          />

          <Form.Item>
            <Button type="primary" htmlType="submit" style={{ width: '100%', marginTop: 8 }} loading={loading}>
              Sign up
            </Button>
          </Form.Item>
          
          <div style={{ textAlign: 'center' }}>
            <Text type="secondary">
              Already have an account? <Link to="/login">Sign in</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
