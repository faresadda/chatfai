import { useState, useContext } from "react";
import { UserContext } from "../../context/userContext";
import { verifyEmail,resendCode } from "../../services/userServices";
import { useNavigate } from "react-router-dom";

export default function Verification() {
  const [otp, setOtp] = useState(["", "", "", "", ""]);
  const [response, setResponse] = useState(null);
  const [fetchData, setFetchData] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id,setToken,activation } = useContext(UserContext);
  const navigate = useNavigate()

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleVerifyEmail = async () => {
    const code = otp.join("");
    try {
      setLoading(true);
      const data = await verifyEmail({ id, code });
      setResponse(data);
      setFetchData(true);
      setLoading(false);
      if(data.status==='success')
        if(activation){
          navigate('/chat')
          setToken(data.user.token)
          localStorage.setItem('token',data.user.token)
        }
        else{
          localStorage.setItem('code',code)
          navigate('/new-password')
        }
    } catch {
      setLoading(false);
      alert("Something went wrong!");
    }
  };

  const handleResendCode = async () => {
    try {
      setLoading(true);
      const data = await resendCode({ id });
      setResponse(data);
      setFetchData(true);
      setLoading(false);
  
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  return (
    <section className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      <div
        className="bg-white rounded-2xl p-6 shadow-md w-150 mx-auto text-center relative max-[670px]:w-[90%]"
      >
        <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-4">
          We have sent a verification code to your email
        </p>
        <div className="flex justify-center gap-2 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              className="w-10 h-10 border border-gray-300 rounded text-center text-lg focus:outline-none focus:border-purple-500"
            />
          ))}
        </div>
        {loading && (
          <div className="flex items-center justify-center">
            <span className="loader loader-sm"></span>
          </div>
        )}
        {fetchData && response && (
          <p className="w-full text-center text-red-500 mb-5">
            {response.message}
          </p>
        )}

        <button
        type="submit"
        disabled={loading}
        onClick={() => {
          handleVerifyEmail();
          setFetchData(false);
        }}
        className="flex items-center gap-2 mx-auto bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition"
      >
        {loading && (
            <span className="loader loader-sm mr-2 flex items-center"></span>
          )}
          <span className="align-middle">
            {loading ? "Loading..." : "Verify"}
          </span>
      </button>

      <div className="text-sm mt-3 text-gray-500">
        Didn't receive the code?{' '}
        <button className="text-purple-500 hover:underline" onClick={()=>{handleResendCode()}}>
          Resend Code
        </button>
      </div>
      </div>
    </section>
  );
}
