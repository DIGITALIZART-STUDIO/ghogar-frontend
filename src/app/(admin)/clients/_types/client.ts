import { components } from "@/types/api";

// Define el tipo Client basado en el esquema de tu API
export type Client = components["schemas"]["Client"];

export enum ClientTypes {
  Natural = "Natural",
  Juridico = "Juridico",
}
