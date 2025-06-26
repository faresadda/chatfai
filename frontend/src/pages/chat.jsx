import { IoSend } from "react-icons/io5";
import { useEffect, useRef, useState, useContext } from "react";
import { TbMessagePlus } from "react-icons/tb";
import { TiThMenu } from "react-icons/ti";
import { MdDarkMode, MdLightMode } from "react-icons/md";
import logo from "../../public/logo.png";
import { FaStopCircle } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github.css";
import { useNavigate } from "react-router-dom";
import { FaUserPlus, FaAngleDown } from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import Settings from "./settings";
import { UserContext } from "../context/userContext";
import Text from "../components/text";
import Confirm from "../components/confirm";
import { IoSearch } from "react-icons/io5";
import Search from "../components/search";
import { chatWithAI,addChats,getChats } from "../services/userServices";

const MarkdownRenderer = ({ text, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{text}</ReactMarkdown>
    </div>
  );
};

export default function Chat() {
  const {
    answers,
    setAnswers,
    render,
    setRender,
    confirm,
    setConfirm,
    token,
    setToken,
    id,
    setId,
    text,
    setText,
    getUser,
    fetchUser,
    response,
  } = useContext(UserContext);

  const [input, setInput] = useState("");
  const [qst, setQst] = useState(false);
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(true);
  const [i, setI] = useState(0);
  const navigate = useNavigate();

  window.onload = () => {
    setAnswers([]);
  };

  const intervalId = useRef(null);
  function write(message) {
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
  const [pic, setPic] = useState([]);

  useEffect(() => {
    if (token && id) {
      getUser();
    }
  }, [token, id, render]);
  useEffect(() => {
    if (response) {
      const arr = response.user.name.split(" ");
      setPic(arr);
    }
  }, [response]);

  const [settings, setSettings] = useState(false);
  const [searchIcon, setSearchIcon] = useState(false);


  const [chat,setChat]=useState(null)
  const handleSubmit = async () => {
    if (input !== "") {
      setInput("");
      setQst(true);
      setAnswers((up) => [...up, { id: i, user: input}])
      setI((up) => up + 1);
      setLoad(true);
      const data = await chatWithAI(input);
      setLoad(false);
      setAnswers((up) =>
        up.map((ans) => {
          return ans.id === i
            ? { ...ans, ai: data.choices[0].message.content }
            : ans;
        })
      );
      setStop(true);
      write(data.choices[0].message.content);
      setChat({ user: input, ai: data.choices[0].message.content})
      await addChats(id,{ user: input, ai: data.choices[0].message.content})
    }
    window.scrollTo({ bottom: 0, behavior: "smooth" });
  }

  const [chats , setChats] = useState(null)
  useEffect(()=>{
    const getChatsFunction = async () =>{
      try{
        const res = await getChats(id)
        console.log(res)
        if(res.status==='success'){
          setChats(res.user)
        }
      }
      catch(err){
        console.error(err)
        alert('Try again')
      }
    }
    getChatsFunction()
  },[chat])

  const [delay,setDealy] = useState(false)
  useEffect(()=>{
    const fcn = async () => {
      if(menu){
        await setTimeout(()=>{setDealy(true)},1000)
      }
      else{
        setDealy(false)
      }
    }
    fcn()
  },[menu])

  return (
    <div className="flex">
      <div
        className={`h-screen fixed flex flex-col items-center gap-5 py-5 transition-[width] duration-1000 ${
          menu
            ? "w-[250px] max-[420px]:w-[200px]"
            : "w-[70px] max-[420px]:w-[50px]"
        } 
      z-10 ${
        dark
          ? "bg-[rgb(20,20,20)] text-white"
          : "bg-[rgb(221,221,221)] text-black"
      } p-5`}
      >
        <div
          className={`flex items-center ${
            menu ? "justify-between" : "justify-center"
          } w-full`}
        >
          {menu && (
            <img src={logo} className="w-6" />
          )}
          <div className="flex items-center gap-5 cursor-pointer">
            <TiThMenu
              className="text-2xl"
              onClick={() => {
                setMenu(!menu);
              }}
            />
            {token && menu && chats?.length > 0 && (
              <IoSearch
                className="text-2xl"
                onClick={() => {
                  setSearchIcon(true);
                }}
              />
            )}
          </div>
        </div>
        <div
          onClick={() => {
            setAnswers([]);
            setQst(false);
          }}
          className={`flex ${
            menu ? "justify-start" : "justify-center"
          } items-center w-full gap-5 cursor-pointer`}
        >
          <TbMessagePlus className="text-2xl shrink-0" />
          {delay && <p className="w-20">New chat</p>}
        </div>
        {!dark && (
          <div
            className={`flex ${
              menu ? "justify-start" : "justify-center"
            } items-center w-full gap-5 cursor-pointer`}
            onClick={() => {
              setDark(true);
            }}
          >
            <MdDarkMode className="text-2xl shrink-0" />
            {delay && <p className="w-20">Dark mode</p>}
          </div>
        )}
        {dark && (
          <div
            className={`flex ${
              menu ? "justify-start" : "justify-center"
            } items-center w-full gap-5 cursor-pointer`}
            onClick={() => {
              setDark(false);
            }}
          >
            <MdLightMode className="text-2xl shrink-0" />
            {delay && <p className="w-25">Light mode</p>}
          </div>
        )}

        {menu && token && id && chats?.length > 0 && (
          <p
            
            className="flex justify-start items-center w-full gap-5 cursor-pointer underline"
          >
            history
          </p>
        )}



        {chats ?
        <div className="w-full mr-5">
          {menu && token && (
          <div className="flex flex-col justify-start items-center overflow-y-auto w-full h-80 mx-3">
            {chats.length > 0 &&
              chats.map((c, index) => (
                <p
                  key={index}
                  className={`${
                    dark
                      ? "hover:bg-[rgb(105,105,105)]"
                      : "hover:bg-[rgb(238,238,238)]"
                  } w-full hover:px-3
                   py-3 rounded-lg flex items-start gap-3`}
                  onClick={() => {
                    setAnswers([
                      ...answers,
                      { user: c?.user, ai: c?.ai },
                    ]);
                    setQst(true);
                  }}
                >
                {c?.user.length > 30 ? c?.user.slice(0, 30) + " ..." : c?.user}
                </p>
              ))}
          </div>
        )}
        </div>
        : <div className={`loader mb-5 ${!menu ? "mx-auto" : "-ml-3"}`}></div>
        }



        {!token && (
          <div
            onClick={() => {
              navigate("/login");
            }}
            className={`flex items-center ${
              menu ? "justify-start" : "justify-center"
            } gap-5 fixed bottom-0 cursor-pointer p-5
            ${
              dark
                ? "bg-[rgb(20,20,20)] text-white"
                : "bg-[rgb(221,221,2] text-black"
            } transition-[width] duration-1000 
            ${
              menu
                ? "w-[250px] max-[420px]:w-[200px]"
                : "w-[70px] max-[420px]:w-[50px]"
            }`}
          >
            <FaUserPlus className="text-2xl shrink-0" />
            {delay && <p>sign up | login</p>}
          </div>
        )}
        {token && (
          <div
            className={`fixed bottom-0 cursor-pointer p-5 ${
              dark
                ? "bg-[rgb(20,20,20)] text-white"
                : "bg-[rgb(221,221,221)] text-black"
            }
          transition-[width] duration-1000 ${
            menu
              ? "w-[250px] max-[420px]:w-[200px]"
              : "w-[70px] max-[420px]:w-[50px]"
          }`}
          >
            {fetchUser && (
              <div
                onClick={() => {
                  setSettings(true);
                }}
                className={`flex items-center ${
                  menu ? "justify-start" : "justify-center"
                } gap-3 mb-5 box-content!`}
              >
                <span className="bg-[rgb(32,177,214)] w-8 h-8 rounded-full flex justify-center items-center shrink-0">
                  {pic[0] !== undefined ? pic[0].slice(0, 1) : ""}
                  {pic[1] !== undefined ? pic[1].slice(0, 1) : ""}
                </span>
                {delay && fetchUser && <p>{response.user.name}</p>}
                {delay && <FaAngleDown className="text-xl" />}
              </div>
            )}
            {!fetchUser && (
              <div className={`loader mb-5 mx-auto`}></div>
            )}
            <div
              className={`flex items-center ${
                menu ? "justify-start" : "justify-center"
              } gap-5 text-red-500`}
              onClick={() => {
                setSettings(false);
                setConfirm("logOut");
              }}
            >
              <MdLogout className="text-2xl shrink-0" />
              {delay && <p>Log out</p>}
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
          
        </div>
        {!qst && (
          <h1 className="mt-20 text-6xl font-bold tracking-[8px] max-[800px]:text-5xl max-[500px]:text-3xl text-center">
            ASK CHATFAI
          </h1>
        )}
        {!qst && <h2>How can I help you today !</h2>}
        <div className="w-[60%] pb-50 pt-15 flex flex-col gap-10 max-[800px]:w-[80%] max-[500px]:w-[90%]">
  
          {answers?.map((ans, index) => {
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
            onSubmit={async (e) => {
              e.preventDefault();
              handleSubmit
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
                onClick={handleSubmit}
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
      {settings && token && id && (
        <Settings
          dark={dark}
          setSettings={setSettings}
          render={render}
          setRender={setRender}
          confirm={confirm}
          setConfirm={setConfirm}
          
        />
      )}
      {text && <Text />}
      {confirm && (
        <Confirm
          confirm={confirm}
          setConfirm={setConfirm}
          render={render}
          setRender={setRender}
          
        />
      )}
      {searchIcon && (
        <Search
          dark={dark}
          setSearchIcon={setSearchIcon}
          answers={answers}
          setAnswers={setAnswers}
          setQst={setQst}
          chats={chats}
        />
      )}
    </div>
  );
}
