import React, { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { SectionCard } from '../components/SectionCard';
import { ArrowLeft, Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultFormulas, type Formula, type FormulaGroup } from '../data/mockData';
import { FormulaFormModal } from '../components/FormulaFormModal';
import { ConfirmDeleteModal } from '../components/ConfirmDeleteModal';
import './FormulaPage.css';

const groupConfig = {
  'natural-science': {
    title: 'Khoa học tự nhiên',
    subjects: ['Toán', 'Vật lý', 'Hóa học', 'Sinh học'],
    color: '#0284c7'
  },
  'language': {
    title: 'Ngôn ngữ',
    subjects: ['Ngữ văn', 'Tiếng Anh'],
    color: '#ca8a04'
  },
  'social-science': {
    title: 'Khoa học xã hội',
    subjects: ['Lịch sử', 'Địa lý', 'Giáo dục kinh tế và pháp luật'],
    color: '#16a34a'
  }
};

export const FormulaGroupPage: React.FC = () => {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();

  const [formulas, setFormulas] = useLocalStorage<Formula[]>('formulas_db', defaultFormulas);
  const [activeSubject, setActiveSubject] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState('');

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFormula, setEditingFormula] = useState<Formula | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formulaToDelete, setFormulaToDelete] = useState<Formula | null>(null);

  if (!groupId || !groupConfig[groupId as FormulaGroup]) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Nhóm không tồn tại <button onClick={() => navigate('/formulas')}>Quay lại</button></div>;
  }

  const config = groupConfig[groupId as FormulaGroup];

  const filteredFormulas = useMemo(() => {
    return formulas.filter(f => {
      if (f.group !== groupId) return false;
      if (activeSubject !== 'Tất cả' && f.subject !== activeSubject) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return f.title.toLowerCase().includes(query) || f.content.toLowerCase().includes(query);
      }
      return true;
    });
  }, [formulas, groupId, activeSubject, searchQuery]);

  const handleSave = (formulaData: Partial<Formula>) => {
    if (editingFormula) {
      setFormulas(prev => prev.map(f => f.id === editingFormula.id ? { ...f, ...formulaData, updatedAt: Date.now() } as Formula : f));
    } else {
      const newFormula: Formula = {
        id: `f_${Date.now()}`,
        group: groupId as FormulaGroup,
        subject: formulaData.subject || config.subjects[0],
        title: formulaData.title || '',
        content: formulaData.content || '',
        note: formulaData.note || '',
        example: formulaData.example || '',
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      setFormulas(prev => [...prev, newFormula]);
    }
    setIsFormOpen(false);
    setEditingFormula(null);
  };

  const confirmDelete = (formula: Formula) => {
    setFormulaToDelete(formula);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = () => {
    if (formulaToDelete) {
      setFormulas(prev => prev.filter(f => f.id !== formulaToDelete.id));
    }
    setIsDeleteModalOpen(false);
    setFormulaToDelete(null);
  };

  return (
    <PageContainer>
      <div className="formula-bg-dark">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <button className="btn-icon" onClick={() => navigate('/formulas')}>
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold m-0" style={{ letterSpacing: '-0.5px' }}>{config.title}</h1>
        </div>

      <div className="formula-tabs" style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '16px', msOverflowStyle: 'none', scrollbarWidth: 'none' }}>
        <button
          className={`filter-tab ${activeSubject === 'Tất cả' ? 'active' : ''}`}
          onClick={() => setActiveSubject('Tất cả')}
        >
          Tất cả
        </button>
        {config.subjects.map(sub => (
          <button
            key={sub}
            className={`filter-tab ${activeSubject === sub ? 'active' : ''}`}
            onClick={() => setActiveSubject(sub)}
          >
            {sub}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <div className="search-bar" style={{ flex: 1, position: 'relative' }}>
          <Search className="search-icon" size={20} style={{ position: 'absolute', left: '12px', top: '10px', color: 'var(--color-text-hint)' }} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm công thức..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '10px 12px 10px 40px', borderRadius: '12px', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', fontSize: '15px' }}
          />
        </div>
        <button
          className="btn-white"
          onClick={() => { setEditingFormula(null); setIsFormOpen(true); }}
        >
          <Plus size={20} />
          <span className="hide-on-mobile">Thêm</span>
        </button>
      </div>

      <div className="formula-list" style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '100px' }}>
        {filteredFormulas.map(formula => (
          <SectionCard key={formula.id}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
              <div style={{ paddingRight: '12px' }}>
                <h3 className="text-lg font-bold text-primary" style={{ margin: 0 }}>{formula.title}</h3>
                <span className="text-xs text-secondary" style={{ backgroundColor: 'var(--color-border)', padding: '2px 8px', borderRadius: '12px', display: 'inline-block', marginTop: '6px' }}>{formula.subject}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button className="btn btn-primary" style={{ padding: '8px', width: '36px', height: '36px' }} onClick={() => { setEditingFormula(formula); setIsFormOpen(true); }}><Edit2 size={18} /></button>
                <button className="btn" style={{ backgroundColor: 'var(--color-danger)', color: 'white', padding: '8px', width: '36px', height: '36px' }} onClick={() => confirmDelete(formula)}><Trash2 size={18} /></button>
              </div>
            </div>

            <div className="formula-content" style={{ padding: '16px', backgroundColor: 'var(--color-primary-light)', borderRadius: '12px', fontFamily: 'monospace', textAlign: 'center', fontSize: '18px', color: 'var(--color-primary-dark)', overflowX: 'auto', whiteSpace: 'pre-wrap' }}>
              {formula.content}
            </div>

            {formula.note && (
              <div style={{ marginTop: '16px', fontSize: '14px', color: 'var(--color-text-main)' }}>
                <strong>Ghi chú:</strong>
                <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', color: 'var(--color-secondary)' }}>{formula.note}</p>
              </div>
            )}

            {formula.example && (
              <div style={{ marginTop: '12px', fontSize: '14px', color: 'var(--color-text-main)' }}>
                <strong>Ví dụ:</strong>
                <p style={{ margin: '4px 0 0', whiteSpace: 'pre-wrap', color: 'var(--color-secondary)' }}>{formula.example}</p>
              </div>
            )}
          </SectionCard>
        ))}

        {filteredFormulas.length === 0 && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'var(--color-surface)', borderRadius: '16px', border: '1px dashed var(--color-border)' }}>
            <p className="text-secondary" style={{ marginBottom: '16px' }}>Chưa có công thức nào.</p>
            <button className="btn-save" style={{ margin: '0 auto', display: 'inline-flex', padding: '12px 20px', borderRadius: '24px' }} onClick={() => { setEditingFormula(null); setIsFormOpen(true); }}>
              <Plus size={20} /> Thêm công thức đầu tiên
            </button>
          </div>
        )}
      </div>
      </div>

      <FormulaFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSave}
        initialData={editingFormula}
        subjects={config.subjects}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        title="Xóa công thức?"
        message={`Bạn có chắc muốn xóa công thức "${formulaToDelete?.title}" không? Hành động này không thể hoàn tác.`}
      />

    </PageContainer>
  );
};
