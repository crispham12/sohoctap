import React from 'react';
import { Modal } from './Modal';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, title, message }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p style={{ margin: '0 0 24px', color: 'var(--color-text-main)' }}>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
        <button className="btn" onClick={onClose}>Hủy</button>
        <button 
          className="btn" 
          style={{ backgroundColor: 'var(--color-danger)', color: 'white' }} 
          onClick={onConfirm}
        >
          Xác nhận xóa
        </button>
      </div>
    </Modal>
  );
};
