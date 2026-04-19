import styled from 'styled-components';
import { Card, Button } from 'antd';

export const AuthPageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
`;

export const AuthCard = styled(Card)`
  width: 400px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

  .ant-card-body {
    padding: 32px;
  }
`;

export const AuthCardHeader = styled.div`
  text-align: center;
  margin-bottom: 32px;

  h2.ant-typography {
    margin: 0;
  }
`;

export const AuthFooterText = styled.div`
  text-align: center;
`;

export const FullWidthButton = styled(Button)`
  width: 100%;
  margin-top: 8px;
`;
