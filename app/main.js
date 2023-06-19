import React from "react";
import ReactDom from "react-dom";
import ReactDomClient from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

//components 
import Footer from "./components/global/footerComponent";
import Header from './components/global/headerComponent';
import LandingPage from './components/landingpageComponent';
import LoginForm from "./components/login/loginComponent";

function MainComponent(){
    return (
        <BrowserRouter >
            <Header />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginForm />}/>
            </Routes>
            <Footer />
        </BrowserRouter>
    )
};

const root = ReactDomClient.createRoot(document.querySelector("#app"));
root.render(<MainComponent />);


if (module.hot){
    module.hot.accpet();
}
