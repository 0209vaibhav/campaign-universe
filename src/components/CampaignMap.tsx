'use client';

import { useState } from 'react';
import type { Campaign, CampaignNode } from '@/lib/types';

/* ── SVG viewport constants ──────────────────────────────────── */
const W = 900;
const H = 680;
const CX = W / 2;   // 450
const CY = H / 2;   // 340
const R1 = 158;     // inner orbital radius
const R2 = 272;     // outer orbital radius
const HERO_R = 50;
const SAT1_R = 28;
const SAT2_R = 24;

const PLATFORM_ABBREV: Record<string, string> = {
  'YouTube': 'YT',
  'Instagram': 'IG',
  'TikTok': 'TT',
  'Spotify': 'SP',
  'Spotify + Apple Podcasts': 'POD',
  'Apple Podcasts': 'AP',
  'Broadcast': 'TV',
  'Broadcast + YouTube': 'TV',
  'Live Event': '◆',
  'Twitter/X': 'X',
  'YouTube + Twitch': 'LIVE',
  'Press': 'PR',
  'Long-form': 'LF',
};

function abbrev(platform: string): string {
  return PLATFORM_ABBREV[platform] ?? platform.slice(0, 2).toUpperCase();
}

function trunc(s: string, n: number): string {
  return s.length > n ? s.slice(0, n - 1) + '…' : s;
}

function getPositions(nodes: CampaignNode[]): Record<string, { x: number; y: number }> {
  const pos: Record<string, { x: number; y: number }> = {};
  const hero = nodes.find(n => n.type === 'hero');
  const ring1 = nodes.filter(n => n.type === 'satellite' && n.ring === 1);
  const ring2 = nodes.filter(n => n.type === 'satellite' && n.ring === 2);

  if (hero) pos[hero.id] = { x: CX, y: CY };

  ring1.forEach((node, i) => {
    const angle = (i / ring1.length) * Math.PI * 2 - Math.PI / 2;
    pos[node.id] = {
      x: CX + Math.cos(angle) * R1,
      y: CY + Math.sin(angle) * R1,
    };
  });

  ring2.forEach((node, i) => {
    const offset = ring1.length > 0 ? Math.PI / (ring2.length * 2) : 0;
    const angle = (i / ring2.length) * Math.PI * 2 - Math.PI / 2 + offset;
    pos[node.id] = {
      x: CX + Math.cos(angle) * R2,
      y: CY + Math.sin(angle) * R2,
    };
  });

  return pos;
}

/* ── Animation style helper ──────────────────────────────────── */
/*
 * CSS transform on a <g> overrides the SVG `transform` attribute.
 * Fix: outer <g> handles SVG positioning, inner <g> handles CSS animation.
 * The inner group scales from its own center (transform-box:fill-box).
 */
function animStyle(delay: number): React.CSSProperties {
  return {
    animationName: 'nodeAppear',
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-out',
    animationDelay: `${delay}ms`,
    animationFillMode: 'both',
  };
}

/* ── Hero node sub-component ─────────────────────────────────── */

interface HeroNodeProps {
  node: CampaignNode;
  pos: { x: number; y: number };
  isActive: boolean;
  onClickNode: (n: CampaignNode) => void;
  onHover: (id: string | null) => void;
}

function HeroNode({ node, pos, isActive, onClickNode, onHover }: HeroNodeProps) {
  return (
    /* Outer <g>: SVG positioning only — no CSS animation here */
    <g transform={`translate(${pos.x} ${pos.y})`}>
      {/* Inner <g>: CSS scale animation only — transform-box:fill-box keeps origin centered */}
      <g
        className="node-group"
        style={{ cursor: 'pointer', ...animStyle(0) }}
        onClick={() => onClickNode(node)}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
      >
        {/* Ambient glow disc */}
        <circle
          r={HERO_R + 6}
          fill="#BF4723"
          opacity={isActive ? 0.22 : 0.1}
          filter="url(#heroAmbient)"
          style={{ transition: 'opacity 0.25s ease' }}
        />
        {/* Pulse ring when active */}
        {isActive && (
          <circle
            r={HERO_R + 18}
            fill="none"
            stroke="#BF4723"
            strokeWidth="1"
            opacity="0.3"
            style={{ animation: 'pulseRing 2s ease-in-out infinite' }}
          />
        )}
        {/* Main filled circle */}
        <circle
          r={HERO_R}
          fill="#BF4723"
          filter={isActive ? 'url(#softGlow)' : undefined}
          style={{ transition: 'filter 0.2s ease' }}
        />
        {/* Play triangle */}
        <polygon points="-9,-12 18,0 -9,12" fill="rgba(255,255,255,0.88)" />
        {/* Title */}
        <text
          y={HERO_R + 20}
          textAnchor="middle"
          fill="#F2EFE8"
          fontSize="11"
          style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
        >
          {trunc(node.title, 18)}
        </text>
        {/* Format label */}
        <text
          y={HERO_R + 33}
          textAnchor="middle"
          fill="#9A958C"
          fontSize="8"
          letterSpacing="1.8"
          style={{ fontFamily: "'Simpson', sans-serif" }}
        >
          {node.format.toUpperCase()}
        </text>
      </g>
    </g>
  );
}

/* ── Main component ──────────────────────────────────────────── */

interface Props {
  campaign: Campaign;
  selectedNodeId: string | null;
  onNodeClick: (node: CampaignNode) => void;
}

export default function CampaignMap({ campaign, selectedNodeId, onNodeClick }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const positions = getPositions(campaign.nodes);
  const hero = campaign.nodes.find(n => n.type === 'hero') ?? null;
  const heroPos = hero ? (positions[hero.id] ?? null) : null;
  const satellites = campaign.nodes.filter(n => n.type === 'satellite');

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        animation: 'fadeIn 0.35s ease-out both',
      }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Crosshatch fill pattern */}
          <pattern id="xhatch" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
            <path d="M 0 0 L 16 16" stroke="rgba(255,255,255,0.022)" strokeWidth="0.5" fill="none" />
            <path d="M 16 0 L 0 16" stroke="rgba(255,255,255,0.022)" strokeWidth="0.5" fill="none" />
          </pattern>

          {/* Soft hover glow */}
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Hero ambient glow */}
          <filter id="heroAmbient" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── Background texture ──────────────────────────────── */}
        <rect width={W} height={H} fill="url(#xhatch)" />

        {/* ── Orbital ring guides ─────────────────────────────── */}
        <circle
          cx={CX} cy={CY} r={R1}
          fill="none"
          stroke="rgba(255,255,255,0.055)"
          strokeWidth="1"
          strokeDasharray="2 10"
        />
        <circle
          cx={CX} cy={CY} r={R2}
          fill="none"
          stroke="rgba(255,255,255,0.03)"
          strokeWidth="1"
          strokeDasharray="2 10"
        />

        {/* ── Connection lines ────────────────────────────────── */}
        {satellites.map((node, i) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const active = hoveredId === node.id || selectedNodeId === node.id;
          return (
            <line
              key={`line-${node.id}`}
              x1={CX} y1={CY}
              x2={pos.x} y2={pos.y}
              stroke="#BF4723"
              strokeWidth={active ? 1.5 : 0.8}
              strokeDasharray="4 9"
              opacity={active ? 0.55 : 0.22}
              style={{
                transition: 'opacity 0.2s ease, stroke-width 0.2s ease',
                animationName: 'lineAppear',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-out',
                animationDelay: `${100 + i * 70}ms`,
                animationFillMode: 'both',
              }}
            />
          );
        })}

        {/* ── Hero node ───────────────────────────────────────── */}
        {hero && heroPos && (
          <HeroNode
            node={hero}
            pos={heroPos}
            isActive={selectedNodeId === hero.id || hoveredId === hero.id}
            onClickNode={onNodeClick}
            onHover={setHoveredId}
          />
        )}

        {/* ── Satellite nodes ─────────────────────────────────── */}
        {satellites.map((node, i) => {
          const pos = positions[node.id];
          if (!pos) return null;
          const isHov = hoveredId === node.id;
          const isSel = selectedNodeId === node.id;
          const r = node.ring === 1 ? SAT1_R : SAT2_R;
          const delay = 200 + i * 100;

          return (
            /* Outer <g>: SVG positioning — no CSS animation */
            <g key={node.id} transform={`translate(${pos.x} ${pos.y})`}>
              {/* Inner <g>: CSS scale animation only */}
              <g
                className="node-group"
                style={{ cursor: 'pointer', ...animStyle(delay) }}
                onClick={() => onNodeClick(node)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {/* Hover / selected halo */}
                {(isSel || isHov) && (
                  <circle
                    r={r + 13}
                    fill="none"
                    stroke="#BF4723"
                    strokeWidth="1"
                    opacity={isSel ? 0.35 : 0.2}
                  />
                )}
                {/* Main satellite circle */}
                <circle
                  r={r}
                  fill={isSel ? 'rgba(191,71,35,0.18)' : '#161616'}
                  stroke="#BF4723"
                  strokeWidth={isSel ? 1.5 : node.ring === 1 ? 1.2 : 1}
                  filter={isHov ? 'url(#softGlow)' : undefined}
                  style={{ transition: 'fill 0.2s ease' }}
                />
                {/* Platform abbreviation */}
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSel ? '#F2EFE8' : '#BF4723'}
                  fontSize={node.ring === 1 ? 8 : 7}
                  letterSpacing="1"
                  style={{ fontFamily: "'Simpson', sans-serif" }}
                >
                  {abbrev(node.platform)}
                </text>
                {/* Node title */}
                <text
                  y={r + 17}
                  textAnchor="middle"
                  fill="#F2EFE8"
                  fontSize="10"
                  style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
                >
                  {trunc(node.title, 14)}
                </text>
                {/* Format label */}
                <text
                  y={r + 29}
                  textAnchor="middle"
                  fill="#6B6B6B"
                  fontSize="7.5"
                  letterSpacing="1"
                  style={{ fontFamily: "'Simpson', sans-serif" }}
                >
                  {node.format.toUpperCase()}
                </text>
              </g>
            </g>
          );
        })}

        {/* ── Canvas label ─────────────────────────────────────── */}
        <text
          x={W - 16}
          y={H - 14}
          textAnchor="end"
          fill="#2A2A2A"
          fontSize="9"
          letterSpacing="2"
          style={{ fontFamily: "'Simpson', sans-serif" }}
        >
          {satellites.length} EXTENSIONS
        </text>
      </svg>
    </div>
  );
}
