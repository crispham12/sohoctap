
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';

import { BottomNavigation } from './components/BottomNavigation';
import { AuthGuard } from './components/AuthGuard';
import { TodayPage } from './pages/TodayPage';
import { SchedulePage } from './pages/SchedulePage';
import { TasksPage } from './pages/TasksPage';
import { AccountPage } from './pages/AccountPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { FormulaPage } from './pages/FormulaPage';
import { FormulaGroupPage } from './pages/FormulaGroupPage';
import { NotificationSettingsPage } from './pages/NotificationSettingsPage';
import { NotificationManager } from './components/NotificationManager';
import './styles/global.css';

const MainLayout = () => (
  <div className="app-container">
    <NotificationManager />
    <Outlet />
    <BottomNavigation />
  </div>
);

function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<AuthGuard><MainLayout /></AuthGuard>}>
          <Route path="/" element={<TodayPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/formulas" element={<FormulaPage />} />
          <Route path="/formulas/:groupId" element={<FormulaGroupPage />} />
          <Route path="/settings/notifications" element={<NotificationSettingsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
