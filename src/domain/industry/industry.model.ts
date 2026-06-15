export interface Industry {
  slug: string;
  name: string;
  tier: string;
  summary: string;
  description: string;
  imageUrl: string;
  problems: string[];
  products: string[];
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
