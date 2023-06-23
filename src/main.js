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
import AccountsOverview from "./components/admin/accountsOverviewComponent";
import AdminEditUser from "./components/admin/adminEditUserComponent";

//Tailwindcss
import './main.css';


//Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import MyProfile from "./components/profile/myProfileComponent";


function MainComponent(){

    //initState
    const initialState ={
        logIn: Boolean(localStorage.getItem('authToken')),
        flashMessage : [],
        username: localStorage.getItem('username'),
        group: localStorage.getItem('group')
    }

    function mainReducer(draft, action){
        switch(action.type){
            case"login":
                draft.logIn = true;
                return
            case"logout":
                draft.logIn = false;
                return
            case "flashMessage":                
                draft.flashMessage.push(action.value);
                return
        }
    }

    //Reducer
    const [state, dispatch] = useImmerReducer(mainReducer, initialState);

    //useEffect
    useEffect(()=>{
        const cook = document.cookie.split(';');
        console.log(cook);
    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter >
                    <Header />
                    <FlashMessage messages={state.flashMessage} />
                    <Routes>
                        <Route path="/" element={<GlobalLandingPage />} />
                        <Route path="/login" element={<LoginForm />}/>
                        <Route path="/profile" element={<MyProfile />}/>
                        <Route path="/allusers" element={<AccountsOverview />} />
                        <Route path="/admin/user/profile" element={<AdminEditUser/>} />
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
