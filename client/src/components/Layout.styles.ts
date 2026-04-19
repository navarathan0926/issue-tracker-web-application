import styled from 'styled-components';
import { Layout as AntLayout } from 'antd';

const { Header, Content, Footer } = AntLayout;

export const StyledLayout = styled(AntLayout)`
  min-height: 100vh;
`;

export const StyledHeader = styled(Header)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  padding: 0 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1;
`;

export const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`;

export const LogoIconWrapper = styled.div`
  width: 32px;
  height: 32px;
  background: #1677ff;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const LogoTitle = styled.h2`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f1f1f;
`;

export const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const UserEmail = styled.span`
  color: #595959;
`;

export const StyledContent = styled(Content)`
  padding: 24px 48px;
  overflow: initial;
`;

export const ContentWrapper = styled.div`
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  min-height: 80vh;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
`;

export const StyledFooter = styled(Footer)`
  text-align: center;
  color: #8c8c8c;
`;
