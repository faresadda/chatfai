import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Chat from "./pages/chat";
import Home from "./pages/home";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import ForgotPassword from "./pages/auth/forgotPassword";
import Verification from "./pages/auth/verification";
import NewPassword from "./pages/auth/newPassword";
import { UserProvider } from "./context/userContext";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route index element={<Home />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verification" element={<Verification />} />
            <Route path="/new-password" element={<NewPassword />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
