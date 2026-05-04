'use client';

import { useState } from 'react';
import type { Campaign, CampaignNode } from '@/lib/types';
import { seedCampaigns } from '@/lib/data';
import InputPanel from '@/components/InputPanel';
import CampaignMap from '@/components/CampaignMap';
import NodeDetailPanel from '@/components/NodeDetailPanel';
import AddNodeModal from '@/components/AddNodeModal';

export default function Home() {
  const [campaign, setCampaign] = useState<Campaign>(seedCampaigns[0]);
  const [selectedNode, setSelectedNode] = useState<CampaignNode | null>(null);
  const [addNodeOpen, setAddNodeOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<CampaignNode | null>(null);

  function handleCampaignChange(c: Campaign) {
    setSelectedNode(null);
    setCampaign(c);
  }

  function handleNodeClick(node: CampaignNode) {
    setSelectedNode(prev => (prev?.id === node.id ? null : node));
  }

  function handleAddNode(node: CampaignNode) {
    setCampaign(prev => ({ ...prev, nodes: [...prev.nodes, node] }));
    setAddNodeOpen(false);
  }

  function handleDeleteNode(id: string) {
    setCampaign(prev => ({ ...prev, nodes: prev.nodes.filter(n => n.id !== id) }));
  }

  function handleSaveEdit(updated: CampaignNode) {
    setCampaign(prev => ({ ...prev, nodes: prev.nodes.map(n => n.id === updated.id ? updated : n) }));
    setSelectedNode(updated);
    setEditingNode(null);
  }

  return (
    <main
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0E0E0E',
        overflow: 'hidden',
      }}
    >
      {/* ── Left panel ──────────────────────────────────────── */}
      <InputPanel
        campaign={campaign}
        onCampaignChange={handleCampaignChange}
        onAddNode={() => setAddNodeOpen(true)}
      />

      {/* ── Canvas ──────────────────────────────────────────── */}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {/* Campaign title bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '22px 28px',
            display: 'flex',
            alignItems: 'baseline',
            gap: '14px',
            zIndex: 10,
            pointerEvents: 'none',
          }}
        >
          <h1
            className="font-display"
            style={{ margin: 0, fontSize: '15px', color: '#F2EFE8', letterSpacing: '0.01em' }}
          >
            {campaign.brand}
          </h1>
          <span
            style={{
              fontFamily: "'ABC Camera', sans-serif",
              fontSize: '12px',
              color: '#6B6B6B',
              maxWidth: '420px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {campaign.concept.match(/"([^"]+)"/)?.[1] ?? campaign.concept.slice(0, 60)}
          </span>
        </div>

        {/* Map — key forces remount + animation replay on campaign switch */}
        <CampaignMap
          key={campaign.id}
          campaign={campaign}
          selectedNodeId={selectedNode?.id ?? null}
          onNodeClick={handleNodeClick}
        />

        {/* Node detail panel */}
        {selectedNode && (
          <NodeDetailPanel
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onDelete={handleDeleteNode}
            onEditClick={() => setEditingNode(selectedNode)}
          />
        )}
      </div>

      {/* ── Add / Edit node modal ───────────────────────────── */}
      {(addNodeOpen || editingNode) && (
        <AddNodeModal
          initialNode={editingNode ?? undefined}
          onAdd={editingNode ? handleSaveEdit : handleAddNode}
          onClose={() => { setAddNodeOpen(false); setEditingNode(null); }}
        />
      )}
    </main>
  );
}
