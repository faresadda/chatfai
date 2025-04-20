import {Context} from '../main';
import { useContext, useState,useEffect } from 'react';
export default function Confirm({ confirm,setConfirm,render,setRender }) {
  const {token,setToken,id,setId,text,setText,getUser,fetchUser,response}=useContext(Context)
  useEffect(() => {
    if (token && id) {
      getUser();
    }
  },[token,id]);
  const [name,setName]=useState(response.user.name)
  const [email,setEmail]=useState(response.user.email)
  const [password1,setPassword1]=useState('')
  const [password2,setPassword2]=useState('')
  const [err,setErr]=useState([])
  const updateProfile = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          name:name,
          email: email,
        }),
      
      });

      const user = await res.json();
      console.log("response", user);
      setRender(!render);
      if(user.status==='success'){
        setConfirm('')
        setText('profileUpdated')
        setTimeout(()=>{setText('')},3000)
    }}
    catch (err) {
      console.error("fetch data error:", err);
    }
  };
  const deleteUser = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/profile/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
      });

      const user = await res.json();
      console.log("response", user);
      if(user.status==='success'){
        setConfirm('')
        setText('accountDeleted')
        setTimeout(()=>{setText('')},3000)
    }}
    catch (err) {
      console.error("fetch data error:", err);
    }
  };
  const updatePassword = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/security/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
          "x-api-key":import.meta.env.VITE_MY_API_KEY,
        },
        body: JSON.stringify({
          oldpassword:password1,
          password:password2
        }),
      });

      const user = await res.json();
      setErr(user)
      console.log(user);
      if(user.status==='success'){
        setConfirm('')
        setText('passwordUpdated')
        setTimeout(()=>{setText('')},3000)
        setFetchData(false)}
      else{setFetchData(true)}}
    catch (err) {
      console.error("fetch data error:", err);
    }
  };
  const [fetchData,setFetchData]=useState(false)
  return (
    <section className="bg-white rounded-2xl px-5 py-20 absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-150 text-center
    max-[850px]:w-100 max-[550px]:w-[90%] max-[550px]:px-0">
      {confirm === "deleteChats" && (
        <form className="flex flex-col justify-center items-center gap-5 w-[80%] mx-auto!" onSubmit={(e)=>{e.preventDefault();
          setConfirm('');setText('chatsDeleted');setTimeout(()=>{setText('')},3000)
        }}>
          <p className='text-black'>Do you want to delete all chats ?</p>
          <div className='flex gap-5 justify-center w-full'>
          <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition">Confirm</button>
          <button className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black"  onClick={()=>{setConfirm(false)}}>Cancel</button>
          </div>
        </form>

      )}
      {confirm === "deleteAccount" && (
        <form className="flex flex-col justify-center items-center gap-5 w-[80%] mx-auto!" onSubmit={(e)=>{e.preventDefault();
          deleteUser().then(()=>{console.log('success')});
          localStorage.removeItem('token');
          localStorage.removeItem('id');
          setToken(null);
          setId(null);}}>
          <p className='text-black'>Do you want to delete your account ?</p>
          <div className='flex gap-5 justify-center w-full'>
          <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition">
            Confirm</button>
            <button className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black"  onClick={()=>{setConfirm(false)}}>Cancel</button>
            </div>
        </form>
      )}
      {confirm==='editProfile' && (
        <form className="flex flex-col justify-center items-center gap-5 w-[80%] mx-auto!" onSubmit={(e)=>{e.preventDefault();
          if (name!==response.user.name || email!==response.user.email) {
            updateProfile().then(()=>{return null});
          }
        }}>
        <input type='text' className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black px-8" value={name} onChange={(e)=>{setName(e.target.value)}}/>
        <input type='email' className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black px-8" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
        <div className='flex gap-5 justify-center w-full'>
        <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition" >
          Confirm</button>
          <button className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black"  onClick={()=>{setConfirm(false)}}>Cancel</button>
          </div>
      </form>
      )}
      {confirm==='editPassword' && (
        <form className="flex flex-col justify-center items-center gap-5 w-[80%] mx-auto!" onSubmit={(e)=>{e.preventDefault();
          if (password1!=='' && password2!=='') {
            updatePassword().then(()=>{return null});
          }
        }}>
        <input type='password' className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black px-8" placeholder='Old password' 
        value={password1} onChange={(e)=>{setPassword1(e.target.value)}}/>
        <input type='password' className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black px-8" placeholder='New password' 
        value={password2} onChange={(e)=>{setPassword2(e.target.value)}}/>
        {fetchData && <div className="w-full flex flex-col justify-center">{err.map((e,index)=>{
              return <p key={index} className="text-red-500 text-center">{e.msg}</p>})}</div>}
        <div className='flex gap-5 justify-center w-full'>
        <button className="w-full bg-black text-white py-2 rounded-lg font-medium hover:opacity-90 transition" >
          Confirm</button>
          <button className="w-full bg-white py-2 rounded-lg font-medium text-black border-2 border-black"  onClick={()=>{setConfirm(false)}}>Cancel</button>
          </div>
      </form>
      )}
    </section>
  );
}
