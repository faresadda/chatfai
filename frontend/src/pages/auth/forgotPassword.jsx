import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { accountRecovery } from "../../services/userServices";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [response, setResponse] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setId, setActivation } = useContext(UserContext);
  const navigate = useNavigate();

  const handleAccountRecovery = async () => {
    try {
      setLoading(true);
      const data = await accountRecovery({ email });
      setResponse(data);
      setFetchData(true);
      setLoading(false);
      if (data.status === "success") {
        localStorage.setItem("id", data.user._id);
        setId(localStorage.getItem("id"));
        navigate("/verification");
        setActivation(false);
        localStorage.setItem("activation", JSON.stringify(false));
      }
    } catch {
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      <form
        className="bg-gray-100 flex flex-col items-center justify-center gap-5 rounded-2xl w-150 p-10 max-[700px]:w-[90%] max-[500px]:px-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAccountRecovery();
          setFetchData(false);
        }}
      >
        <p>Account recovery</p>
        <input
          type="email"
          required
          placeholder="Enter your email"
          className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {fetchData && response && (
          <p className="w-full font-medium text-center text-xs text-red-500">
            {response.message}
          </p>
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
