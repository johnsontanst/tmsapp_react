import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function MyProfile() {
    const [username, setUsername] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [oldPassword, setOldPassword] = useState();

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    const navigate = useNavigate();

    async function getProfile(){
        try{
            const res = await Axios.post('http://localhost:3000/profile', {authTokenC:localStorage.getItem('authToken')});
            if(res.data.success){
                setUsername(res.data.username);
                setEmail(res.data.email);
            }
        }
        catch(e){
            srcDispatch({type:"flashMessage", value:"Error in getting profile"});
        }
    }

    async function updateProfile(e){
        e.preventDefault();
        try{
            const res = await Axios.post('http://localhost:3000/update/user', {username, password, oldPassword, email, authTokenC:localStorage.getItem('authToken')});
            console.log(res.data);
            if(res.data.success){
                srcDispatch({type:"flashMessage", value:"profile updated"});
                console.log("success");
                return navigate("/");
            }
        }
        catch(e){
            srcDispatch({type:"flashMessage", value:"Error in getting profile"});
        }
    }

    useEffect(()=>{
        getProfile();
    }, [])

    return ( 
        <>
            <div>My Profile</div>
            <form onSubmit={updateProfile}>
                <label htmlFor="username" className="block">Username</label>
                <input className="rounded shadow border bg-stone-500 opacity-75" type="text" value={username} readOnly name="username" id="username"/>

                <label htmlFor="email" className="block mt-5">Email</label>
                <input className="rounded shadow border" type="text" value={email} onChange={(e)=>setEmail(e.target.value)} name="email" id="email"/>
                
                <label htmlFor="password" className="block mt-5">New password</label>
                <input className="rounded shadow border" type="password" onChange={(e)=>setPassword(e.target.value)} name="password"/>

                <label htmlFor="oldPassword" className="block mt-5">Enter old password for verification</label>
                <input className="rounded shadow border" type="password" onChange={(e)=>setOldPassword(e.target.value)} name="oldPassword"/>
                <br></br>
                <Link className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mr-5 mt-5" to="/">Cancel</Link>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5">Submit</button>
            </form>
        </>
     );
}

export default MyProfile;