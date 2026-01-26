export const generateId = () => {
  return crypto.randomUUID();
};

export const createEmptyCV = () => {
  return {
    id: generateId(),
    nombre: "",
    email: "",
    telefono: "",
    ubicacion: "",
    linkedin: "",
    github: "",
    resumen: "",
    foto: "",
    experiencia: [],
    educacion: [],
    habilidades: [],
    idiomas: [],
  };
};

export const updateCVInList = (list, id, updatedCV) => {
  return list.map((cv) => (cv.id === id ? updatedCV : cv));
};

export const cloneCV = (cv) => {
  return {
    ...cv,
    id: generateId(),
    nombre: cv.nombre + " (Copia)",
  };
};
