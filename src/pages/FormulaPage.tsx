import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PageContainer } from '../components/PageContainer';
import { Microscope, Languages, Globe2 } from 'lucide-react';
import './FormulaPage.css';

export const FormulaPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <div className="formula-bg-dark">
        <div className="page-header" style={{ display: 'flex', alignItems: 'center', marginBottom: '24px', paddingTop: '8px' }}>
          <h1 className="text-2xl font-bold m-0" style={{ letterSpacing: '-0.5px' }}>Công thức học tập</h1>
        </div>

        <div className="formula-home-container">
          <div className="fh-card natural-science" onClick={() => navigate('/formulas/natural-science')}>
            <div className="fh-card-icon"><Microscope size={28} /></div>
            <h2>Khoa học tự nhiên</h2>
            <p>Toán • Vật lý • Hóa học • Sinh học</p>
          </div>

          <div className="fh-card language" onClick={() => navigate('/formulas/language')}>
            <div className="fh-card-icon"><Languages size={28} /></div>
            <h2>Ngôn ngữ</h2>
            <p>Ngữ văn • Tiếng Anh</p>
          </div>

          <div className="fh-card social-science" onClick={() => navigate('/formulas/social-science')}>
            <div className="fh-card-icon"><Globe2 size={28} /></div>
            <h2>Khoa học xã hội</h2>
            <p>Lịch sử • Địa lý • GDKT & Pháp luật</p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};
