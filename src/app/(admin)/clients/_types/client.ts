import { components } from "@/types/api";

// Define el tipo Client basado en el esquema de tu API
export type Client = components["schemas"]["Client"];

export type ClientSummaryDto = components["schemas"]["ClientSummaryDto"];

export enum ClientTypes {
  Natural = "Natural",
  Juridico = "Juridico",
}

export type responseRUC = components["schemas"]["ResponseApiRucFull"];

export type responseDNI = components["schemas"]["ResponseApiDni"];

export interface CoOwner {
  dni: string
  name: string
  email: string
  phone: string
  address: string
}

export interface SeparatePropertyData {
  email: string
  phone: string
  address: string
  spouseDni: string
  spouseName: string
  maritalStatus: string
}
