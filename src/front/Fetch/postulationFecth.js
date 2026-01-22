import { useGetAuthorizationHeader } from "../hooks/useGetAuthorizationHeader";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function createNewPostulation(formData, authorizationHeader) {
  const response = await fetch(`${backendUrl}/postulations`, {
    ...authorizationHeader,
    method: "POST",
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}
