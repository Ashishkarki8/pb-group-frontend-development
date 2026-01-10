import { queryOptions } from '@tanstack/react-query';
import React from 'react'

const CreateToDoOptions = () => {
  return queryOptions({   /* jaba createtodooptions calls huncha yo function ley query options functions lai data pass garcha if calling gareko thauma () yesari call bhacha bhaney direct data pass huncha query options bhanner a pass garna parcha */
    queryKey: ["todos"], 
    queryFn: getTodos,
    enabled:true
  }) 
}


const getTodos = async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/todos");
  return await response.json();
};


export default CreateToDoOptions

