import React, { useEffect, useReducer } from "react";
import ReactDom from "react-dom";
import ReactDomClient from "react-dom/client";
import { BrowserRouter, Route, Routes, Redirect } from "react-router-dom";
import { useImmerReducer } from "use-immer";
import Axios from "axios";
import {useNavigate} from "react-router-dom"


//components 
import Footer from "./components/global/footerComponent";
import Header from './components/global/headerComponent';
import GlobalLandingPage from "./components/global/globalLandingPage";
import LoginForm from "./components/login/loginComponent";
import FlashMessage from "./components/global/flashMessageComponent";
import AccountsOverview from "./components/admin/accountsOverviewComponent";
import AdminEditUser from "./components/admin/adminEditUserComponent";
import CreateAccount from "./components/admin/createAccountComponent";

//Tailwindcss
import './main.css';


//Contexts
import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"
import MyProfile from "./components/profile/myProfileComponent";


function MainComponent(){

    //initState
    const initialState ={
        logIn: false,
        flashMessage : [],
        username: "nil",
        group: [],
        isAdmin : false
    }


    function mainReducer(draft, action){
        switch(action.type){
            case"login":
                draft.logIn = true;
                draft.username = action.value.username
                draft.isAdmin = action.admin
                draft.group = action.value.groups
                return
            case"logout":
                draft.logIn = false;
                draft.isAdmin = false;
                return
            case "flashMessage":                
                draft.flashMessage.push(action.value);
                return
            case "removeFlashMessage":
                draft.flashMessage = []
                return
            case "toogleAdmin":
                if(draft.isAdmin == true) draft.isAdmin = false
                else draft.isAdmin = true
                return
        }
    }

    //Reducer
    const [state, dispatch] = useImmerReducer(mainReducer, initialState);

    //useEffect
    useEffect(()=>{
        const getUserInfo = async()=>{
            const res = await Axios.post("http://localhost:3000/authtoken/return/userinfo", {},{withCredentials:true});
            if(res.data.success){
                dispatch({type:"login", value:res.data, admin:res.data.groups.includes("admin")});
            }
        }
        getUserInfo();
    }, [])

    return (
        <StateContext.Provider value={state}>
            <DispatchContext.Provider value={dispatch}>
                <BrowserRouter >
                    <Header />
                    {state.flashMessage.length != 0 ? state.flashMessage.map((alert, index)=>(
                        <FlashMessage messages={alert} index={index} />
                    )) : null}
                    <Routes>
                        <Route path="/" element={<GlobalLandingPage />} />
                        <Route path="/login" element={<LoginForm />}/>
                        <Route path="/profile" element={<MyProfile />}/>
                        <Route path="/user-management" element={<AccountsOverview />} />
                        <Route path="/admin/user/profile" element={<AdminEditUser/>} />
                        <Route path="/register" element={<CreateAccount />} />
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
