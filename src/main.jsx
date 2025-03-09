import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Ai from './components/Ai'
import Home from './components/Home'
import { BrowserRouter, Routes,Route,Outlet } from 'react-router-dom'

export default function App(){
  const [answers, setAnswers] = useState(() => {
    const save = localStorage.getItem("answers");
    return save ? JSON.parse(save) : [];});
  useEffect(() => {
      localStorage.setItem("answers", JSON.stringify(answers));
    }, [answers]);
  
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Outlet/>}>
        <Route index element={<Home setAnswers={setAnswers}/>} />
        <Route path='/ai' element={<Ai answers={answers} setAnswers={setAnswers}/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App/>
  </StrictMode>
)


