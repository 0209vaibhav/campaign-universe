'use client';

import type { CampaignNode } from '@/lib/types';

interface Props {
  node: CampaignNode;
  onClose: () => void;
}

export default function NodeDetailPanel({ node, onClose }: Props) {
  return (
    <div
      className="absolute bottom-6 right-6"
      style={{
        width: '288px',
        animation: 'slideUp 0.28s ease-out both',
      }}
    >
      <div
        style={{
          background: '#161616',
          border: '1px solid #1E1E1E',
          /* no border-radius — brief non-negotiable */
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
            { label: 'Orbit', value: `Ring ${node.ring}` },
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
        <div style={{ padding: '12px 14px 14px' }}>
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
      </div>
    </div>
  );
}
