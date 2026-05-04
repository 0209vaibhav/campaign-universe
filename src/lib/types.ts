export type Ring = 1 | 2;

export interface CampaignNode {
  id: string;
  type: 'hero' | 'satellite';
  title: string;
  platform: string;
  format: string;
  duration: string;
  description: string;
  ring: Ring;
}

export interface Campaign {
  id: string;
  brand: string;
  concept: string;
  nodes: CampaignNode[];
}
