import React, { useEffect, useContext, useReducer } from "react"
import { Link } from "react-router-dom";

function FlashMessage(props) {

  return (
    <>
      <p className="text-lg">
        {props.messages}
      </p>
      
    </>
  );
}

export default FlashMessage;