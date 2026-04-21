import React, { type FC } from 'react';
import { Form, Input } from 'antd';
import { type Rule } from 'antd/es/form';

interface FormInputProps {
  name: string;
  placeholder: string;
  prefix: React.ReactNode;
  rules: Rule[];
}

const FormInput: FC<FormInputProps> = ({ name, placeholder, prefix, rules }) => (
  <Form.Item name={name} rules={rules}>
    <Input prefix={prefix} placeholder={placeholder} />
  </Form.Item>
);

export default FormInput;
