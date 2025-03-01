import { createContext } from 'react'

interface UserPromptContextType {
  userprompt: string;
  setUserprompt: React.Dispatch<React.SetStateAction<string>>;
}


export const UserPrompt = createContext<UserPromptContextType | undefined>(undefined);


export const UserPromptProvider = UserPrompt.Provider;
