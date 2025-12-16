import { components } from "@/types/api";

export type LotData = components["schemas"]["LotDTO"];
export enum LotStatus {
  Available = "Available",
  Quoted = "Quoted",
  Reserved = "Reserved",
  Sold = "Sold",
}
