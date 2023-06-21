import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

//Import contexts
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function Header() {
 
  const srcContext = useContext(StateContext);
  const srcDispatch = useContext(DispatchContext);
  const navigate = useNavigate();

  //Logout
  function logoutFunc(){
    //Clear localstorage
    localStorage.clear();
    //Set useState logIn to false
    srcDispatch({type:"logout"});
    return navigate('/login');
  }

  return (
    <>
      <nav className="navbar">
        <div className="logo"><Link to="/">TMS</Link></div>

        <ul className="nav-links">

          <div className="menu">
            <li>
              {srcContext.user.group === "admin" ? <Link to="/">User management page</Link> : ""}
            </li>
            <li>
              <Link to="/">Profile</Link>
            </li>

            <li>
              {srcContext.logIn ? <button onClick={logoutFunc}>Logout</button> : <Link to="/login">Login</Link>}
            </li>

          </div>
        </ul>
      </nav>
    </>
  );
}

export default Header