

import Askprompt from "./pages/Askprompt.tsx"

import { HashRouter as Router, Routes, Route } from "react-router-dom"
import Generateprompt from "./pages/Generatedprompt.tsx"
import { UserPromptProvider } from "./context/userprompt.ts"
import { useState } from "react";



function App() {
  
  const [userprompt, setUserprompt] = useState('');

  return ( 
  
  <UserPromptProvider value={{userprompt,setUserprompt}}>
    <Router>
      <Routes>
          <Route path="/" element = {<Askprompt/>}/> 
          <Route path="/generate" element = {<Generateprompt/>}/> 
      </Routes>
    </Router>
  </UserPromptProvider>
  )

}

export default App
