import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { type Formula } from '../data/mockData';
import './FormulaFormModal.css';

interface FormulaFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Partial<Formula>) => void;
  initialData: Formula | null;
  subjects: string[];
}

export const FormulaFormModal: React.FC<FormulaFormModalProps> = ({ isOpen, onClose, onSave, initialData, subjects }) => {
  const [subject, setSubject] = useState(subjects[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [example, setExample] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setSubject(initialData.subject);
      setTitle(initialData.title);
      setContent(initialData.content);
      setNote(initialData.note || '');
      setExample(initialData.example || '');
    } else if (isOpen) {
      setSubject(subjects[0]);
      setTitle('');
      setContent('');
      setNote('');
      setExample('');
    }
  }, [initialData, isOpen, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSave({ subject, title, content, note, example });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Sửa công thức' : 'Thêm công thức'}>
      <form onSubmit={handleSubmit} className="formula-form-container">
        
        <div className="form-group">
          <label className="form-label">Môn học *</label>
          <select 
            value={subject} 
            onChange={e => setSubject(e.target.value)}
            className="form-select"
          >
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Tiêu đề *</label>
          <input 
            type="text" 
            value={title} 
            onChange={e => setTitle(e.target.value)}
            placeholder="Ví dụ: Định lý Pythagoras"
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Nội dung / Công thức *</label>
          <textarea 
            value={content} 
            onChange={e => setContent(e.target.value)}
            placeholder="Ví dụ: a² + b² = c²"
            required
            rows={3}
            className="form-textarea code-font"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ghi chú / Giải thích</label>
          <textarea 
            value={note} 
            onChange={e => setNote(e.target.value)}
            placeholder="Ví dụ: c là cạnh huyền..."
            rows={2}
            className="form-textarea"
          />
        </div>

        <div className="form-group">
          <label className="form-label">Ví dụ</label>
          <textarea 
            value={example} 
            onChange={e => setExample(e.target.value)}
            placeholder="Ví dụ: a = 3, b = 4 -> c = 5"
            rows={2}
            className="form-textarea code-font"
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onClose}>Hủy</button>
          <button type="submit" className="btn-save" disabled={!title.trim() || !content.trim()}>
            Lưu
          </button>
        </div>
      </form>
    </Modal>
  );
};
