import React, { useEffect, useReducer } from "react";
import ReactDom from "react-dom";
import ReactDomClient from "react-dom/client";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { useImmerReducer } from "use-immer";

//components 
import Footer from "./components/global/footerComponent";
import Header from './components/global/headerComponent';
import GlobalLandingPage from "./components/global/globalLandingPage";
import LoginForm from "./components/login/loginComponent";
import FlashMessage from "./components/global/flashMessageComponent";

//Tailwindcss
import './main.css';


//Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"


function MainComponent(){

    //initState
    const initialState ={
        logIn: Boolean(localStorage.getItem('authToken')),
        flashMessage : [],
        user : {
            username : localStorage.getItem('username'),
            authToken: localStorage.getItem('authToken'),
            group: localStorage.getItem('group')
        }
    }

    function mainReducer(draft, action){
        switch(action.type){
            case"login":
                draft.logIn = true;
                draft.user = action.data;
                return
            case"logout":
                draft.logIn = false;
                return
            case "flashMessage":                
                draft.flashMessage.push(action.value);
                console.log(Array.from(draft.flashMessage));
                return
        }
    }

    //Reducer
    const [state, dispatch] = useImmerReducer(mainReducer, initialState);

    //useEffect
    console.log(state.user.group);

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter >
                    <Header />
                    <FlashMessage messages={state.flashMessage} />
                    <Routes>
                        <Route path="/" element={<GlobalLandingPage />} />
                        <Route path="/login" element={<LoginForm />}/>
                    </Routes>
                    <Footer />
                </BrowserRouter>
            </DispatchContext.Provider>
        </StateContext.Provider>

    )
};

const root = ReactDomClient.createRoot(document.querySelector("#app"));
root.render(<MainComponent />);


if (module.hot){
    module.hot.accept();
}
