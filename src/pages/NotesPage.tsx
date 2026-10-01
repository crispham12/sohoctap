import React from 'react';
import { PageContainer } from '../components/PageContainer';
import { Search, Plus } from 'lucide-react';
import { notes, type Note } from '../data/mockData';
import './NotesPage.css';

export const NotesPage: React.FC = () => {
  return (
    <PageContainer>
      <div className="page-header">
        <h1 className="text-2xl font-bold">Ghi chú</h1>
        <button className="btn btn-icon">
          <Plus size={20} />
        </button>
      </div>

      <div className="search-container">
        <div className="search-bar">
          <Search className="search-icon text-hint" size={20} />
          <input 
            type="text" 
            className="input-search with-icon" 
            placeholder="Tìm kiếm ghi chú..." 
          />
        </div>
      </div>

      <div className="notes-grid">
        {notes.map((note: Note) => (
          <div key={note.id} className="note-card bg-surface">
            <h3 className="font-semibold text-lg">{note.title}</h3>
            <p className="note-preview text-secondary text-sm">{note.preview}</p>
            <div className="note-date text-xs text-hint">{note.date}</div>
          </div>
        ))}
      </div>
    </PageContainer>
  );
};
