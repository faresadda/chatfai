import { StrictMode, useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Ai from "./components/ai";
import Home from "./components/home";
import Login from "./components/login";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { createContext } from "react";
export const Context = createContext();

export default function App() {
  const [answers, setAnswers] = useState(() => {
    const save = localStorage.getItem("answers");
    return save ? JSON.parse(save) : [];
  });
  useEffect(() => {
    localStorage.setItem("answers", JSON.stringify(answers));
  }, [answers]);

  const [response, setResponse] = useState(null);
  const [fetchUser, setFetchUser] = useState(false);
  const getUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
      });

      const user = await res.json();
      setResponse(user);
      console.log("response", response);
      setFetchUser(true);
    } catch (err) {
      console.error("fetch data error:", err);
    }
  };
  const [token,setToken] = useState(localStorage.getItem("token"));
  const [id,setId] = useState(localStorage.getItem("id"));
  const [render,setRender]=useState(false)
  const [text,setText]=useState('')
  const [confirm,setConfirm]=useState('')
  return (
    <Context.Provider value={{ token, setToken, id, setId,text,setText,getUser,fetchUser,response }}>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Home setAnswers={setAnswers} />} />
          <Route
            path="/ai"
            element={<Ai answers={answers} setAnswers={setAnswers} render={render} setRender={setRender} confirm={confirm} setConfirm={setConfirm}/>}/>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </Context.Provider>
  );
}
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
