// Context folder for React context providers

import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {

  {/* const [answers, setAnswers] = useState(() => {
    const save = localStorage.getItem("answers");
    return save ? JSON.parse(save) : [];
  });
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);
  */}

  const [answers, setAnswers] = useState([]);

  const [response, setResponse] = useState(null);
  const [fetchUser, setFetchUser] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [id, setId] = useState(localStorage.getItem("id"));
  const [render, setRender] = useState(false);
  const [text, setText] = useState("");
  const [confirm, setConfirm] = useState("");

  const getUser = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/profile/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "x-api-key": import.meta.env.VITE_MY_API_KEY,
          },
        }
      );
      const user = await res.json();
      setResponse(user);
      setFetchUser(true);
      console.log(user)
    } catch (err) {
      console.error("fetch data error:", err);
    }
  };

  const [activation,setActivation] = useState(()=>{
    const save = localStorage.getItem('activation')
    return JSON.parse(save) || null
  })

  return (
    <UserContext.Provider
      value={{
        token,
        setToken,

        id,
        setId,

        text,
        setText,

        getUser,
        fetchUser,
        response,

        answers,
        setAnswers,

        render,
        setRender,

        confirm,
        setConfirm,

        activation,
        setActivation,
        
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
