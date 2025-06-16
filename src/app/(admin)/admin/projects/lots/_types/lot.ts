export interface LotData {
  id: string;
  lotNumber: string;
  area: number;
  price: number;
  status: LotStatus;
  statusText: string;
  blockId: string;
  blockName: string;
  projectId: string;
  projectName: string;
  isActive: boolean;
  createdAt: string; // ISO date string
  modifiedAt: string; // ISO date string

  // Calculados
  pricePerSquareMeter: number;
}

export enum LotStatus {
  Available = "Available",
  Quoted = "Quoted",
  Reserved = "Reserved",
  Sold = "Sold",
}
