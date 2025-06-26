import { useState, useContext } from "react";
import { FiMail, FiLock } from "react-icons/fi";
import { FaRegUser } from "react-icons/fa6";
import { UserContext } from "../../context/userContext";
import { registerUser } from "../../services/userServices";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setId, setToken, setText, setActivation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      setLoading(true);
      const data = await registerUser({ name, email, password });
      setResponse(data);
      setFetchData(true);
      setLoading(false);
      if (data.status === "success") {
        localStorage.setItem("id", data.user._id);
        setId(localStorage.getItem("id"));
        setActivation(true);
        localStorage.setItem("activation", JSON.stringify(true));
        navigate("/verification");
      }
    } catch {
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      <div className="bg-gray-100 flex flex-col items-center justify-center rounded-2xl w-100 max-[430px]:w-[90%]">
        <h1 className="text-2xl mt-10">Sign up</h1>
        <div className="p-10 w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
              setFetchData(false);
            }}
            className="space-y-5"
          >
            <div>
              <label className="block font-medium mb-1">Name</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FaRegUser className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Enter your Name"
                  className="flex-1 outline-none"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Email</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FiMail className="text-gray-500 mr-2" />
                <input
                  type="email"
                  placeholder="Enter your Email"
                  className="flex-1 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1">Password</label>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2">
                <FiLock className="text-gray-500 mr-2" />
                <input
                  type="password"
                  placeholder="Enter your Password"
                  className="flex-1 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {fetchData && response && (
              <div className="w-full flex flex-col font-medium text-xs px-4">
                {Array.isArray(response) ? (
                  response.map((res, i) => (
                    <p key={i} className="text-red-500">
                      {res.msg}
                    </p>
                  ))
                ) : (
                  <p className="text-red-500 text-center">{response.message}</p>
                )}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mt-5 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <span className="loader loader-sm mr-2 flex items-center"></span>
              )}
              <span className="align-middle">
                {loading ? "Loading..." : "Sign up"}
              </span>
            </button>
            <div className="w-full text-center mt-2">
              <Link to="/login" className="text-blue-600 hover:underline">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
