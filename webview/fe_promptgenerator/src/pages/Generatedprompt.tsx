import { useContext, useState } from 'react'
import '../App.css'
import { Outerbox } from '../components/outerbox'
import { Heading } from '../components/heading'
import { TextArea } from '../components/text_area'
import { UserPrompt } from '../context/userprompt'
import { Button } from '../components/button'

function Generateprompt() {
  const contextprompt = useContext(UserPrompt)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (contextprompt?.userprompt) {
      await navigator.clipboard.writeText(contextprompt.userprompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Outerbox>  
      <Heading text_size="font-bold text-2xl text-text-200" text="Prompt"/>
      {contextprompt && <TextArea value={contextprompt.userprompt} />}
      <div className='flex justify-center gap-2'>
        <Button 
          text={copied ? "Copied!" : "Copy"} 
          variant="secondary"
          onClick={handleCopy}
        />
        <Button 
          text="Back" 
          variant="primary"
          onClick={() => history.back()}
        />
      </div>
    </Outerbox>
  )
}

export default Generateprompt
