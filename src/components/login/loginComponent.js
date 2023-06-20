import React, { useEffect, useState } from "react";
import Axios from "axios";

function LoginForm() {
  const [username, usernameFunc] = useState();
  const [password, passwordFunc] = useState();

  async function handleSubmit(e) {
    e.preventDefault();
    try{
      await Axios.get('http://localhost:3000/').then((data)=>{
        console.log(data);
      })

    }
    catch(e){
      alert(e);
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
