import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiMail, FiLock, FiUnlock } from "react-icons/fi";
import { UserContext } from "../../context/userContext";
import { loginUser } from "../../services/userServices";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [response, setResponse] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setToken, setId, setText, setActivation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      setLoading(true);
      const data = await loginUser({ email, password });
      setResponse(data);
      setFetchData(true);
      setLoading(false);
      if (data.user) {
        if (data.user.isVerified === true) {
          localStorage.setItem("token", data.user.token);
          localStorage.setItem("id", data.user._id);
          setToken(localStorage.getItem("token"));
          setId(localStorage.getItem("id"));
          navigate("/chat");
          setText("accountLogin");
          setTimeout(() => setText(""), 3000);
        } else {
          navigate("/verification");
          setActivation(true);
          localStorage.setItem("activation", JSON.stringify(true));
        }
      }
    } catch {
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      <div className="bg-gray-100 flex flex-col items-center justify-center rounded-2xl w-100 max-[430px]:w-[90%]">
        <h1 className="text-2xl mt-10">Login</h1>
        <div className="p-10 w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
              setFetchData(false);
            }}
            className="space-y-5"
          >
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
              <p className="w-full font-medium text-xs px-4 text-red-500">
                {response.message}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mb-2 flex items-center justify-center"
              disabled={loading}
            >
              {loading && (
                <span className="loader mr-2 flex items-center"></span>
              )}
              <span>{loading ? "Loading..." : "Login"}</span>
            </button>
            <div className="w-full text-center mt-2">
              <Link to="/register" className="text-blue-600 hover:underline">
                Don&apos;t have an account? Register
              </Link>
            </div>
            <div className="w-full text-center mt-2">
              <Link
                to="/forgot-password"
                className="inline-flex items-center gap-1 text-blue-600 hover:underline"
              >
                <FiUnlock className="inline-block text-base" />
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
