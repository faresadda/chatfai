import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { UserContext } from "../context/userContext";
import {
  updateProfile,
  deleteUser,
  updatePassword,
  deleteChats,
} from "../services/userServices";
import {
  FiTrash2,
  FiEdit2,
  FiLock,
  FiAlertCircle,
  FiLogOut,
} from "react-icons/fi";

export default function Confirm({
  confirm,
  setConfirm,
  render,
  setRender,
  setCopy,
}) {
  const { token, setToken, id, setId, setText, getUser, response } =
    useContext(UserContext);
  useEffect(() => {
    if (token && id) {
      getUser();
    }
  }, [token, id]);
  const [name, setName] = useState(response.user.name);
  const [email, setEmail] = useState(response.user.email);
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [err, setErr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetchData, setFetchData] = useState(false);

  const logout = () => {
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    setToken(null);
    setId(null);
  };

  // Spinner JSX
  const Spinner = (
    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2 align-middle"></span>
  );

  // --- Handlers ---
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const user = await updateProfile({ id, token, name, email });
      setRender && setRender((prev) => !prev);
      if (user.status === "success") {
        setConfirm("");
        setText("profileUpdated");
        setTimeout(() => setText(""), 3000);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteUser = async () => {
    setLoading(true);
    try {
      const user = await deleteUser({ id, token });
      if (user.status === "success") {
        setConfirm("");
        setText("accountDeleted");
        setTimeout(() => setText(""), 3000);
      }
      logout();
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUpdatePassword = async () => {
    setLoading(true);
    try {
      const user = await updatePassword({
        id,
        token,
        oldpassword: password1,
        password: password2,
      });
      setErr(user);
      if (user.status === "success") {
        setConfirm("");
        setText("passwordUpdated");
        setTimeout(() => setText(""), 3000);
        setFetchData(false);
      } else {
        setFetchData(true);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleDeleteChats = async () => {
    try {
      await deleteChats(id);
    } catch (err) {
      console.error(err);
      alert("Try again");
    }
  };

  // Helper to get icon and color
  const getConfirmIcon = () => {
    switch (confirm) {
      case "deleteAccount":
      case "deleteChats":
        return <FiTrash2 className="text-red-500 text-4xl mb-2" />;
      case "editProfile":
        return <FiEdit2 className="text-blue-500 text-4xl mb-2" />;
      case "editPassword":
        return <FiLock className="text-yellow-500 text-4xl mb-2" />;
      case "logOut":
        return <FiLogOut className="text-gray-500 text-4xl mb-2" />;
      default:
        return <FiAlertCircle className="text-purple-500 text-4xl mb-2" />;
    }
  };

  // Helper to get title
  const getConfirmTitle = () => {
    switch (confirm) {
      case "deleteAccount":
        return "Delete Account";
      case "deleteChats":
        return "Delete All Chats";
      case "editProfile":
        return "Edit Profile";
      case "editPassword":
        return "Edit Password";
      case "logOut":
        return "Log Out";
      default:
        return "Confirm Action";
    }
  };

  // Helper to get message
  const getConfirmMessage = () => {
    switch (confirm) {
      case "deleteChats":
        return "Do you want to delete all chats?";
      case "deleteAccount":
        return "Do you want to delete your account?";
      case "editProfile":
        return "Edit your account information below.";
      case "editPassword":
        return "Change your password below.";
      case "logOut":
        return "Do you want to log out?";
      default:
        return "Are you sure you want to proceed?";
    }
  };

  return (
    <section
      className="bg-white rounded-2xl px-8 py-10 shadow-2xl absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md text-center z-50 animate-fadeIn"
      style={{ fontFamily: "Montserrat, Inter, sans-serif" }}
    >
      <div className="flex flex-col items-center gap-2 mb-4">
        {getConfirmIcon()}
        <h2 className="text-xl font-bold mb-2">{getConfirmTitle()}</h2>
        <p className="text-gray-700 mb-4">{getConfirmMessage()}</p>
      </div>
      {confirm === "deleteChats" && (
        <form
          className="flex flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            setLoading(true);
            await handleDeleteChats();
            setText("chatsDeleted");
            setTimeout(() => setText(""), 3000);
            setLoading(false);
            setConfirm("");
          }}
        >
          <div className="flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <>{Spinner}Confirm</> : "Confirm"}
            </button>
            <button
              type="button"
              className="flex-1 bg-white py-2 rounded-lg font-semibold text-black border-2 border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {confirm === "deleteAccount" && (
        <form
          className="flex flex-col gap-6"
          onSubmit={async (e) => {
            e.preventDefault();
            await handleDeleteUser();
          }}
        >
          <div className="flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="flex-1 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <>{Spinner}Confirm</> : "Confirm"}
            </button>
            <button
              type="button"
              className="flex-1 bg-white py-2 rounded-lg font-semibold text-black border-2 border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {confirm === "editProfile" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (name !== response.user.name || email !== response.user.email) {
              await handleUpdateProfile();
            }
          }}
        >
          <input
            type="text"
            className="w-full bg-gray-100 py-2 rounded-lg font-medium text-black border-2 border-gray-200 px-4 focus:outline-none focus:border-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            className="w-full bg-gray-100 py-2 rounded-lg font-medium text-black border-2 border-gray-200 px-4 focus:outline-none focus:border-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-2 rounded-lg font-semibold hover:bg-blue-600 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <>{Spinner}Confirm</> : "Confirm"}
            </button>
            <button
              type="button"
              className="flex-1 bg-white py-2 rounded-lg font-semibold text-black border-2 border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {confirm === "editPassword" && (
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (password1 !== "" && password2 !== "") {
              await handleUpdatePassword();
            }
          }}
        >
          <input
            type="password"
            className="w-full bg-gray-100 py-2 rounded-lg font-medium text-black border-2 border-gray-200 px-4 focus:outline-none focus:border-yellow-400"
            placeholder="Old password"
            value={password1}
            onChange={(e) => setPassword1(e.target.value)}
          />
          <input
            type="password"
            className="w-full bg-gray-100 py-2 rounded-lg font-medium text-black border-2 border-gray-200 px-4 focus:outline-none focus:border-yellow-400"
            placeholder="New password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          {fetchData && (
            <div className="w-full flex flex-col justify-center">
              {Array.isArray(err) &&
                err.map((e, index) => (
                  <p key={index} className="text-red-500 text-center">
                    {e.msg}
                  </p>
                ))}
            </div>
          )}
          <div className="flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="flex-1 bg-yellow-500 text-white py-2 rounded-lg font-semibold hover:bg-yellow-600 transition flex items-center justify-center"
              disabled={loading}
            >
              {loading ? <>{Spinner}Confirm</> : "Confirm"}
            </button>
            <button
              type="button"
              className="flex-1 bg-white py-2 rounded-lg font-semibold text-black border-2 border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
      {confirm === "logOut" && (
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            logout();
            setConfirm("");
            setText("accountLogout");
            setTimeout(() => setText(""), 3000);
          }}
        >
          <div className="flex gap-4 justify-center mt-2">
            <button
              type="submit"
              className="flex-1 bg-gray-700 text-white py-2 rounded-lg font-semibold hover:bg-gray-900 transition flex items-center justify-center"
            >
              Confirm
            </button>
            <button
              type="button"
              className="flex-1 bg-white py-2 rounded-lg font-semibold text-black border-2 border-gray-300 hover:bg-gray-100 transition"
              onClick={() => setConfirm(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

Confirm.propTypes = {
  confirm: PropTypes.string.isRequired,
  setConfirm: PropTypes.func.isRequired,
  render: PropTypes.any,
  setRender: PropTypes.func,
  setCopy: PropTypes.func,
};
