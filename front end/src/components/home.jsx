import logo from "../../public/logo.png";
import { Link } from "react-router-dom";
import { useState,useEffect,useContext } from "react";
import {Context} from '../main'
export default function Home({ setAnswers }) {
  const {token,setToken,id,setId,text,setText,getUser,fetchUser,response}=useContext(Context)
  const [pic, setPic] = useState([]);
    useEffect(() => {
     if(response){
      const arr = response.user.name.split(" ");
      setPic(arr);
     }
  }, [response]);
  useEffect(() => {
        if (token && id) {
          getUser();
        }
      }, [token,id]);
  return (
    <div className="bg-[rgb(30,30,30)] h-screen flex flex-col justify-start items-center gap-20 text-white max-[387px]:gap-15">
      <div className="flex items-center justify-between w-full px-10 pt-10 max-[400px]:px-5">
        <div className="flex items-center gap-2">
          <p className="text-2xl font-semibold tracking-[2px] max-[580px]:text-xl">
            CHATFAI
          </p>
          <img src={logo} className="w-6 rounded-[50%]" />
        </div>
        {!token && <Link className="bg-white p-3 rounded-2xl text-black" to="/login">login | registre</Link>}
        {token && fetchUser && <div className="flex items-center gap-3">
          <span className="bg-[rgb(32,177,214)] w-8 h-8 rounded-full flex justify-center items-center">
              {pic[0]!==undefined ? pic[0].slice(0,1) : ''}{pic[1]!==undefined ? pic[1].slice(0,1) : ''}
          </span>
          <p>{response.user.name}</p>
          </div>} 
        {token && !fetchUser && <div className="loader"></div>}
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl font-bold tracking-[10px] max-[580px]:text-5xl">
          CHATFAI
        </h1>
        <p className="text-center w-[60%] max-[600px]:w-[80%]">
          Chatfai is an artificial intelligence model designed for natural
          language understanding and generation, enabling interactive,
          human-like conversations and assisting with various tasks.
        </p>
      </div>
      <div className="flex flex-col gap-5 items-center justify-center">
      <Link
        className="bg-[rgb(240,240,240)] p-10 rounded-2xl text-black max-[700px]:w-[90%]"
        to="/ai"
        onClick={() => {
          setAnswers([]);
        }}
      >
        <h2 className="text-2xl mb-4 text-center">Get Started</h2>
        <p className="text-center">
          try chatfai for free, best experience with the artificial intelligence
          model
        </p>
      </Link>
      <p>&copy;2025 All rights reserved to chatfai</p>
      </div>
    </div>
  );
}
