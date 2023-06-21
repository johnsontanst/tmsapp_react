import React, { useEffect, useReducer, useState, useContext } from "react";
import Axios from "axios";
import  { useNavigate } from 'react-router-dom'

//Import contexts
import DispatchContext from "../../DispatchContext";
import StateContext from "../../StateContext";

function LoginForm() {
  const [username, usernameFunc] = useState();
  const [password, passwordFunc] = useState();
  const navigate = useNavigate();

  //Contexts
  const srcDispatch = useContext(DispatchContext);
  const srcState = useContext(StateContext);

  async function handleSubmit(e) {
    e.preventDefault();
    try{
      await Axios.post('http://localhost:3000/login', {username, password}).then((data)=>{
        if(data.data.success){
          localStorage.setItem("authToken", data.data.token);
          localStorage.setItem("username", data.data.username);
          localStorage.setItem("group", data.data.group);
          console.log(localStorage.getItem("group"));
          srcDispatch({type:"login"});
          return navigate("/");
        }
        else{
          srcDispatch({type:"flashMessage", value:"Login error, pelase try again"});
        }
      })

    }
    catch(e){
      srcDispatch({type:"flashMessage", value:"Login error, pelase try again"});
    }
  }

  return (
    <>

      <div className="shadow-md rounded content-center">
        <form className="loginForm" onSubmit={handleSubmit}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
             className="shadow appearance-none border rounded w-full"
            onChange={(e) => usernameFunc(e.target.value)}
          />

          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            className="shadow appearance-none border rounded w-full"
            onChange={(e) => passwordFunc(e.target.value)}
          />

          <button className="btn bg-blue-500 shadow w-full mt-5">Submit</button>
        </form>
      </div>
    </>
  )
};

export default LoginForm;
