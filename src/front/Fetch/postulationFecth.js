
export  const backendUrl = import.meta.env.VITE_BACKEND_URL;

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

export async function getPostulations(authorizationHeader) {
  const response = await fetch(`${backendUrl}/postulations`, {
    ...authorizationHeader,
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}

export async function getPostulationById(id, authorizationHeader) {
  const response = await fetch(`${backendUrl}/postulations/${id}`, {
    ...authorizationHeader,
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error fetching postulation");
  }

  return await response.json();
}

export async function removePostulation(id, authorizationHeader) {
  const response = await fetch(`${backendUrl}/postulations/${id}`, {
    ...authorizationHeader,
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Error fetching postulation");
  }

  return await response.json();
}
