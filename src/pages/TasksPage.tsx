import React, { useState } from 'react';
import { PageContainer } from '../components/PageContainer';
import { Modal } from '../components/Modal';
import { CheckCircle2, Circle, Clock, Edit2, Trash2, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import './TasksPage.css';
import '../components/FormulaFormModal.css'; // For the modal form
import './FormulaPage.css'; // For .btn-white

export const TasksPage: React.FC = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<any | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    deadline: '',
    note: ''
  });

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').eq('user_id', user.id);
    if (error) {
      setErrorMsg('Lỗi tải bài tập: ' + error.message);
    } else {
      setTasks(data || []);
    }
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchTasks();
  }, [user]);

  const handleOpenModal = (task?: any) => {
    if (task) {
      setEditingId(task.id);
      setFormData({
        title: task.title,
        subject: task.subject,
        deadline: new Date(task.deadline).toISOString().slice(0, 16),
        note: task.note || ''
      });
    } else {
      setEditingId(null);
      setFormData({
        title: '',
        subject: '',
        deadline: '',
        note: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.subject || !formData.deadline) {
      alert('Vui lòng điền đủ tên bài, môn học và deadline');
      return;
    }

    const payload = {
      user_id: user?.id,
      title: formData.title,
      subject: formData.subject,
      deadline: new Date(formData.deadline).toISOString(),
      note: formData.note || null
    };

    if (editingId) {
      const { error } = await supabase.from('tasks').update(payload).eq('id', editingId);
      if (error) alert('Lỗi sửa bài tập: ' + error.message);
    } else {
      const { error } = await supabase.from('tasks').insert([payload]);
      if (error) alert('Lỗi thêm bài tập: ' + error.message);
    }
    
    setIsModalOpen(false);
    fetchTasks();
  };

  const handleDelete = (task: any) => {
    setTaskToDelete(task);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      const { error } = await supabase.from('tasks').delete().eq('id', taskToDelete.id);
      if (error) alert('Lỗi xóa bài tập: ' + error.message);
      setIsDeleteModalOpen(false);
      setTaskToDelete(null);
      fetchTasks();
    }
  };

  const toggleStatus = async (task: any) => {
    const { error } = await supabase.from('tasks').update({ is_completed: !task.is_completed }).eq('id', task.id);
    if (error) alert('Lỗi cập nhật trạng thái: ' + error.message);
    fetchTasks();
  };

  const filteredTasks = tasks
    .filter(task => filter === 'all' ? true : (filter === 'completed' ? task.is_completed : !task.is_completed))
    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());

  const isOverdue = (deadline: string) => {
    return new Date(deadline).getTime() < new Date().getTime();
  };

  return (
    <PageContainer>
      <div className="tasks-bg-dark">
        <div className="page-header">
          <h1>Bài tập</h1>
          <button className="btn-white" onClick={() => handleOpenModal()}>
            <Plus size={20} /> <span className="hide-on-mobile">Thêm bài tập</span>
          </button>
        </div>

        <div className="filter-tabs">
          <button className={`filter-tab ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>Tất cả</button>
          <button className={`filter-tab ${filter === 'pending' ? 'active' : ''}`} onClick={() => setFilter('pending')}>Chưa làm</button>
          <button className={`filter-tab ${filter === 'completed' ? 'active' : ''}`} onClick={() => setFilter('completed')}>Đã xong</button>
        </div>

        <div className="task-list">
          {isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(255,255,255,0.6)' }}>Đang tải bài tập...</div>
          ) : errorMsg ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>{errorMsg}</div>
          ) : (
            <>
            {filteredTasks.map(task => {
              const overdue = !task.is_completed && isOverdue(task.deadline);
              return (
                <div key={task.id} className={`task-card-custom ${task.is_completed ? 'completed' : ''} ${overdue ? 'overdue' : ''}`}>
                  <button className="task-status-btn" onClick={() => toggleStatus(task)}>
                    {task.is_completed ? (
                      <CheckCircle2 color="#10b981" size={26} />
                    ) : (
                      <Circle color={overdue ? '#ef4444' : 'rgba(255,255,255,0.4)'} size={26} />
                    )}
                  </button>
                  
                  <div style={{ flex: 1 }}>
                    <h3 className="task-title">{task.title}</h3>
                    <div className="task-meta">
                      <span className="task-subject">{task.subject}</span>
                      <span className="task-deadline">
                        <Clock size={16} />
                        {new Date(task.deadline).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    {task.note && <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '8px' }}>{task.note}</div>}
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button className="schedule-btn-icon" onClick={() => handleOpenModal(task)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="schedule-btn-icon danger" onClick={() => handleDelete(task)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
            {filteredTasks.length === 0 && (
              <div className="tasks-empty">
                <p>Không có bài tập nào.</p>
                <button className="btn-white" onClick={() => handleOpenModal()}>
                  <Plus size={20} /> Thêm bài tập
                </button>
              </div>
            )}
            </>
          )}
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? "Sửa bài tập" : "Thêm bài tập"}>
        <form onSubmit={handleSubmit} className="formula-form-container">
          <div className="form-group">
            <label className="form-label">Tiêu đề bài tập *</label>
            <input className="form-input" required placeholder="Ví dụ: Làm bài tập toán trang 45" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Môn học *</label>
            <input className="form-input" required placeholder="Ví dụ: Toán Học" value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline *</label>
            <input type="datetime-local" required className="form-input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Ghi chú</label>
            <textarea className="form-textarea" placeholder="Ghi chú thêm..." value={formData.note} onChange={e => setFormData({...formData, note: e.target.value})} rows={3}></textarea>
          </div>
          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setIsModalOpen(false)}>Hủy</button>
            <button type="submit" className="btn-save">Lưu bài tập</button>
          </div>
        </form>
      </Modal>

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Xóa bài tập?"
        message={`Bạn có chắc muốn xóa bài tập "${taskToDelete?.title}" không? Hành động này không thể hoàn tác.`}
      />
    </PageContainer>
  );
};
