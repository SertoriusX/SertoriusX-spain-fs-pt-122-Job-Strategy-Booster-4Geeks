export const backendUrl = import.meta.env.VITE_BACKEND_URL;

export async function createNewTodo(todo, authorizationHeader) {
  const response = await fetch(backendUrl, {
    ...authorizationHeader,
    method: "POST",
    body: JSON.stringify(todo),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}

export async function getTodos(authorizationHeader) {
  const response = await fetch(backendUrl, {
    ...authorizationHeader,
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error);
  }

  return await response.json();
}
