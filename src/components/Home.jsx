import logo from "../../public/logo.jpg";
import { Link} from "react-router-dom";
export default function Home({setAnswers}) {
  return (
    <div className="bg-[rgb(30,30,30)] min-h-[100vh] flex flex-col justify-center items-center gap-20 text-white pt-30">
      <div className="flex items-center gap-2 absolute top-5 left-5">
        <p className="text-2xl font-semibold tracking-[2px] max-[580px]:text-xl">CHATFAI</p>
        <img src={logo} className="w-6 rounded-[50%]" />
      </div>
      <div className="flex flex-col justify-center items-center gap-5">
      <h1 className="text-7xl font-bold tracking-[10px] max-[580px]:text-5xl">CHATFAI</h1>
      <p className="text-center w-[60%] max-[600px]:w-[80%]">Chatfai is an artificial intelligence model designed for natural language understanding and generation, enabling interactive, human-like conversations and assisting with various tasks.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-10 w-full px-30 max-[610px]:px-20 max-[525px]:px-10 max-[400px]:px-5">
        <Link className="bg-white p-10 rounded-2xl text-black" to='/ai' onClick={()=>{setAnswers([])}}>
          <h2 className="text-2xl pb-4">Get Started</h2>
          <p>try chatfai for free, best experience with the artificial intelligence model</p>
        </Link>
        <Link className="bg-white p-10 rounded-2xl text-black">
          <h2 className="text-2xl pb-4">Sign Up | Login</h2>
          <p>Registre now</p>
        </Link>
      </div>
      <p>&copy;2025 All rights reserved to chatfai</p>
    </div>
  );
}
