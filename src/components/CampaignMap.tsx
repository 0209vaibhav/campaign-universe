'use client';

import { useState, useRef, useEffect } from 'react';
import type { Campaign, CampaignNode } from '@/lib/types';

/* ── SVG viewport constants ──────────────────────────────────── */
const W = 900;
const H = 680;
const CX = W / 2;
const CY = H / 2;
const R1 = 158;
const R2 = 272;
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
  'Live Event': 'LV',
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

// Split a title into at most two lines at a word boundary (~11 chars per line)
function splitTitle(title: string): [string, string] {
  if (title.length <= 12) return [title, ''];
  const words = title.split(' ');
  let line1 = '';
  for (const word of words) {
    const next = line1 ? line1 + ' ' + word : word;
    if (next.length > 11) break;
    line1 = next;
  }
  // If we couldn't split at all (one very long word), just use the whole title
  if (!line1) return [trunc(title, 13), ''];
  const line2 = title.slice(line1.length).trim();
  return [line1, trunc(line2, 13)];
}

function getBasePositions(nodes: CampaignNode[]): Record<string, { x: number; y: number }> {
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

function animStyle(delay: number): React.CSSProperties {
  return {
    animationName: 'nodeAppear',
    animationDuration: '0.5s',
    animationTimingFunction: 'ease-out',
    animationDelay: `${delay}ms`,
    animationFillMode: 'both',
  };
}

/* ── Hero node ───────────────────────────────────────────────── */

interface HeroNodeProps {
  node: CampaignNode;
  pos: { x: number; y: number };
  isActive: boolean;
  isDragging: boolean;
  onPointerDown: (e: React.PointerEvent) => void;
  onClickNode: (n: CampaignNode) => void;
  onHover: (id: string | null) => void;
}

function HeroNode({ node, pos, isActive, isDragging, onPointerDown, onClickNode, onHover }: HeroNodeProps) {
  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <g
        className="node-group"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          ...animStyle(0),
        }}
        onPointerDown={onPointerDown}
        onClick={() => onClickNode(node)}
        onMouseEnter={() => onHover(node.id)}
        onMouseLeave={() => onHover(null)}
      >
        <title>Click to view details · Drag to move</title>
        <circle
          r={HERO_R + 6}
          fill="#BF4723"
          opacity={isActive ? 0.22 : 0.1}
          filter="url(#heroAmbient)"
          style={{ transition: 'opacity 0.25s ease' }}
        />
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
        <circle
          r={HERO_R}
          fill="#BF4723"
          filter={isActive ? 'url(#softGlow)' : undefined}
          style={{ transition: 'filter 0.2s ease' }}
        />
        <polygon points="-9,-12 18,0 -9,12" fill="rgba(255,255,255,0.88)" />
        {(() => {
          const [l1, l2] = splitTitle(node.title);
          const formatY = l2 ? HERO_R + 46 : HERO_R + 33;
          return (
            <>
              <text
                y={HERO_R + 20}
                textAnchor="middle"
                fill="#F2EFE8"
                fontSize="11"
                style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
              >
                {l1}
              </text>
              {l2 && (
                <text
                  y={HERO_R + 33}
                  textAnchor="middle"
                  fill="#F2EFE8"
                  fontSize="11"
                  style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
                >
                  {l2}
                </text>
              )}
              <text
                y={formatY}
                textAnchor="middle"
                fill="#9A958C"
                fontSize="8"
                letterSpacing="1.8"
                style={{ fontFamily: "'Simpson', sans-serif" }}
              >
                {node.format.toUpperCase()}
              </text>
            </>
          );
        })()}
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
  const [manualPositions, setManualPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const svgRef = useRef<SVGSVGElement>(null);
  const dragRef = useRef<{
    id: string;
    ox: number; oy: number;
    mx: number; my: number;
    orbitRadius: number | null; // null = free drag (hero node)
  } | null>(null);
  const wasDragRef = useRef(false);

  /* ── Cancel drag if pointer leaves window ─────────────────── */
  useEffect(() => {
    const cancel = () => {
      dragRef.current = null;
      setDraggingId(null);
    };
    window.addEventListener('pointerup', cancel);
    return () => window.removeEventListener('pointerup', cancel);
  }, []);

  const basePositions = getBasePositions(campaign.nodes);

  function getPos(id: string) {
    return manualPositions[id] ?? basePositions[id] ?? { x: CX, y: CY };
  }

  function toSvgCoords(clientX: number, clientY: number) {
    const svg = svgRef.current;
    if (!svg) return null;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return null;
    return pt.matrixTransform(ctm.inverse());
  }

  function handleNodePointerDown(e: React.PointerEvent, node: CampaignNode) {
    e.preventDefault();
    e.stopPropagation();
    wasDragRef.current = false;
    const pt = toSvgCoords(e.clientX, e.clientY);
    if (!pt) return;
    const pos = getPos(node.id);
    const orbitRadius = node.type === 'satellite'
      ? (node.ring === 1 ? R1 : R2)
      : null; // hero is free to drag
    dragRef.current = { id: node.id, ox: pos.x, oy: pos.y, mx: pt.x, my: pt.y, orbitRadius };
  }

  function handleSvgPointerMove(e: React.PointerEvent) {
    if (!dragRef.current) return;
    const pt = toSvgCoords(e.clientX, e.clientY);
    if (!pt) return;
    const dx = pt.x - dragRef.current.mx;
    const dy = pt.y - dragRef.current.my;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) {
      wasDragRef.current = true;
      setDraggingId(dragRef.current.id);
    }
    if (!wasDragRef.current) return;
    const { id, ox, oy, orbitRadius } = dragRef.current;
    if (orbitRadius !== null) {
      // Constrain satellite to its ring — project pointer angle onto fixed radius
      const angle = Math.atan2(pt.y - CY, pt.x - CX);
      setManualPositions(prev => ({ ...prev, [id]: {
        x: CX + Math.cos(angle) * orbitRadius,
        y: CY + Math.sin(angle) * orbitRadius,
      } }));
    } else {
      setManualPositions(prev => ({ ...prev, [id]: { x: ox + dx, y: oy + dy } }));
    }
  }

  function handleSvgPointerUp() {
    dragRef.current = null;
    setDraggingId(null);
  }

  function handleNodeClick(node: CampaignNode) {
    if (wasDragRef.current) {
      wasDragRef.current = false;
      return;
    }
    onNodeClick(node);
  }

  const hero = campaign.nodes.find(n => n.type === 'hero') ?? null;
  const satellites = campaign.nodes.filter(n => n.type === 'satellite');

  return (
    <div style={{
      position: 'absolute', inset: 0, animation: 'fadeIn 0.35s ease-out both',
      backgroundColor: '#111',
      backgroundImage: [
        'repeating-linear-gradient(45deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 50%)',
        'repeating-linear-gradient(-45deg, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 1px, transparent 50%)',
      ].join(', '),
      backgroundSize: '16px 16px',
    }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        style={{ cursor: draggingId ? 'grabbing' : 'default' }}
        onPointerMove={handleSvgPointerMove}
        onPointerUp={handleSvgPointerUp}
      >
        <defs>
          <filter id="softGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="heroAmbient" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="18" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background handled by wrapper div CSS */}

        {/* Decorative depth rings */}
        <circle cx={CX} cy={CY} r={70}  fill="none" stroke="rgba(255,255,255,0.018)" strokeWidth="1" strokeDasharray="2 14" />
        <circle cx={CX} cy={CY} r={215} fill="none" stroke="rgba(255,255,255,0.02)"  strokeWidth="1" strokeDasharray="2 12" />
        <circle cx={CX} cy={CY} r={355} fill="none" stroke="rgba(255,255,255,0.012)" strokeWidth="1" strokeDasharray="2 16" />
        <circle cx={CX} cy={CY} r={420} fill="none" stroke="rgba(255,255,255,0.006)" strokeWidth="1" strokeDasharray="2 20" />
        {/* Orbit track rings — Ring 1 and Ring 2 */}
        <circle cx={CX} cy={CY} r={R1}  fill="none" stroke="rgba(191,71,35,0.45)"   strokeWidth="1.2" strokeDasharray="3 7" />
        <circle cx={CX} cy={CY} r={R2}  fill="none" stroke="rgba(191,71,35,0.30)"   strokeWidth="1" strokeDasharray="3 9" />

        {/* Connection lines — use live positions so lines follow dragged nodes */}
        {satellites.map((node, i) => {
          const heroPos = hero ? getPos(hero.id) : { x: CX, y: CY };
          const nodePos = getPos(node.id);
          const active = hoveredId === node.id || selectedNodeId === node.id;
          const anySelected = selectedNodeId !== null;
          const lineOpacity = active ? 0.55 : anySelected ? 0.07 : 0.22;
          return (
            <line
              key={`line-${node.id}`}
              x1={heroPos.x} y1={heroPos.y}
              x2={nodePos.x} y2={nodePos.y}
              stroke="#BF4723"
              strokeWidth={active ? 1.5 : 0.8}
              strokeDasharray="4 9"
              opacity={lineOpacity}
              style={{
                transition: 'opacity 0.2s ease',
                animationName: 'lineAppear',
                animationDuration: '0.5s',
                animationTimingFunction: 'ease-out',
                animationDelay: `${100 + i * 70}ms`,
                animationFillMode: 'both',
              }}
            />
          );
        })}

        {/* Hero node */}
        {hero && (
          <HeroNode
            node={hero}
            pos={getPos(hero.id)}
            isActive={selectedNodeId === hero.id || hoveredId === hero.id}
            isDragging={draggingId === hero.id}
            onPointerDown={e => handleNodePointerDown(e, hero)}
            onClickNode={handleNodeClick}
            onHover={setHoveredId}
          />
        )}

        {/* Satellite nodes */}
        {satellites.map((node, i) => {
          const pos = getPos(node.id);
          const isHov = hoveredId === node.id;
          const isSel = selectedNodeId === node.id;
          const isDrag = draggingId === node.id;
          const r = node.ring === 1 ? SAT1_R : SAT2_R;
          const anySelected = selectedNodeId !== null;
          const dimmed = anySelected && !isSel;

          return (
            <g key={node.id} transform={`translate(${pos.x} ${pos.y})`}>
              {/* State layer: scale + opacity — isolated from entry animation */}
              <g style={{
                transform: isSel ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.2s ease, opacity 0.2s ease',
                transformBox: 'fill-box' as React.CSSProperties['transformBox'],
                transformOrigin: 'center',
                opacity: dimmed ? 0.4 : 1,
              }}>
                <g
                  className="node-group"
                  style={{
                    cursor: isDrag ? 'grabbing' : 'grab',
                    ...animStyle(200 + i * 100),
                  }}
                  onPointerDown={e => handleNodePointerDown(e, node)}
                  onClick={() => handleNodeClick(node)}
                  onMouseEnter={() => setHoveredId(node.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <title>Click to view details · Drag to move</title>
                  {/* Solid selection ring */}
                  {isSel && (
                    <circle r={r + 9} fill="none" stroke="#BF4723" strokeWidth="2.5" opacity="1" />
                  )}
                  {/* Subtle hover ring */}
                  {isHov && !isSel && (
                    <circle r={r + 9} fill="none" stroke="#BF4723" strokeWidth="1" opacity="0.3" />
                  )}
                  <circle
                    r={r}
                    fill={isSel ? 'rgba(191,71,35,0.2)' : isDrag ? 'rgba(191,71,35,0.12)' : '#161616'}
                    stroke={isSel || isDrag ? '#BF4723' : node.ring === 1 ? '#BF4723' : 'rgba(191,71,35,0.55)'}
                    strokeWidth={isSel ? 2.5 : isDrag ? 1.5 : node.ring === 1 ? 1.2 : 1}
                    strokeDasharray={!isSel && !isDrag && node.ring === 2 ? '2 3' : undefined}
                    filter={isHov && !isSel ? 'url(#softGlow)' : undefined}
                    style={{ transition: 'fill 0.2s ease, stroke-width 0.2s ease' }}
                  />
                <text
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSel ? '#F2EFE8' : node.ring === 1 ? '#BF4723' : 'rgba(191,71,35,0.6)'}
                  fontSize={node.ring === 1 ? 8 : 7}
                  letterSpacing="1"
                  style={{ fontFamily: "'Simpson', sans-serif" }}
                >
                  {abbrev(node.platform)}
                </text>
                {(() => {
                  const [l1, l2] = splitTitle(node.title);
                  const formatY = l2 ? r + 42 : r + 29;
                  return (
                    <>
                      <text
                        y={r + 17}
                        textAnchor="middle"
                        fill="#F2EFE8"
                        fontSize="10"
                        style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
                      >
                        {l1}
                      </text>
                      {l2 && (
                        <text
                          y={r + 29}
                          textAnchor="middle"
                          fill="#F2EFE8"
                          fontSize="10"
                          style={{ fontFamily: "'ABC Camera Medium', sans-serif" }}
                        >
                          {l2}
                        </text>
                      )}
                      <text
                        y={formatY}
                        textAnchor="middle"
                        fill="#6B6B6B"
                        fontSize="7.5"
                        letterSpacing="1"
                        style={{ fontFamily: "'Simpson', sans-serif" }}
                      >
                        {node.format.toUpperCase()}
                      </text>
                    </>
                  );
                })()}
                </g>
              </g>
            </g>
          );
        })}

        {/* Canvas label */}
        <text
          x={W - 16} y={H - 14}
          textAnchor="end"
          fill="#2A2A2A"
          fontSize="9"
          letterSpacing="2"
          style={{ fontFamily: "'Simpson', sans-serif" }}
        >
          {satellites.length} EXTENSIONS
        </text>
      </svg>

      {/* Legend — HTML overlay, always flush to container top-right */}
      <div style={{
        position: 'absolute', top: 16, right: 16,
        display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4,
        pointerEvents: 'none',
      }}>
        <span style={{ fontFamily: "'Simpson', sans-serif", fontSize: 7, letterSpacing: 2, color: '#2A2A2A' }}>
          ORBIT RINGS
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Simpson', sans-serif", fontSize: 7.5, letterSpacing: 1.5, color: '#2A2A2A' }}>
            RING 1 — LAUNCH
          </span>
          <svg width={14} height={14} style={{ overflow: 'visible' }}>
            <circle cx={7} cy={7} r={6} fill="#161616" stroke="#BF4723" strokeWidth="1.2" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'Simpson', sans-serif", fontSize: 7.5, letterSpacing: 1.5, color: '#2A2A2A' }}>
            RING 2 — EXTEND
          </span>
          <svg width={12} height={12} style={{ overflow: 'visible' }}>
            <circle cx={6} cy={6} r={5} fill="#161616" stroke="rgba(191,71,35,0.55)" strokeWidth="1" strokeDasharray="2 3" />
          </svg>
        </div>
      </div>
    </div>
  );
}
