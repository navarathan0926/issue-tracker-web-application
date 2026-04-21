import React, { type FC } from 'react';
import { Form, Input } from 'antd';
import { type Rule } from 'antd/es/form';

interface FormPasswordProps {
  name: string;
  placeholder: string;
  prefix: React.ReactNode;
  rules: Rule[];
  dependencies?: string[];
  hasFeedback?: boolean;
}

const FormPassword: FC<FormPasswordProps> = ({ name, placeholder, prefix, rules, dependencies, hasFeedback }) => (
  <Form.Item name={name} rules={rules} dependencies={dependencies} hasFeedback={hasFeedback}>
    <Input.Password prefix={prefix} placeholder={placeholder} />
  </Form.Item>
);

export default FormPassword;
