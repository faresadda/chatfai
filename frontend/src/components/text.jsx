import { useContext } from "react";
import { UserContext } from "../context/userContext";

const messages = {
  accountCreated: "Account created successfully.",
  accountDeleted: "Your account has been deleted.",
  accountLogin: "Account logged in.",
  accountLogout: "Account logged out.",
  chatsDeleted: "All chats have been deleted.",
  profileUpdated: "Your account information has been updated.",
  passwordUpdated: "Your password has been updated.",
};

export default function Text() {
  const { text } = useContext(UserContext);
  if (!text || !messages[text]) return null;

  return (
    <div
      className="fixed top-8 left-1/2 -translate-x-1/2 z-50"
      style={{ minWidth: 320, maxWidth: 400 }}
    >
      <div className="flex items-center gap-3 bg-white/90 border border-green-200 shadow-xl rounded-xl px-6 py-4">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 border border-green-200">
          <svg width="20" height="20" fill="none" viewBox="0 0 20 20">
            <circle cx="10" cy="10" r="10" fill="#22c55e" opacity="0.15" />
            <path
              d="M6 11l2 2 5-5"
              stroke="#22c55e"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span
          className="text-green-800 font-medium text-base"
          style={{ fontFamily: "Montserrat, Inter, sans-serif" }}
        >
          {messages[text]}
        </span>
      </div>
    </div>
  );
}
