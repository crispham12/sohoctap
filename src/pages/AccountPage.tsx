import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { LogOut, User, Bell, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import './AccountPage.css';
import './AccountPage.css';

export const AccountPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [completedTasks, setCompletedTasks] = React.useState(0);

  React.useEffect(() => {
    if (user) {
      supabase.from('tasks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_completed', true)
        .then(({ count }) => {
          if (count !== null) setCompletedTasks(count);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <PageContainer>
      <div className="account-bg-dark">
        <div className="page-header">
          <h1>Tài khoản</h1>
        </div>

        <div className="account-profile-section">
          <div className="account-avatar-wrapper">
            <div className="account-avatar">
              <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" />
            </div>
          </div>
          <h2 className="account-name">{user?.email || 'Người dùng'}</h2>
          <span className="account-role-badge">Học sinh / Sinh viên</span>
        </div>

        <div className="account-stats">
          <div className="account-stat-card">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Bài tập đã làm</span>
          </div>
          <div className="account-stat-card">
            <span className="stat-value">12</span>
            <span className="stat-label">Công thức lưu</span>
          </div>
        </div>

        <div className="account-menu">
          <button className="account-menu-item">
            <User size={20} className="menu-icon" />
            Thông tin cá nhân
            <ChevronRight size={18} className="menu-chevron" />
          </button>
          <button className="account-menu-item" onClick={() => navigate('/settings/notifications')}>
            <Bell size={20} className="menu-icon" style={{ color: '#3b82f6' }} />
            Cài đặt thông báo
            <ChevronRight size={18} className="menu-chevron" />
          </button>
        </div>

        <button className="btn-logout" onClick={handleLogout}>
          <LogOut size={20} />
          Đăng xuất
        </button>
      </div>
    </PageContainer>
  );
};
