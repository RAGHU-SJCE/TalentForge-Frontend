import React from 'react';
import { FileQuestion } from "lucide-react";

const EmptyState = ({ icon, title, message, ctaText, onCtaClick }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      background: 'var(--color-surface)',
      border: '1px dashed var(--color-border)',
      borderRadius: '8px',
      textAlign: 'center',
      margin: '20px 0'
    }}>
      <div style={{ marginBottom: '15px', color: 'var(--color-text-light)' }}>
        {icon || <FileQuestion size={48} />}
      </div>
      <h3 style={{ margin: '0 0 10px 0', color: 'var(--color-secondary)' }}>
        {title || 'No Data Available'}
      </h3>
      <p style={{ color: 'var(--color-text-muted)', maxWidth: '400px', margin: '0 auto 20px auto' }}>
        {message || 'There is nothing to display here right now.'}
      </p>
      {ctaText && onCtaClick && (
        <button onClick={onCtaClick} className="btn btn-outline" style={{ marginTop: '10px' }}>
          {ctaText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
