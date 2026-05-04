'use client';

import { useState } from 'react';
import type { CampaignNode, Ring } from '@/lib/types';

const PLATFORMS = [
  'YouTube',
  'Instagram',
  'TikTok',
  'Spotify + Apple Podcasts',
  'Broadcast + YouTube',
  'Live Event',
  'Twitter/X',
  'Press',
  'Long-form',
];

interface Props {
  onAdd: (node: CampaignNode) => void;
  onClose: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0E0E0E',
  border: '1px solid #2A2A2A',
  borderRadius: 0,
  color: '#F2EFE8',
  fontFamily: "'ABC Camera', sans-serif",
  fontSize: '13px',
  padding: '9px 12px',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  fontFamily: "'Simpson', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '0.15em',
  fontSize: '9px',
  color: '#9A958C',
  display: 'block',
  marginBottom: '6px',
};

export default function AddNodeModal({ onAdd, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [platform, setPlatform] = useState(PLATFORMS[0]);
  const [format, setFormat] = useState('');
  const [duration, setDuration] = useState('');
  const [description, setDescription] = useState('');
  const [ring, setRing] = useState<Ring>(2);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({
      id: `node-${Date.now()}`,
      type: 'satellite',
      title: title.trim(),
      platform,
      format: format.trim() || 'TBD',
      duration: duration.trim() || 'TBD',
      description: description.trim() || '',
      ring,
    });
  }

  return (
    /* Backdrop */
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.72)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 50,
        animation: 'fadeIn 0.2s ease-out both',
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal */}
      <div
        style={{
          width: '460px',
          background: '#161616',
          border: '1px solid #1E1E1E',
          animation: 'slideUp 0.25s ease-out both',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid #1E1E1E',
          }}
        >
          <span
            style={{
              fontFamily: "'Simpson', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              fontSize: '10px',
              color: '#BF4723',
            }}
          >
            Add Node
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6B6B6B',
              fontSize: '18px',
              lineHeight: 1,
              padding: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Title</label>
              <input
                style={inputStyle}
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Training Day BTS"
                required
                autoFocus
              />
            </div>

            {/* Platform + Orbit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Platform</label>
                <select
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  value={platform}
                  onChange={e => setPlatform(e.target.value)}
                >
                  {PLATFORMS.map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Orbit</label>
                <select
                  style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}
                  value={ring}
                  onChange={e => setRing(Number(e.target.value) as Ring)}
                >
                  <option value={1}>Inner — Ring 1</option>
                  <option value={2}>Outer — Ring 2</option>
                </select>
              </div>
            </div>

            {/* Format + Duration */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Format</label>
                <input
                  style={inputStyle}
                  value={format}
                  onChange={e => setFormat(e.target.value)}
                  placeholder=":15, :30, Series…"
                />
              </div>
              <div>
                <label style={labelStyle}>Duration</label>
                <input
                  style={inputStyle}
                  value={duration}
                  onChange={e => setDuration(e.target.value)}
                  placeholder="15 sec, 6 × :30…"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description</label>
              <textarea
                style={{
                  ...inputStyle,
                  resize: 'vertical',
                  minHeight: '72px',
                  lineHeight: '1.5',
                }}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="One-line description of this content piece…"
              />
            </div>
          </div>

          {/* Footer */}
          <div style={{ padding: '0 20px 20px' }}>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#BF4723',
                border: 'none',
                borderRadius: 0,
                color: '#F2EFE8',
                fontFamily: "'Simpson', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.2em',
                fontSize: '10px',
                padding: '13px',
                cursor: 'pointer',
              }}
            >
              Add Node
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
