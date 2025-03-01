import { useContext, useEffect, useState } from 'react'
import '../App.css'
import { Outerbox } from '../components/outerbox'
import { Heading } from '../components/heading'
import { TextArea } from '../components/text_area'
import { Button, Dropdown } from '../components/button'
import { Summarizedicon, Translatecode, Writeemailicon } from '../assets/summarized_icon'
import { useNavigate } from 'react-router-dom'
import { UserPrompt } from '../context/userprompt'
import { vscode } from '../vscode.ts'

function Askprompt() {
  const [prompttext, setpromptText] = useState("");
  const navigate = useNavigate();
  const userPromptContext = useContext(UserPrompt);
  const [engine, setSelectedEngine] = useState("");
  const [selectedmodel, setSelectedModel] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const model: { [key: string]: { value: string; label: string }[] } = {
    openai: [
      { value: "gpt-4", label: "GPT-4" },
      { value: "gpt-4o", label: "GPT-4o" },
    ],
    anthropic: [
      { value: "claude-3-5-sonnet-20241022", label: "Sonnet-3.5-V2" },
      { value: "claude-3-5-haiku-20241022", label: "Haiku-3.5" }
    ],
  };

  useEffect(() => {
    window.addEventListener("message", (event) => {
      if (event.data.type === "health") {
        if (userPromptContext) {
          userPromptContext.setUserprompt(event.data.value);
        } else {
          console.error("UserPrompt context is undefined");
        }
      }
    });
  
    const messageHandler = (event: MessageEvent) => {
      if (event.data.type === "response_llm") {
        setIsLoading(false);
        if (userPromptContext) {
          userPromptContext.setUserprompt(event.data.value);
          navigate("/generate");
        }
      }
    };

    window.addEventListener("message", messageHandler);
    return () => {
      window.removeEventListener("message", () => {});
      window.removeEventListener("message", messageHandler);
    };
  }, [userPromptContext, navigate]);
  

  function handleGenerate(){
    setIsLoading(true);
    vscode.postMessage({
      type: "generate prompt",
      value: {
        userprompt: prompttext ,
        engine,
        selectedmodel,
        apiKey
      },
    })
  }

  return (
    <Outerbox>
      <div className="max-w-2xl w-full space-y-6">
        <header className="space-y-2">
          <Heading 
            text="Generate Prompt"
            text_size="font-bold text-2xl"
          />
          <Heading 
            text="You can generate a prompt template by sharing basic details about your task"
            text_size="text-sm text-[var(--vscode-descriptionForeground)]"
          />
        </header>

        <TextArea
          value={prompttext}
          onChange={(e) => setpromptText(e.target.value)}
        />

        <div className="flex flex-wrap gap-2">
          <Button
            text="Summarize"
            startIcon={<Summarizedicon/>}
            startIconVisible
            variant="secondary"
            size="sm"
            onClick={() => setpromptText("Summarize a document")}
          />
          <Button
            text="Write me an email"
            startIcon={<Writeemailicon/>}
            startIconVisible
            variant="secondary"
            size="sm"
            onClick={() => setpromptText("Write me an email")}
          />
          <Button
            text="Translate code"
            startIcon={<Translatecode/>}
            startIconVisible
            variant="secondary"
            size="sm"
            onClick={() => setpromptText("Translate code")}
          />
        </div>

        <div className="space-y-4">
          <Dropdown
            options={[
              { value: "openai", label: "OpenAI" },
              { value: "anthropic", label: "Anthropic" },
            ]}
            onChange={setSelectedEngine}
          />

          {engine && (
            <Dropdown
              options={model[engine]}
              onChange={setSelectedModel}
            />
          )}

          {selectedmodel && (
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-md
                bg-[var(--vscode-input-background)]
                text-[var(--vscode-input-foreground)]
                border border-[var(--vscode-input-border)]"
              placeholder="Enter API Key"
            />
          )}
        </div>

        <div className="flex justify-end gap-2">
          <Button
            text="Cancel"
            variant="secondary"
            onClick={() => {/* handle cancel */}}
            disabled={isLoading}
          />
          <Button
            text={isLoading ? "Generating..." : "Generate"}
            variant="primary"
            onClick={handleGenerate}
            disabled={!prompttext || !engine || !selectedmodel || !apiKey || isLoading}
          />
        </div>
      </div>
    </Outerbox>
  );
}

export default Askprompt
