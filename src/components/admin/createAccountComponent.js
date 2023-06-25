import React, { useEffect, useContext, useReducer, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

//Context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";

function CreateAccount() {

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const navigate = useNavigate();

    //Contexts
    const srcDispatch = useContext(DispatchContext);
    const srcState = useContext(StateContext);

    //handleSubmit
    async function handleSubmit(e){
        e.preventDefault();
        try{
            const res = await Axios.post("http://localhost:3000/register", {username, password, email}, {withCredentials:true});
            if(res.data.success){
                srcDispatch({type:"flashMessage", value:"user registered"});
                navigate("/allusers");
            }
        }
        catch(e){
            srcDispatch({type:"flashMessage", value:"Error in registering user"});
        }
    }

    //Check admin permission
    function checkUserAdmin(){
        if(srcState.group != "admin"){
            navigate("/");
        }
    }


    //useEffect
    useEffect(()=>{
        checkUserAdmin();
    });


  return (
    <>
        <h1 className="p-5">Register account (Admin only)</h1>
      <form className="p-5" onSubmit={handleSubmit}>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="text"
            name="floating_username"
            id="floating_username"
            className="block py-2.5 px-0 w-full text-sm text-stone-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-stone-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e)=>setUsername(e.target.value)}
            required
          />
          <label
            htmlFor="floating_username"
            className="peer-focus:font-medium absolute text-sm text-stone-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Username
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="email"
            name="floating_email"
            id="floating_email"
            className="block py-2.5 px-0 w-full text-sm text-stone-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-stone-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e)=>setEmail(e.target.value)}
            required
          />
          <label
            htmlFor="floating_email"
            className="peer-focus:font-medium absolute text-sm text-stone-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Email address
          </label>
        </div>
        <div className="relative z-0 w-full mb-6 group">
          <input
            type="password"
            name="floating_password"
            id="floating_password"
            className="block py-2.5 px-0 w-full text-sm text-stone-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-stone-900 dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            placeholder=" "
            onChange={(e)=>setPassword(e.target.value)}
            required
          />
          <label
            htmlFor="floating_password"
            className="peer-focus:font-medium absolute text-sm text-stone-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
          >
            Password
          </label>
        </div>

        <Link className="text-white bg-stone-500 hover:bg-stone-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-stone-600 dark:hover:bg-stone-700 dark:focus:ring-blue-800 mr-5">Cancel</Link>
       
        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Submit
        </button>
      </form>
    </>
  );
}

export default CreateAccount;
