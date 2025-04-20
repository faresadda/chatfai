import {Context} from '../main'
import { useContext } from 'react'
export default function Text(){
    const { token, setToken, id, setId, text, setText } = useContext(Context)
    return(
        <section className="bg-green-600 rounded-2xl p-5 absolute top-[50%] left-[50%] transform -translate-x-[50%] -translate-y-[50%] w-fit text-center text-white z-30">
            {text==='accountCreated' && <p>Acount created successfully</p>}
            {text==='accountDeleted' && <p>Your account has been deleted</p>}
            {text==='accountLogin' && <p>Acount logged in</p>}
            {text==='accountLogout' && <p>Acount logged out</p>}
            {text==='chatsDeleted' && <p>All chats have been deleted</p>}
            {text==='profileUpdated' && <p>Your account information has been updated.</p>}
            {text==='passwordUpdated' && <p>Your password has been updated.</p>}
        </section>
    )
}