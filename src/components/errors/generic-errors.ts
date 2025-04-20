export type ErrorMessages = {
  loading: string;
  notFound: string;
  generic: "Ha ocurrido un error inesperado.";
  create: string;
  update: string;
  delete: string;
  restore: string;
};

export const errorMessages: ErrorMessages = {
    loading: "Cargando...",
    notFound: "No encontrado",
    generic: "Ha ocurrido un error inesperado.",
    create: "Error al crear",
    update: "Error al actualizar",
    delete: "Error al eliminar",
    restore: "Error al restaurar",
};
