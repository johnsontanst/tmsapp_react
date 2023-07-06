import React, { useEffect } from "react"

import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function CreatePlan() {
    //navigate
    const navigate = useNavigate();

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

  return (
    <>
      
    </>
  )
}

export default CreatePlan