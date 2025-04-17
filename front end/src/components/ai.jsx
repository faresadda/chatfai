import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState,useContext } from "react";
import { TbMessagePlus } from "react-icons/tb";
import { TiSpanner, TiThMenu } from "react-icons/ti";
import { MdDarkMode } from "react-icons/md";
import { MdLightMode } from "react-icons/md";
import { IoSearch } from "react-icons/io5";
import logo from "../../public/logo.png";
import { FaStopCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useNavigate } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import { FaChevronDown } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { MdLogout } from "react-icons/md";
import Settings from './settings';
import {Context} from '../main'
import Text from './text'

const MarkdownRenderer = ({ text, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>
    </div>
  );
};

var data;
async function api(message) {
  const api_key = import.meta.env.VITE_AI_API_KEY;
  const api_url = import.meta.env.VITE_AI_API_URL;
  const res = await fetch(api_url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${api_key}`,
      "HTTP-Referer": "<YOUR_SITE_URL>", // Optional. Site URL for rankings on openrouter.ai.
      "X-Title": "<YOUR_SITE_NAME>", // Optional. Site title for rankings on openrouter.ai.
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
  data = await res.json();
  console.log(data);
}


export default function Ai({ answers, setAnswers,render,setRender }) {
  const [input, setInput] = useState("");
  const [qst, setQst] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(true);
  const [i, setI] = useState(0);
  const [searchinput, setSearchinput] = useState("");
  const navigate = useNavigate();

  const [copy, setCopy] = useState(() => {
    const savecopy = localStorage.getItem("copy");
    return savecopy ? JSON.parse(savecopy) : [];
  });
  useEffect(() => {
    localStorage.setItem("copy", JSON.stringify(copy));
  }, [copy]);

  window.onload = () => {
    setAnswers([]);
  };

  const intervalId = useRef(null);
  function write() {
    const message = data.choices[0].message.content;
    let currentIndex = 0;
    intervalId.current = setInterval(() => {
      setAnswers((up) =>
        up.map((ans) =>
          ans === up[up.length - 1]
            ? { ...ans, ai: message.slice(0, currentIndex) }
            : ans
        )
      );
      currentIndex++;
      if (currentIndex > message.length) {
        clearInterval(intervalId.current);
        setStop(false);
      }
    }, 50);
  }
  const ref = useRef(null);
  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [answers]);
  const [stop, setStop] = useState(false);
  const [load, setLoad] = useState(false);
  
  const {token,setToken,id,setId,text,setText,getUser,fetchUser,response}=useContext(Context)
  const [pic, setPic] = useState([]);
  useEffect(() => {
    if (token && id) {
      getUser();
    }
  }, [token, id,render]);
  useEffect(() => {
   if(response){
    const arr = response.user.name.split(" ");
    setPic(arr);
   }
}, [response]);
  const logout = ()=>{
    localStorage.removeItem('id')
    localStorage.removeItem('token')
    setToken(null)
    setId(null)
  }
  const [settings,setSettings]=useState(false)
  return (
    <div className="flex">
      <div
        className={`h-screen fixed flex flex-col items-center gap-5 py-5 transition-[width] duration-1000 ${menu ? "w-[250px] max-[420px]:w-[200px]": "w-[70px] max-[420px]:w-[50px]"} 
      z-10 ${dark ? "bg-[rgb(20,20,20)] text-white":"bg-[rgb(210,210,210)] text-black"} max-[420px]:${menu ? "w-[200px]" : "w-[50px]"}`}>
        <div className="flex items-center gap-5 cursor-pointer" onClick={() => {setMenu(!menu);}}>
          <TiThMenu className="text-2xl"/>
          {menu && <p>Menu</p>}
        </div>
        <div
          onClick={() => {
            setAnswers([]);
            setQst(false);
          }}
          className="flex items-center gap-5 cursor-pointer"
        >
          <TbMessagePlus className="text-2xl" />
          {menu && <p className="w-20">New chat</p>}
        </div>
        {!dark && (
          <div
            className="flex justify-center items-center gap-5 cursor-pointer"
            onClick={() => {
              setDark(true);
            }}
          >
            <MdDarkMode className="text-2xl" />
            {menu && <p className="w-20">Dark mode</p>}
          </div>
        )}
        {dark && (
          <div className="flex justify-center! items-center gap-5 cursor-pointer"
            onClick={() => {setDark(false);}}>
            <MdLightMode className="text-2xl" />
            {menu && <p className="w-25">Light mode</p>}
          </div>
        )}
        {token && menu && (
          <input type="search" placeholder="search" value={searchinput}
            onChange={(e) => {
              setSearchinput(() => {
                const si = e.target.value;
                setCopy(answers.filter((ans) => ans.user.includes(si)));
                return si;
              });
            }}
            className={`outline-none rounded-[10px] py-2 px-5 w-[90%] 
              ${dark ? "bg-white placeholder:text-black text-black" : "bg-black placeholder:text-white text-white"}`}/>)}

        {menu && token && id && copy.length > 0 && (
          <p onClick={() => {setCopy([]);}}
            className="w-50 flex justify-center underline cursor-pointer">
            Delete history
          </p>
        )}
        {menu && token && (
          <div className="flex flex-col justify-start items-center overflow-y-auto w-full h-80 gap-5 py-5">
            {copy.length > 0 &&
              copy.map((co, index) => (
                <p
                  key={index}
                  className="px-2 text-center cursor-pointer w-50"
                  onClick={() => {
                    setAnswers([...answers,{ id: co.id, user: co.user, ai: co.ai },]);
                    setQst(true);}}>
                  {co.user.length > 30? co.user.slice(0, 30) + " ...": co.user}
                </p>
              ))}
          </div>
        )}
        {!token && (
          <div
            onClick={() => {
              navigate("/login");
            }}
            className={`flex items-center justify-center gap-5 absolute bottom-0 cursor-pointer py-5 w-full
            ${dark ? "bg-[rgb(20,20,20)] text-white" : "bg-[rgb(210,210,210)] text-black"}`}>
            <FaUserPlus className="text-2xl" />
            {menu && <p>sign up | login</p>}
          </div>
        )}
        {token && (
          <div className={`absolute bottom-0 cursor-pointer py-5 w-full ${dark? "bg-[rgb(20,20,20)] text-white": "bg-[rgb(210,210,210)] text-black"}`}>
            <div onClick={()=>{setSettings(true)}}
              className="flex items-center justify-center gap-3 mb-5">
              <span className="bg-[rgb(32,177,214)] w-8 h-8 rounded-full flex justify-center items-center">
              {pic[0]!==undefined ? pic[0].slice(0,1) : ''}{pic[1]!==undefined ? pic[1].slice(0,1) : ''}</span>
              {menu && fetchUser && <p className="w-20">{response.user.name}</p>}
              {menu &&<FaChevronDown className="text-xl"/>}
            </div>
            <div className="flex items-center justify-center gap-5 text-red-500" onClick={()=>{logout();setSettings(false);setText('accountLogout')}}>
              <MdLogout className="text-2xl"/>
              {menu && <p>Log out</p>}
            </div>
          </div>
        )}
      </div>

      <div
        className={`flex flex-col gap-10 justify-center items-center min-h-screen absolute right-0 py-10 ${
          menu ? "w-[calc(100%-250px)]" : "w-[calc(100%-70px)]"
        } 
          ${
            dark
              ? "bg-[rgb(30,30,30)] text-white"
              : "bg-[rgb(240,240,240)] text-black"
          } transition-[width] duration-1000 max-[650px]:w-[calc(100%-70px)] max-[420px]:w-[calc(100%-50px)]`}
      >
        <div
          className={`flex items-center gap-2 fixed top-0 right-0 pl-5 py-5 ${
            dark
              ? "bg-[rgb(30,30,30)] text-white"
              : "bg-[rgb(240,240,240)] text-black"
          } max-[350px]:pl-2
            ${
              menu
                ? "w-[calc(100%-250px)] duration-1000 transition-[width] max-[420px]:w-[calc(100%-200px)]"
                : "w-[calc(100%-70px)] duration-1000 transition-[width] max-[420px]:w-[calc(100%-50px)]"
            }`}
        >
          <h1 className="font-bold text-2xl tracking-[4px] max-[800px]:text-xl max-[500px]:text-xs">
            CHATFAI
          </h1>
          <img src={logo} className="w-6 max-[500px]:w-4" />
        </div>
        {!qst && (
          <h1 className="text-6xl font-bold tracking-[8px] max-[800px]:text-5xl max-[500px]:text-3xl text-center">
            ASK CHATFAI
          </h1>
        )}
        {!qst && <h2>How can I help you today !</h2>}
        <div className="w-[60%] pb-50 pt-15 flex flex-col gap-10 max-[800px]:w-[80%] max-[500px]:w-[90%]">
          {answers.map((ans, index) => {
            return (
              <div key={index} className="flex flex-col gap-10">
                <p
                  className={`w-fit max-w-[50%] text-start p-2 rounded-2xl ${
                    !dark ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {ans.user}
                </p>
                <MarkdownRenderer className="w-[100%] text-end" text={ans.ai} />
              </div>
            );
          })}
          {load && <div className="load" ref={ref}></div>}
        </div>
        <div
          className={`fixed bottom-0 right-0 ${
            dark ? "bg-[rgb(30,30,30)]" : "bg-[rgb(240,240,240)]"
          } max-[650px]:w-[calc(100%-70px)]!  max-[420px]:w-[calc(100%-50px)]!
                        ${
                          qst
                            ? "h-[200px] transition-[height] duration-1000"
                            : "h-[350px] transition-[height] duration-1000"
                        }
                        ${
                          menu
                            ? "w-[calc(100%-250px)] duration-1000 transition-[width]"
                            : "w-[calc(100%-70px)] duration-1000 transition-[width]"
                        }
                        max-[420px]:${
                          menu ? "w-[calc(100%-200px)]" : "w-[calc(100%-50px)]"
                        }`}
        >
          <form
            onSubmit={(e) => {
              e.preventDefault();
            }}
            className={`p-5! rounded-2xl w-[60%] absolute top-10 left-[50%] translate-x-[-50%] max-[800px]:w-[80%] max-[500px]:w-[90%]
            ${
              dark
                ? "bg-[rgb(45,45,45)] text-white"
                : "bg-[rgb(220,220,220)] text-black"
            }`}
          >
            <input
              type="text"
              placeholder="ASK CHATFAI"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`outline-none mb-10 w-full ${
                dark ? "placeholder:text-white" : "placeholder:text-black"
              }`}
            />
            <div className="flex items-center justify-end gap-5 text-2xl">
              {stop && (
                <FaStopCircle
                  onClick={() => {
                    clearInterval(intervalId.current);
                    setStop(false);
                  }}
                />
              )}
              <button
                type="submit"
                onClick={async () => {
                  if (input !== "") {
                    setInput("");
                    setQst(true);
                    setAnswers((up) => [...up, { id: i, user: input }]);
                    setI((up) => up + 1);
                    setLoad(true);
                    await api(input);
                    setLoad(false);
                    setAnswers((up) =>
                      up.map((ans) => {
                        return ans.id === i
                          ? { ...ans, ai: data.choices[0].message.content }
                          : ans;
                      })
                    );
                    setCopy([
                      ...copy,
                      {
                        id: i,
                        user: input,
                        ai: data.choices[0].message.content,
                      },
                    ]);
                    setStop(true);
                    write();
                  }
                  window.scrollTo({ bottom: 0, behavior: "smooth" });
                }}
              >
                <IoSend />
              </button>
            </div>
          </form>
          <p className="absolute bottom-1 text-center w-full">
            &copy;2025 All rights reserved to chatfai
          </p>
        </div>
      </div>
      {settings && token && id && <Settings dark={dark} setSettings={setSettings} render={render} setRender={setRender}/>}
      {text && <Text />}
    </div>
  );
}
