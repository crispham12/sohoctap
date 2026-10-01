import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { BookOpen, Atom, FlaskConical, Calendar, CheckSquare, Bell } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import './TodayPage.css';

export const TodayPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [pendingTasksCount, setPendingTasksCount] = useState(0);
  const [topTasks, setTopTasks] = useState<any[]>([]);
  const [todaySchedulesCount, setTodaySchedulesCount] = useState(0);
  const [topSchedules, setTopSchedules] = useState<any[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    if (!user) return;
    const fetchStats = async () => {
      // Pending tasks
      const { count: tasksCount, data: tasksData } = await supabase.from('tasks')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id).eq('is_completed', false).limit(2);
      if (tasksCount !== null) setPendingTasksCount(tasksCount);
      if (tasksData) setTopTasks(tasksData);

      // Today's schedules
      const currentDayOfWeek = new Date().getDay();
      const { count: schedulesCount, data: schedulesData } = await supabase.from('schedules')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id).eq('day_of_week', currentDayOfWeek).limit(2);
      if (schedulesCount !== null) setTodaySchedulesCount(schedulesCount);
      if (schedulesData) setTopSchedules(schedulesData);
    };
    fetchStats();
  }, [user, currentDate.getDate()]);

  const generateWeekDays = () => {
    const days = [];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    
    // Tính khoảng cách đến thứ 2 của tuần hiện tại
    const currentDayOfWeek = currentDate.getDay();
    const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(currentDate);
      date.setDate(currentDate.getDate() + distanceToMonday + i);
      days.push({
        dayName: dayNames[date.getDay()],
        dateNum: date.getDate(),
        isToday: date.toDateString() === currentDate.toDateString(),
        id: i
      });
    }
    return days;
  };

  const weekDays = generateWeekDays();
  
  return (
    <PageContainer>
      <div className="clubhouse-page">
        <div className="ch-header">
          <div className="ch-header-left" style={{ display: 'flex', gap: '18px', alignItems: 'center' }}>
            <button className="ch-icon-btn"><Bell size={26} strokeWidth={2.5} /></button>
            <button className="ch-pill-btn">😎</button>
          </div>
          <button className="ch-avatar-btn" onClick={() => navigate('/account')}>
            <img src="https://i.pravatar.cc/150?img=32" alt="Avatar" />
          </button>
        </div>

        <div className="week-calendar-container">
          <h2 className="week-calendar-header">Today</h2>
          <div className="week-calendar">
            {weekDays.map(day => (
              <div key={day.id} className={`calendar-day ${day.isToday ? 'active' : ''}`}>
                <span className="calendar-day-name">{day.dayName}</span>
                <span className="calendar-day-num">{day.dateNum}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="ch-cards-container">
          {/* Card: Tasks */}
          <div className="ch-card" onClick={() => navigate('/tasks')}>
            <div className="ch-card-header">
               <CheckSquare size={16} /> 
               <span>Nhiệm vụ hàng ngày</span>
            </div>
            <div className="ch-card-body">
               <div className="ch-card-info">
                 <div className="ch-card-title">Bạn có {pendingTasksCount} bài tập chưa làm 📚✏️</div>
                 <div className="ch-card-content">
                    {topTasks.map(t => (
                       <div key={t.id}>- {t.title}</div>
                    ))}
                 </div>
               </div>
            </div>
          </div>

          {/* Card: Formulas */}
          <div className="ch-card" onClick={() => navigate('/formulas')}>
            <div className="ch-card-header">
               <BookOpen size={16} /> 
               <span>Công thức học tập</span>
            </div>
            <div className="ch-card-body">
               <div className="ch-card-info">
                 <div className="ch-card-title">Tra cứu nhanh Toán, Lý, Hóa, Anh 🚀</div>
               </div>
               <div className="ch-icon-cluster">
                 <div className="ch-icon-circle bg-blue"><BookOpen size={20}/></div>
                 <div className="ch-icon-circle bg-green"><Atom size={20}/></div>
                 <div className="ch-icon-circle bg-yellow"><FlaskConical size={20}/></div>
               </div>
            </div>
          </div>

          {/* Card: Schedule */}
          <div className="ch-card" onClick={() => navigate('/schedule')}>
            <div className="ch-card-header">
               <Calendar size={16} /> 
               <span>Lịch học hôm nay</span>
            </div>
            <div className="ch-card-body">
               <div className="ch-card-info">
                 <div className="ch-card-title">
                   {todaySchedulesCount > 0 ? `Hôm nay có ${todaySchedulesCount} môn học ⏰` : 'Hôm nay được nghỉ ngơi ☕️'}
                 </div>
                 <div className="ch-card-content">
                    {topSchedules.map(s => (
                      <div key={s.id}><span style={{fontWeight: 600}}>{s.start_time.substring(0, 5)}</span>: {s.subject}</div>
                    ))}
                 </div>
               </div>
            </div>
          </div>
        </div>

      </div>
    </PageContainer>
  );
};
