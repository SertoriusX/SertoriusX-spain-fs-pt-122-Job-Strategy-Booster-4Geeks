import axios from "axios";
 const backendUrl = import.meta.env.VITE_BACKEND_URL

export async function translateBatch(texts, target) {
  try {
    const response = await axios.post(`${backendUrl}/translate`, {
      texts,
      target,
    });
    return response.data; // array of translated strings from your Flask backend
  } catch (error) {
    console.error("Translation error:", error.response?.data || error.message);
    throw error;
  }
}
