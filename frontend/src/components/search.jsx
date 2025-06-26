import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { BiMessageDetail } from "react-icons/bi";
export default function Search({
  dark,
  setSearchIcon,
  answers,
  setAnswers,
  setQst,
  chats,
}) {
  const [search, setSearch] = useState("");
  const chatsFilter = chats?.filter((chat) => chat.user.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
  return (
    <section
      className={`${
        dark ? "bg-[rgb(60,60,60)]" : "bg-[rgb(200,200,200)]"
      } w-[80%] p-10 absolute h-[80%] transform top-[50%] left-[50%] z-30 shadow-gray-500
        -translate-x-[50%] -translate-y-[50%] rounded-2xl flex flex-col gap-10 max-[470px]:w-[90%] max-[470px]:px-5`}
    >
      <div
        className={`flex justify-between items-center ${
          dark
            ? "bg-[rgb(105,105,105)] text-white"
            : "bg-[rgb(238,238,238)] text-black"
        } p-5 rounded-lg w-full`}
      >
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className="outline-none w-[80%]"
        />
        <IoClose
          className={`${dark ? "text-white" : "text-black"} text-2xl`}
          onClick={() => {
            setSearchIcon(false);
          }}
        />
      </div>
      <div
        className={`flex flex-col items-start ${
          dark ? "text-white" : "text-black"
        } overflow-y-auto`}
      >
        {chatsFilter.map((c, index) => {
          return (
            <p
              key={index}
              onClick={() => {
                setAnswers([...answers, { id: c.id, user: c.user, ai: c.ai }]);
                setQst(true);
                setSearchIcon(false);
              }}
              className={`${
                dark
                  ? "hover:bg-[rgb(105,105,105)]"
                  : "hover:bg-[rgb(238,238,238)]"
              } w-full p-3 rounded-lg
                  flex items-start gap-3`}
            >
              <BiMessageDetail className="text-2xl" /> {c.user}
            </p>
          );
        })}
      </div>
    </section>
  );
}
