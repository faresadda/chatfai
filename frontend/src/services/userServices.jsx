export async function loginUser({ email, password }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });
  return await res.json();
}

export async function registerUser({ name, email, password }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/registre`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ name, email, password }),
  });
  return await res.json();
}

export async function accountRecovery({ email }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/accountRecovery`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ email }),
  });
  return await res.json();
}

export async function resendCode({ id }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/resendCode/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
  });
  return await res.json();
}

export async function verifyEmail({ id, code }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/verify/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ code }),
  });
  return await res.json();
}

export async function setNewPassword(id, password) {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/passwordRecovery/${id}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": import.meta.env.VITE_MY_API_KEY,
      },
      body: JSON.stringify({
        password: password,
        code: localStorage.getItem("code"),
      }),
    }
  );
  return await res.json();
}

export async function chatWithAI(message) {
  const api_key = import.meta.env.VITE_AI_API_KEY;
  const api_url = import.meta.env.VITE_AI_API_URL;
  const res = await fetch(api_url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}`,
      "HTTP-Referer": "<YOUR_SITE_URL>",
      "X-Title": "<YOUR_SITE_NAME>",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "qwen/qwq-32b:free",
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    }),
  });
  return await res.json();
}

export async function updateProfile({ id, token, name, email }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ name, email }),
  });
  return await res.json();
}

export async function deleteUser({ id, token }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
  });
  return await res.json();
}

export async function updatePassword({ id, token, oldpassword, password }) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/security/${id}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ oldpassword, password }),
  });
  return await res.json();
}

export async function addChats(id,chat) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chats/${id}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
    body: JSON.stringify({ chats:chat }),
  });
  const data = await res.json()
  console.log(data)
  return data;
}

export async function getChats(id) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chats/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
  });
  return await res.json();
}

export async function deleteChats(id) {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/chats/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
      "Content-Type": "application/json",
      "x-api-key": import.meta.env.VITE_MY_API_KEY,
    },
  });
  return await res.json();
}
