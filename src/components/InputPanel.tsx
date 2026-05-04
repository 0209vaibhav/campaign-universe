'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Campaign } from '@/lib/types';
import { seedCampaigns, generateFromConcept } from '@/lib/data';

interface Props {
  campaign: Campaign;
  onCampaignChange: (c: Campaign) => void;
  onAddNode: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: '#0E0E0E',
  border: '1px solid #333',
  borderRadius: 0,
  color: '#F2EFE8',
  fontFamily: "'ABC Camera', sans-serif",
  fontSize: '12px',
  padding: '9px 11px',
  outline: 'none',
  resize: 'none',
  scrollbarWidth: 'none',
};

const dividerStyle: React.CSSProperties = {
  height: '1px',
  background: '#333',
  margin: '0 -20px',
};

export default function InputPanel({ campaign, onCampaignChange, onAddNode }: Props) {
  const [brand, setBrand] = useState('');
  const [concept, setConcept] = useState('');

  function handleBuild(e: React.FormEvent) {
    e.preventDefault();
    if (!brand.trim()) return;
    onCampaignChange(generateFromConcept(brand.trim(), concept.trim()));
  }

  return (
    <div
      style={{
        width: '296px',
        flexShrink: 0,
        height: '100%',
        borderRight: '1px solid #333',
        background: '#0E0E0E',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
      className="crosshatch"
    >
      {/* ── Logo ────────────────────────────────────────────── */}
      <div style={{ padding: '20px 20px 18px', borderBottom: '1px solid #333' }}>
        <Image
          src="/Hero Logo - Black.png"
          alt="Burn Studio"
          width={120}
          height={28}
          style={{ filter: 'invert(1)', opacity: 0.9, width: 120, height: 'auto' }}
          priority
          unoptimized
        />
        <p
          style={{
            fontFamily: "'Simpson', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '8px',
            color: '#5A5A5A',
            margin: '8px 0 0',
          }}
        >
          Campaign Universe
        </p>
      </div>

      {/* ── Scrollable body ─────────────────────────────────── */}
      <div className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
        {/* ── Input form ──────────────────────────────────── */}
        <form onSubmit={handleBuild} style={{ marginBottom: '0' }}>
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: "'Simpson', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '9px',
                color: '#6B6B6B',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Brand
            </label>
            <input
              style={inputStyle}
              value={brand}
              onChange={e => setBrand(e.target.value)}
              placeholder="e.g. Patagonia"
            />
          </div>

          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: "'Simpson', sans-serif",
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                fontSize: '9px',
                color: '#6B6B6B',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Concept
            </label>
            <textarea
              style={{ ...inputStyle, minHeight: '72px', lineHeight: '1.55' }}
              value={concept}
              onChange={e => setConcept(e.target.value)}
              placeholder="One-sentence creative concept…"
            />
          </div>

          <button
            type="submit"
            disabled={!brand.trim()}
            style={{
              width: '100%',
              background: brand.trim() ? '#BF4723' : '#1E1E1E',
              border: 'none',
              borderRadius: 0,
              color: brand.trim() ? '#F2EFE8' : '#3A3A3A',
              fontFamily: "'ABC Camera Medium', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              fontSize: '10px',
              padding: '12px',
              cursor: brand.trim() ? 'pointer' : 'default',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
          >
            Build Universe
          </button>
        </form>

        {/* ── Divider ─────────────────────────────────────── */}
        <div style={{ ...dividerStyle, margin: '20px -20px' }} />

        {/* ── Presets ─────────────────────────────────────── */}
        <div style={{ marginBottom: '6px' }}>
          <span
            style={{
              fontFamily: "'Simpson', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '9px',
              color: '#6B6B6B',
            }}
          >
            Presets
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {seedCampaigns.map(c => {
            const isActive = campaign.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => onCampaignChange(c)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  background: isActive ? 'rgba(191,71,35,0.1)' : 'transparent',
                  border: 'none',
                  borderLeft: isActive ? '2px solid #BF4723' : '2px solid transparent',
                  borderRadius: 0,
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease, border-color 0.15s ease',
                }}
              >
                <div
                  style={{
                    fontFamily: "'ABC Camera Medium', sans-serif",
                    fontSize: '12px',
                    color: isActive ? '#F2EFE8' : '#9A958C',
                    marginBottom: '2px',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {c.brand}
                </div>
                <div
                  style={{
                    fontFamily: "'Simpson', sans-serif",
                    textTransform: 'uppercase',
                    letterSpacing: '0.12em',
                    fontSize: '8px',
                    color: isActive ? '#BF4723' : '#5A5A5A',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {/* Extract quoted title */}
                  {c.concept.match(/"([^"]+)"/)?.[1] ?? c.id}
                </div>
              </button>
            );
          })}
        </div>

        {/* ── Divider ─────────────────────────────────────── */}
        <div style={{ ...dividerStyle, margin: '20px -20px' }} />

        {/* ── Active campaign info ─────────────────────────── */}
        <div style={{ marginBottom: '16px' }}>
          <div
            style={{
              fontFamily: "'Simpson', sans-serif",
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              fontSize: '9px',
              color: '#6B6B6B',
              marginBottom: '8px',
            }}
          >
            Active
          </div>
          <div
            style={{
              fontFamily: "'ABC Camera Medium', sans-serif",
              fontSize: '13px',
              color: '#F2EFE8',
              marginBottom: '4px',
            }}
          >
            {campaign.brand}
          </div>
          <div
            style={{
              fontFamily: "'ABC Camera', sans-serif",
              fontSize: '11px',
              color: '#6B6B6B',
              lineHeight: 1.5,
            }}
          >
            {campaign.nodes.filter(n => n.type === 'satellite').length} satellite nodes across{' '}
            {new Set(campaign.nodes.filter(n => n.type === 'satellite').map(n => n.platform)).size}{' '}
            platforms
          </div>
        </div>
      </div>

      {/* ── Footer: Add Node ────────────────────────────────── */}
      <div style={{ borderTop: '1px solid #333', padding: '14px 20px' }}>
        <button
          onClick={onAddNode}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #444',
            borderRadius: 0,
            color: '#9A958C',
            fontFamily: "'Simpson', sans-serif",
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            fontSize: '9px',
            padding: '11px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'border-color 0.2s, color 0.2s',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#BF4723';
            (e.currentTarget as HTMLButtonElement).style.color = '#BF4723';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = '#2A2A2A';
            (e.currentTarget as HTMLButtonElement).style.color = '#9A958C';
          }}
        >
          <span style={{ fontSize: '14px', lineHeight: 1 }}>+</span>
          Add Node
        </button>
      </div>
    </div>
  );
}
