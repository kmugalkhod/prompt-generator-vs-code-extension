
interface heading{
  text : string;
  text_size : string

}

export function Heading({text,text_size}:heading){

  return <div className='flex justify-center'>
      <h1 className={`${text_size}' text-white ml-4`}>{text
}</h1>
  </div>
}
