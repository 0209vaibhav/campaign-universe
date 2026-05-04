'use client';

import type { CampaignNode } from '@/lib/types';

interface Props {
  node: CampaignNode;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function NodeDetailPanel({ node, onClose, onDelete }: Props) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        width: '288px',
        animation: 'slideUp 0.28s ease-out both',
        zIndex: 20,
      }}
    >
      <div
        style={{
          background: '#161616',
          border: '1px solid #1E1E1E',
        }}
      >
        {/* Header */}
        <div
          style={{
            borderBottom: '1px solid #1E1E1E',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <span
            className="label"
            style={{ color: '#BF4723', letterSpacing: '0.18em', fontSize: '9px' }}
          >
            {node.platform}
          </span>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B6B6B',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 2px',
            }}
          >
            ×
          </button>
        </div>

        {/* Title */}
        <div style={{ padding: '14px 14px 10px' }}>
          <h3
            className="font-display"
            style={{ margin: 0, fontSize: '16px', color: '#F2EFE8', lineHeight: 1.2 }}
          >
            {node.title}
          </h3>
        </div>

        {/* Meta grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: '1px',
            background: '#1E1E1E',
            borderTop: '1px solid #1E1E1E',
            borderBottom: '1px solid #1E1E1E',
          }}
        >
          {[
            { label: 'Format', value: node.format },
            { label: 'Duration', value: node.duration },
            { label: node.type === 'hero' ? 'Type' : 'Orbit', value: node.type === 'hero' ? 'Hero Asset' : `Ring ${node.ring}` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: '#161616', padding: '10px 12px' }}>
              <div className="label" style={{ fontSize: '8px', marginBottom: '4px' }}>
                {label}
              </div>
              <div
                className="font-display"
                style={{ fontSize: '11px', color: '#F2EFE8', lineHeight: 1.3 }}
              >
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Description */}
        <div
          className="no-scrollbar"
          style={{ padding: '12px 14px 10px', maxHeight: '96px', overflowY: 'auto' }}
        >
          <p
            className="font-body"
            style={{
              margin: 0,
              fontSize: '12px',
              color: '#9A958C',
              lineHeight: 1.55,
            }}
          >
            {node.description}
          </p>
        </div>

        {/* Delete — only for satellite nodes */}
        {node.type === 'satellite' && (
          <div style={{ padding: '0 14px 14px' }}>
            <button
              onClick={() => { onDelete(node.id); onClose(); }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid #2A2A2A',
                borderRadius: 0,
                color: '#6B6B6B',
                fontFamily: "'Simpson', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.18em',
                fontSize: '8px',
                padding: '9px',
                cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#BF4723';
                (e.currentTarget as HTMLButtonElement).style.color = '#BF4723';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = '#2A2A2A';
                (e.currentTarget as HTMLButtonElement).style.color = '#6B6B6B';
              }}
            >
              Remove Node
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
