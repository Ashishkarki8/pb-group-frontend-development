// import { useQuery } from '@tanstack/react-query';
// import { Loader } from 'lucide-react';
// import React from 'react'

// const LearningTanstack = () => {
//    const { data, isPending } = useQuery({
//     queryKey: ["todos"],
//     queryFn: getTodos,
//   });
//   console.log("fetched data from getTodos whose key is todos is", data);
//  return (
//   <div>
//     <h1>1st Learning</h1>
//     <div>
//       { isPending ? <Loader/> : JSON.stringify(data?.slice(0, 10))} {/*  0 dekhi 10th samma ko array print gara array of obj */}
//     </div>
//   </div>
// );

// }

// const getTodos = async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/todos");
//   return await response.json();
// };

// export default LearningTanstack



// usecase2 
// import { useQuery } from "@tanstack/react-query";
// import { Loader } from "lucide-react";
// import React from "react";

// const LearningTanstack = () => {
//   const { data, isPending, refetch, isFetching,error } = useQuery({
//     queryKey: ["todos"], //
//     queryFn: getTodos,
//   });
//   console.log("fetched data from getTodos whose key is todos is", data);

//   // for error
//    if (error){
// console.log(alert("error",error))
//       }
//   return (
//     <div>
//       <h1>1st Learning</h1>

//       <div>
//         {isPending ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
//       </div> //dasdasd
//       <button
//         onClick={() => {   
//           refetch();
//         }}
//       >
//         Refresh
//       </button>

//       <div>
//         {isFetching ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
//       </div> 
//       <button                 
//         onClick={() => { 
//           refetch();
//         }}
//       >
//         Refresh
//       </button>

//       {/* for showing error */}
     
     
//     </div>
//   );
// };

// const getTodos = async () => {
//   const response = await fetch("https://jsonplaceholder.typicodeaaaa.com/todos");
//   return await response.json();
// };

// export default LearningTanstack;









//usecase 2 with comments
// import { useQuery } from "@tanstack/react-query";
// import { Loader } from "lucide-react";
// import React from "react";

// const LearningTanstack = () => {
//   const { data, isPending, refetch, isFetching } = useQuery({
//     queryKey: ["todos"], //
//     queryFn: getTodos,
//   });
//   console.log("fetched data from getTodos whose key is todos is", data);
//   return (
//     <div>
//       <h1>1st Learning</h1>
        
//       {/* 1st case for using pending for refresh botton */}
//       <div>
//         {/*  0 dekhi 10th samma ko array print gara array of obj */}
//         {isPending ? <Loader /> : JSON.stringify(data?.slice(0, 10))} // NOTE: This section toggles list rendering
//       </div>
//       {/* refresh thichda data query key ley garda cache mah bascha so data instant load huncha cache bata so loading spinner dekhaudaina */}
//       <button
//         onClick={() => {
//           refetch();
//         }}
//       >
//         Refresh
//       </button>


//       {/* 2st case for using isFetching for showing loader everytime
//         it is used for telling user that i data is fetching from the database so change in data is expected
//     */}
//       <div>
//         {isFetching ? <Loader /> : JSON.stringify(data?.slice(0, 10))} {/* " 0 dekhi 10th samma ko array print gara array of obj" */}
//         {/*  0 dekhi 10th samma ko array print gara array of obj */}
//       </div>
//       <button
//         onClick={() => {
//           refetch();
//         }}
//       >
//         Refresh
//       </button>{" "}
//       {/* refresh thichda data query key ley garda cache mah bascha so data instant load huncha cache bata so loading spinner dekhaudaina */}
//     </div>
//   );
// };

// const getTodos = async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/todos");
//   return await response.json();
// };

// export default LearningTanstack;



// usecase3 getiing the dinamic various posts based on id 

// import { useQuery } from "@tanstack/react-query";
// import { Loader } from "lucide-react";
// import React, { useState } from "react";

// const LearningTanstack = () => {
//   const [id,setID]=useState(1);
//   const { data, isPending, refetch, isFetching,error } = useQuery({
//     queryKey: ["todos",id],  //catching ko lagi id halna parcha
//     queryFn:()=>{ return getTodos(id)} , /* return rakhna parcha  cause this are async functions */
//   });
//   console.log("fetched data from getTodos whose key is todos is", data);

//   // for sudden error while fetching the data
//    if (error){
// console.log(alert("error",error))
//       }
//   return (
//     <div>
//       <h1>1st Learning</h1>

//       <div>
//         {isPending ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
//       </div> 
//       <button
//         className=" border-4 bg-blue-500 m-2 p-4 rounded-2xl "
//         onClick={() => {   
//           refetch();
//         }}
//       >
//         Refresh
//       </button>
//     <br />
//     <br />
//       <div>
//         {isFetching ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
//       </div> 
//       <button className=" border-4 bg-amber-500 m-2 p-4 rounded-2xl "                 
//         onClick={() => { 
//           refetch();
//         }}
//       >
//         Refresh
//       </button>
//         <br />
//       {/* for fetchiung the */}
//       <br />
//      <h1>{`the data of id ${id} is ${JSON.stringify(data)}`}</h1>
//      <button className=" border-4 bg-red-500 m-2 p-4 rounded-2xl " onClick={()=>{setID(id+1)}}>increment</button>
//     </div>
//   );
// };

// const getTodos = async (id) => {
//   const response = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${id}`);
//   return await response.json();
// };

// export default LearningTanstack;







// boolena value true bhaye api call garni haina bhani call nagarni ni garuana milcha using enabled
import { queryOptions, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import React from "react";
import CreateToDoOptions from "../api/queryOptions/CreateToDoOptions";

const LearningTanstack = () => {
  const { data, isPending, refetch, isFetching,error } =useQuery(CreateToDoOptions()); //queryoptions({yesari use query lai pathauna parcha})
  console.log("fetched data from getTodos whose key is todos is", data);

  // for error
   if (error){
console.log(alert("error",error))
      }
  return (
    <div>
      <h1>1st Learning</h1>

      <div>
        {isPending ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
      </div> 
      <button
        onClick={() => {   
          refetch();
        }}
      >
        Refresh
      </button>

      <div>
        {isFetching ? <Loader /> : JSON.stringify(data?.slice(0, 10))} 
      </div> 
      <button                 
        onClick={() => { 
          refetch();
        }}
      >
        Refresh
      </button>

      {/* for showing error */}
     
     
    </div>
  );
};

// const getTodos = async () => {
//   const response = await fetch("https://jsonplaceholder.typicode.com/todos");
//   return await response.json();
// };

export default LearningTanstack;



// quey reusable ko lagi code divide garni tesko lagi euta folder banachu
// use query haina query options lai data pass garcham hami






//typescript

// data mah hover garda type any dekhaucha so data safty hudaina so ts use garera kitah todo [] kitah undefined huncha






//yedi hamro data undefined hudai hudaina kailey pani bhaney hami usequery ko satta useSuspesequery use garcham


//yedi eutai component mah euta query run huncha ra data leraucha rah tespachi tesko data nai use garera arko query run huncha bhaneyni tesko lagi

//rah yedi multiple query run huna cha tara data ekarka sanga indepenedent cha bhaney useQueries() use agrcham rah tyo bhitra obj pass garcham queries naam ko key eg useQueries({queries:[createTodoQueryOptions(), second one]})





