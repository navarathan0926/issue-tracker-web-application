import React from 'react';
import { Layout as AntLayout, Button } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import type { RootState } from '../store';
import { LogOut, LayoutDashboard } from 'lucide-react';

const { Header, Content, Footer } = AntLayout;

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#fff', padding: '0 24px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width: 32, height: 32, background: '#1677ff', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LayoutDashboard size={18} color="#fff" />
          </div>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1f1f1f' }}>Issue Tracker</h2>
        </div>

        {user && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ color: '#595959' }}>{user.email}</span>
            <Button type="text" icon={<LogOut size={16} />} onClick={handleLogout} danger>
              Logout
            </Button>
          </div>
        )}
      </Header>
      <Content style={{ padding: '24px 48px', overflow: 'initial' }}>
        <div style={{ background: '#fff', padding: 24, borderRadius: 8, minHeight: '80vh', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
          <Outlet />
        </div>
      </Content>
      <Footer style={{ textAlign: 'center', color: '#8c8c8c' }}>
        Issue Tracker ©{new Date().getFullYear()} Created by Navarathan
      </Footer>
    </AntLayout>
  );
};

export default Layout;
