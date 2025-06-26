import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { setNewPassword } from "../../services/userServices";
import { useNavigate } from "react-router-dom";
import { MdLocalPizza } from "react-icons/md";

export default function NewPassword() {
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [response, setResponse] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id, setToken } = useContext(UserContext);
  const navigate=useNavigate()

  const handleNewPassword = async () => {
    if (password1 === password2) {
      try {
        setLoading(true);
        const data = await setNewPassword( id, password1 );
        setLoading(false);
        setResponse(data.message);
        setFetchData(true);
        console.log(data)
        if (data.status === "success") {
          localStorage.setItem('token',data.user.token)
          setToken(data.user.token)
          navigate('/chat')

        }
      } catch(err) {
        console.log(err)
        alert("Something went wrong!");
      }
    } else {
      setResponse([{ msg: "password does not match" }]);
      setFetchData(true);
    }
  };

  return (
    <section className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      <form
        className="bg-gray-100 flex flex-col items-center justify-center gap-5 rounded-2xl w-150 p-10 max-[650px]:w-[90%]"
        onSubmit={(e) => {
          e.preventDefault();
          handleNewPassword();
        }}
      >
        <p>Account recovery</p>
        <input
          type="password"
          required
          placeholder="New password"
          className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="New password"
          className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        
        {fetchData && response && Array.isArray(response) && (
          <div className="w-full flex flex-col justify-center font-medium text-xs">
            {response.map((res, i) => (
              <p key={i} className="text-red-500 text-center">
                {res.msg}
              </p>
            ))}
          </div>
        )}
        <button
          type="submit"
          className="w-[80%] bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mt-5 flex items-center justify-center"
          disabled={loading}
        >
          {loading && (
            <span className="loader loader-sm mr-2 flex items-center"></span>
          )}
          <span className="align-middle">
            {loading ? "Loading..." : "Enter"}
          </span>
        </button>
      </form>
    </section>
  );
}
