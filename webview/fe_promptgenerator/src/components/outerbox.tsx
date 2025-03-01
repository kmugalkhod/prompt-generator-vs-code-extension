


import { ReactNode } from 'react';

interface OuterboxProps {
  children: ReactNode;
}

export function Outerbox({ children }: OuterboxProps) {
  return (
   
 
      <div className="h-screen mx-auto w-screen overflow-hidden flex flex-col items-center text-center  bg-black-700  md:p-6  p-4  gap-4">
        {children}            
     </div>
  );
}