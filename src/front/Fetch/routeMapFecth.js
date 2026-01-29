const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const createNewRoute = async (routeList, id, authorizationHeader) => {
  const response = await fetch(`${backendUrl}/postulations/${id}/route-map`, {
    ...authorizationHeader,
    method: "POST",
    body: JSON.stringify(routeList),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return await response.json();
};

export const getRoutes = async (id, authorizationHeader) => {
  const response = await fetch(`${backendUrl}/postulations/${id}/route-map`, {
    ...authorizationHeader,
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return await response.json();
};

export const removeStep = async (id, stageId, authorizationHeader) => {
  const response = await fetch(
    `${backendUrl}/postulations/${id}/route-map?stage_id=${stageId}`,
    {
      ...authorizationHeader,
      method: "DELETE",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }
  return await response.json();
};

export const updateStage = async (id, action, authorizationHeader) => {
  const response = await fetch(
    `${backendUrl}/postulations/${id}/route-map?action=${action}`,
    {
      ...authorizationHeader,
      method: "PUT",
    },
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
};
