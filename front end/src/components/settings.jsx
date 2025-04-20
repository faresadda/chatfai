import { useState,useContext,useEffect } from "react"
import { IoClose } from "react-icons/io5";
import {Context} from '../main';
import Confirm from './confirm'
import { FaFacebook } from "react-icons/fa";
import { RiInstagramFill } from "react-icons/ri";
import { FaTiktok } from "react-icons/fa";
export default function Settings({dark,setSettings,render,setRender}){
  const {token,setToken,id,setId,text,setText,getUser,fetchUser,response}=useContext(Context)
    useEffect(() => {
        if (token && id) {
          getUser();
        }
      },[token,id,render]);
    const [confirm,setConfirm]=useState('')
    const [option,setOption]=useState('profile')
    return(
        <section className={`absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-[80%] h-[80%] z-10 rounded-2xl p-10
        ${dark ? 'bg-[rgb(44,44,44)] text-white' : 'bg-[rgb(228,228,228)] text-black'} max-[600px]:w-[90%] max-[450px]:w-[95%] max-[450px]:px-3`}>
            <p className="text-2xl pb-10">Settings</p>
            <div className="flex justify-between gap-10 max-[550px]:flex-col">
                <div className="w-[20%] flex flex-col gap-5 max-[550px]:flex-row max-[550px]:w-full max-[550px]:justify-center">
                    <p className={`${option==='profile'? (dark ? 'bg-black' : 'bg-white') : ''} p-2 rounded-xl w-20 text-center cursor-pointer`} onClick={()=>{setOption('profile')}}>Profile</p>
                    <p className={`${option==='security'? (dark ? 'bg-black' : 'bg-white') : ''} p-2 rounded-xl w-20 text-center cursor-pointer`} onClick={()=>{setOption('security')}}>Security</p>
                </div>
                {option==='profile' && <div className="w-[70%] flex flex-col gap-5 max-[550px]:w-full ">
                    <span className="flex justify-between items-center">
                        <p>Name</p>
                        {fetchUser && <p>{response.user.name}</p>}
                    </span>
                    <span className="flex justify-between items-center">
                        <p>Gmail</p>
                        {fetchUser && <p>{response.user.email}</p>}
                    </span>
                    <span className="flex justify-between items-center">
                        <p>Edit account</p>
                        <button className="bg-red-500 py-1 px-3 rounded-lg text-white" onClick={()=>{setConfirm('editProfile')}}>Edit</button>
                    </span>
                    <span className="flex justify-between items-center">
                        <p>Delete all chats</p>
                        <button className="bg-red-500 py-1 px-3 rounded-lg text-white"
                        onClick={()=>{setConfirm('deleteChats')}}>Delete</button>
                    </span>
                    <span className="flex justify-between items-center">
                        <p>Delete account</p>
                        <button className="bg-red-500 py-1 px-3 rounded-lg text-white"
                        onClick={()=>{setConfirm('deleteAccount')}}>
                            Delete</button>
                    </span>
                </div>}
                {option==='security' && <div className="flex justify-between w-[70%] max-[550px]:w-full">
                        <p>Edit password</p>
                        <button className="bg-red-500 py-1 px-3 rounded-lg text-white h-fit" onClick={()=>{setConfirm('editPassword')}}>Edit</button>
                    </div>}
              
            </div>
            <IoClose className="absolute top-10 right-10 text-2xl" onClick={()=>{setSettings(false)}}/>
            {confirm && <Confirm confirm={confirm} setConfirm={setConfirm} render={render} setRender={setRender}/>}
        </section>
    )
}
