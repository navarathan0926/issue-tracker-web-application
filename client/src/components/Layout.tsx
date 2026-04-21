import React, { type FC } from 'react';
import { Button } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import type { RootState } from '../store';
import { LogOut, LayoutDashboard } from 'lucide-react';
import {
  StyledLayout,
  StyledHeader,
  LogoContainer,
  LogoIconWrapper,
  LogoTitle,
  UserSection,
  UserEmail,
  StyledContent,
  ContentWrapper,
  StyledFooter
} from './Layout.styles';

const Layout: FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <StyledLayout>
      <StyledHeader>
        <LogoContainer onClick={() => navigate('/')}>
          <LogoIconWrapper>
            <LayoutDashboard size={18} color="#fff" />
          </LogoIconWrapper>
          <LogoTitle>Issue Tracker</LogoTitle>
        </LogoContainer>

        {user && (
          <UserSection>
            <UserEmail>{user.email}</UserEmail>
            <Button type="text" icon={<LogOut size={16} />} onClick={handleLogout} danger>
              Logout
            </Button>
          </UserSection>
        )}
      </StyledHeader>
      
      <StyledContent>
        <ContentWrapper>
          <Outlet />
        </ContentWrapper>
      </StyledContent>
      
      <StyledFooter>
        Issue Tracker ©{new Date().getFullYear()} Created by Navarathan
      </StyledFooter>
    </StyledLayout>
  );
};

export default Layout;
