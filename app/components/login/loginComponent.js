import React, { useEffect, useState } from "react"

function LoginForm() {
  const [username, usernameFunc] = useState();
  const [password, passwordFunc] = useState();

  function handleSubmit(){
    console.log(username);
    console.log(password);
    alert(username + password);
  }

  return (
    <>
      <div>
        <form className="loginForm" onSubmit={handleSubmit}>

            <label htmlFor="username">Username</label>
            <input type="text" id="username" name="username" onChange={e=>usernameFunc(e.target.value)}/>

            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" onChange={(e=>passwordFunc(e.target.value))}/>

            <button>Submit</button>
        </form>
      </div>
    </>
  )
}

export default LoginForm