import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {Context} from '../main'
import { useContext } from 'react'
import { FiMail, FiLock } from 'react-icons/fi'
import { FaRegUser } from "react-icons/fa6";

const Login = () => {
  const [state, setState] = useState('login');
  const [name,setName]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const navigate=useNavigate()
  var { token, setToken, id, setId, text, setText } = useContext(Context);
  var [response,setResponse]=useState(null);
  var [fetchData,setFetchData]=useState(false)

  const registre = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/registre`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          name:name,
          email: email,
          password: password
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)

      if(data.status==="success"){
         localStorage.setItem("id", data.user._id);
        setId(localStorage.getItem('id'))
        setState('verification');
        setFetchData(false)
        if (data.user.isVerified===true) {
          localStorage.setItem("token", data.user.token);
          setToken(localStorage.getItem('token'))
          setText('accountCreated');
          setTimeout(()=>{setText('')},3000)
          
      }}
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };
  
  const login = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          email: email,
          password: password
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)

      if(data.user){
      if (data.user.isVerified===true) {
        localStorage.setItem("token", data.user.token);
        localStorage.setItem("id", data.user._id);
        setToken(localStorage.getItem('token'))
        setId(localStorage.getItem('id'))
        navigate('/ai');
        setText('accountLogin');
        setTimeout(()=>{setText('')},3000)

      } else {
        setFetchData(false)
        setState('verification')
      }}
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  var [otp, setOtp] = useState(['', '', '', '','']);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // تنقل تلقائي بين الخانات
    if (value && index < 4) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };
  const verifyEmail = async () => {
    const code=otp.join('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          code:code,
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)
    
      if(data.user){
        if (data.user.isVerified === true) {
          localStorage.setItem("token", data.user.token);
          localStorage.setItem("id", data.user._id);
          setToken(localStorage.getItem('token'))
          setId(localStorage.getItem('id'))
          navigate('/ai')
          setText('accountCreated');
          setTimeout(()=>{setText('')},3000)
      }}
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  const [verify,setVerify]=useState(true)
  const accountRecovery = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/accountRecovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          email:email
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)
    
      if (data.status === 'success') {
        setState('verification');
        localStorage.setItem("id", data.user._id);
        setId(localStorage.getItem('id'))
        setFetchData(false)
      } 
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  const verifyAccount = async () => {
    const code=otp.join('')
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/verify/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          code:code,
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)
    
      if (data.status==='success') {
        setState('newPassword')
        localStorage.setItem("id", data.user._id);
        setId(localStorage.getItem('id'))
        setFetchData(false)
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };

  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')

  const newPassword = async () => {
    if(password1==password2){
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/passwordRecovery/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          password:password1
        }),
      });
  
      const data = await res.json();
      setResponse(data)
      setFetchData(true)
      console.log(data)
    
      if (data.status==='success') {
        localStorage.removeItem('id');
        setId(null);
        setState('login')
        setFetchData(false)
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }}
    else{setResponse([{msg:'password does not match'}])
        setFetchData(true)
  };
  };
  const resendCode = async () => {
    try {
      await fetch(`${import.meta.env.VITE_BASE_URL}/resendCode/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY
        },
      });
  
    } catch (err) {
      console.error("Login error:", err);
      alert("Something went wrong!");
    }
  };
  return (
    <div className="bg-[rgb(30,30,30)] h-screen flex justify-center items-center">
      {state==='login' && (
        <div className=" bg-gray-100 flex flex-col items-center justify-center rounded-2xl w-100 max-[430px]:w-[90%]">
        <h1 className="text-2xl mt-10">Login</h1>
        <div className="p-10 w-full">
          <form onSubmit={(e)=>{e.preventDefault();login();setFetchData(false)}} className="space-y-5">
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
            {fetchData && <p className="w-full text-center text-red-500">{response.message}</p>}
            <p className="text-blue-600 hover:underline w-full text-center mb-5 cursor-pointer" onClick={()=>{setState('forgotPassword')}}>Forgot password?</p>
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mb-5"
            >
              Login
            </button>
  
            <p className="text-sm text-center text-gray-600 flex justify-center">
              Don’t have an account?{" "}
              <span className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={()=>{setState('registre');setFetchData(false)}}>Sign up</span>
            </p>
          </form>
        </div>
      </div>
      )}
      {state==='registre' && (
        <div className=" bg-gray-100 flex flex-col items-center justify-center rounded-2xl w-100 max-[430px]:w-[90%]">
        <h1 className="text-2xl mt-10">Sign up</h1>
        <div className="p-10 w-full">
          <form onSubmit={(e)=>{e.preventDefault();registre();setFetchData(false)}} className="space-y-5">
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
            {fetchData && <div className="w-full flex flex-col justify-center">{response.map((res,index)=>{
              return <p key={index} className="text-red-500 text-center">{res.msg}</p>})}</div>}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mt-5"
            >
              Sign up
            </button>
  
            <p className="text-sm text-center text-gray-600 flex justify-center">
              Have alredy an account?{" "}
              <span className="text-blue-600 font-medium hover:underline cursor-pointer" onClick={()=>{setState('login');setFetchData(false)}}>Login</span>
            </p>
          </form>
        </div>
      </div>
      )}
      {state==="verification" && (
      <form className="bg-white rounded-2xl p-6 shadow-md w-150 mx-auto text-center relative max-[670px]:w-[90%]"
            onSubmit={(e)=>{
              e.preventDefault()
              if(verify){verifyEmail();setFetchData(false)}
              else{verifyAccount()}}}>
        <h2 className="text-lg font-semibold mb-2">Enter OTP</h2>
        <p className="text-sm text-gray-600 mb-4">We have sent a verification code to your email</p>
      
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
          />))}
        </div>
        {fetchData && <p className="w-full text-center text-red-500 mb-5">{response.message}</p>}
      <button
        type="submit"
        className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-600 transition"
      >
        Verify
      </button>

      <div className="text-sm mt-3 text-gray-500">
        Didn't receive the code?{' '}
        <button className="text-purple-500 hover:underline" onClick={()=>{resendCode()}}>
          Resend Code
        </button>
      </div>
    </form>)}
      
      {state==='forgotPassword' && <form className=" bg-gray-100 flex flex-col items-center justify-center gap-5 rounded-2xl w-150 p-10 max-[700px]:w-[90%] max-[500px]:px-4"
      onSubmit={(e)=>{e.preventDefault();setVerify(false);accountRecovery();setFetchData(false)}}>
        <p>Account recovery</p>
        <input type='email' required placeholder="Enter your email" className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
        value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        {fetchData && <p className="w-full text-center text-red-500">{response.message}</p>}
        <button type="submit"
              className="w-[80%] bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mt-5">Enter</button>
        </form>}
      {state==='newPassword' && <form className=" bg-gray-100 flex flex-col items-center justify-center gap-5 rounded-2xl w-150 p-10 max-[650px]:w-[90%]"
           onSubmit={(e)=>{e.preventDefault();newPassword()}}>
        <p>Account recovery</p>
        <input type='password' required placeholder="New password" className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
           value={password1} onChange={(e)=>{setPassword1(e.target.value)}}/>
        <input type='password' required placeholder="New password" className="flex-1 outline-none border border-gray-300 rounded-lg px-3 py-2 w-[80%]"
           value={password2} onChange={(e)=>{setPassword2(e.target.value)}}/>
        {fetchData && <div className="w-full flex flex-col justify-center">{response.map((res,index)=>{
              return <p key={index} className="text-red-500 text-center">{res.msg}</p>})}</div>}
        <button type="submit" className="w-[80%] bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition mt-5">Enter</button>
        </form>}
    </div>)
}

export default Login;
