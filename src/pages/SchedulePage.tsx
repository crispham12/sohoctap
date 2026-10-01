import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { Modal } from '../components/Modal';
import { Plus, MapPin, Clock, Edit2, Trash2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { type Schedule } from '../data/mockData';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import './SchedulePage.css';
import '../components/FormulaFormModal.css';

const DOW_MAP: Record<string, number> = { 'Chủ nhật': 0, 'Thứ 2': 1, 'Thứ 3': 2, 'Thứ 4': 3, 'Thứ 5': 4, 'Thứ 6': 5, 'Thứ 7': 6 };
const DOW_REVERSE_MAP = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];

export const SchedulePage: React.FC = () => {
  const { user } = useAuth();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<Schedule | null>(null);
  
  const [formData, setFormData] = useState({
    subject: '',
    dayOfWeek: 'Thứ 2',
    startTime: '',
    endTime: '',
    room: ''
  });

  const fetchSchedules = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('schedules').select('*').eq('user_id', user.id);
    if (error) {
      setErrorMsg('Lỗi khi tải lịch học: ' + error.message);
    } else {
      setSchedules(data || []);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchSchedules();
  }, [user]);

  const handleOpenModal = (schedule?: any) => {
    if (schedule) {
      setEditingId(schedule.id);
      setFormData({
        subject: schedule.subject,
        dayOfWeek: DOW_REVERSE_MAP[schedule.day_of_week] || 'Thứ 2',
        startTime: schedule.start_time.substring(0, 5),
        endTime: schedule.end_time.substring(0, 5),
        room: schedule.room || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        subject: '',
        dayOfWeek: 'Thứ 2',
        startTime: '',
        endTime: '',
        room: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.subject || !formData.startTime || !formData.endTime) {
      alert('Vui lòng điền đủ tên môn, giờ bắt đầu và kết thúc');
      return;
    }
    
    if (formData.endTime <= formData.startTime) {
      alert('Giờ kết thúc phải lớn hơn giờ bắt đầu');
      return;
    }

    const payload = {
      user_id: user?.id,
      subject: formData.subject,
      day_of_week: DOW_MAP[formData.dayOfWeek],
      start_time: formData.startTime,
      end_time: formData.endTime,
      room: formData.room || null
    };

    if (editingId) {
      const { error } = await supabase.from('schedules').update(payload).eq('id', editingId);
      if (error) alert('Lỗi sửa lịch: ' + error.message);
    } else {
      const { error } = await supabase.from('schedules').insert([payload]);
      if (error) alert('Lỗi thêm lịch: ' + error.message);
    }
    
    setIsModalOpen(false);
    fetchSchedules();
  };

  const handleDelete = (schedule: any) => {
    setScheduleToDelete(schedule);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (scheduleToDelete) {
      const { error } = await supabase.from('schedules').delete().eq('id', scheduleToDelete.id);
      if (error) alert('Lỗi xóa lịch: ' + error.message);
      setIsDeleteModalOpen(false);
      setScheduleToDelete(null);
      fetchSchedules();
    }
  };

  // Sort by day and time
  const sortedSchedules = [...schedules].sort((a, b) => {
    if (a.day_of_week !== b.day_of_week) {
      return a.day_of_week - b.day_of_week;
    }
    return a.start_time.localeCompare(b.start_time);
  });

  return (
    <PageContainer>
      <div className="schedule-bg-dark">
        <div className="page-header">
          <h1>Lịch học</h1>
          <button
            className="btn-white"
            onClick={() => handleOpenModal()}
          >
            <Plus size={20} />
            <span className="hide-on-mobile">Thêm lịch</span>
          </button>
        </div>

        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>Đang tải lịch học...</div>
        ) : errorMsg ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{errorMsg}</div>
        ) : (
          <div className="schedule-cards">
            {sortedSchedules.map(schedule => (
              <div key={schedule.id} className="schedule-card-custom">
                <div className="schedule-main">
                  <div className="schedule-day-badge">{DOW_REVERSE_MAP[schedule.day_of_week]}</div>
                  <h3 className="schedule-title">{schedule.subject}</h3>
                  <div className="schedule-info-row">
                    <Clock size={16} className="schedule-info-icon" />
                    <span>{schedule.start_time.substring(0, 5)} - {schedule.end_time.substring(0, 5)}</span>
                  </div>
                  <div className="schedule-info-row">
                    <MapPin size={16} className="schedule-info-icon" />
                    <span>{schedule.room || 'Không có phòng'}</span>
                  </div>
                </div>
                <div className="schedule-actions">
                <button className="schedule-btn-icon" onClick={() => handleOpenModal(schedule)}>
                  <Edit2 size={16} />
                </button>
                <button className="schedule-btn-icon danger" onClick={() => handleDelete(schedule)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          {sortedSchedules.length === 0 && (
            <div className="schedule-empty">
              <p>Chưa có lịch học nào.</p>
              <button className="btn-save" style={{ margin: '0 auto', display: 'inline-flex', padding: '12px 20px', borderRadius: '24px' }} onClick={() => handleOpenModal()}>
                <Plus size={20} /> Thêm lịch học đầu tiên
              </button>
            </div>
          )}
        </div>
        )}

      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={editingId ? "Sửa lịch học" : "Thêm lịch học"}
      >
        <form onSubmit={handleSubmit} className="formula-form-container">
          <div className="form-group">
            <label className="form-label">Môn học *</label>
            <input className="form-input" placeholder="Ví dụ: Toán Cao Cấp" required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Thứ *</label>
            <select className="form-select" value={formData.dayOfWeek} onChange={e => setFormData({...formData, dayOfWeek: e.target.value})}>
              {['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div style={{ display: 'flex', gap: '16px' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Giờ bắt đầu *</label>
              <input type="time" required className="form-input" value={formData.startTime} onChange={e => setFormData({...formData, startTime: e.target.value})} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Giờ kết thúc *</label>
              <input type="time" required className="form-input" value={formData.endTime} onChange={e => setFormData({...formData, endTime: e.target.value})} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Phòng học</label>
            <input className="form-input" placeholder="Ví dụ: B1-302" value={formData.room} onChange={e => setFormData({...formData, room: e.target.value})} />
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn-save">Lưu lịch học</button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa lịch học?"
        message={`Bạn có chắc muốn xóa lịch học môn "${scheduleToDelete?.subject}" không? Hành động này không thể hoàn tác.`}
      />
    </PageContainer>
  );
};
