export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateCV = (cv) => {
  if (!cv.nombre) return false;
  if (!validateEmail(cv.email)) return false;
  return true;
};
