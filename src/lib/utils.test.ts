import { describe, expect, it } from "vitest";

import { getApiErrorMessage } from "./utils";

describe("getApiErrorMessage", () => {
  it("returns the fallback when the error is empty", () => {
    expect(getApiErrorMessage(null, "Error al cargar")).toBe("Error al cargar");
    expect(getApiErrorMessage(undefined)).toBe("Error desconocido");
    expect(getApiErrorMessage("")).toBe("Error desconocido");
  });

  it("returns a non-empty string error as-is", () => {
    expect(getApiErrorMessage("Proyecto no encontrado")).toBe("Proyecto no encontrado");
  });

  it("reads the message from an Error instance", () => {
    expect(getApiErrorMessage(new Error("No autorizado"))).toBe("No autorizado");
  });

  it("reads message or error from a plain API object", () => {
    expect(getApiErrorMessage({ message: "El contrato no puede estar vacío" })).toBe(
      "El contrato no puede estar vacío"
    );
    expect(getApiErrorMessage({ error: "Solo se permiten archivos .docx" })).toBe("Solo se permiten archivos .docx");
  });

  it("prefers message over error when both exist", () => {
    expect(getApiErrorMessage({ message: "Mensaje", error: "Error" })).toBe("Mensaje");
  });
});
