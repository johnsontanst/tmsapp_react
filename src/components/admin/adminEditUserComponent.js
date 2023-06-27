import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function AdminEditUser() {
    //Using Link state to parse data by useLocation(react-router-dom)
    const {state} = useLocation();

    const [username, setUsername] = useState(state.username);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [status, setStatus] = useState();
    const [groups, setGroups] = useState([]);
    const [allgroups, setallgroups] = useState([]);

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    const navigate = useNavigate();

    function changeStatus(s){
        setStatus(s);
    }

    function handleGroupChange(tt){
        const updatedOptions = [...tt.target.options].filter(option => option.selected)
        .map(x => x.value);
        console.log(updatedOptions);
        
        setGroups(updatedOptions);
    }

    async function getProfile(){
        try{
            const res = await Axios.post('http://localhost:3000/admin/user/profile', {username}, {withCredentials: true});
            if(res.data.success){
                console.log(res.data)
                setUsername(res.data.username);
                setEmail(res.data.email);
                setStatus(res.data.status);
                //Set user groups
                if(res.data.groups.length != 0){
                    const tempGroups = []
                    for (let i=0; i<res.data.groups.length; i++){
                        tempGroups.push(res.data.groups[i].groupName);
                    }
                    setGroups(tempGroups);
                }

                //Set all groups
                if(res.data.allgroups.length != 0){
                    const tempGroups = []
                    for (let i=0; i<res.data.allgroups.length; i++){
                        tempGroups.push(res.data.allgroups[i].groupName);
                    }
                    setallgroups(tempGroups);
                }
            }
        }
        catch(e){
            srcDispatch({type:"flashMessage", value:"Error in getting user profile"});
        }
    }

    async function updateProfile(e){
        //if user is not admin redirect to home, else continue 
        if(!srcState.isAdmin){
            return navigate("/");
            }

        e.preventDefault();
        try{
            const res = await Axios.post('http://localhost:3000/admin/update/user', {username, password, groups, email, status}, {withCredentials: true});
            if(res.data.success){
                srcDispatch({type:"flashMessage", value:"profile updated"});
                return navigate("/user-management");
            }
        }
        catch(e){
            srcDispatch({type:"flashMessage", value:"Error in updating profile"});
        }
    }

    useEffect(()=>{
        const getUserInfo = async()=>{
            const res = await Axios.post("http://localhost:3000/authtoken/return/userinfo", {},{withCredentials:true});
            if(res.data.success){
                srcDispatch({type:"login", value:res.data, admin:res.data.groups.includes("admin")});
                if(!await res.data.groups.includes("admin")){
                  return navigate("/")
                }
                else{
                    getProfile();
                }
            }
        }
        getUserInfo();
    }, [])

    return ( 
        <>
        <div className="grid grid-cols-3 grid-row-2">
            <div></div>
            <div>{username}'s profile</div>
            <div></div>
            <div></div>
            <div>
                <form onSubmit={updateProfile}>
                    <label htmlFor="username" className="block">Username</label>
                    <input className="rounded shadow border bg-stone-500 opacity-75" type="text" value={username} readOnly name="username" id="username"/>

                    <label htmlFor="email" className="block mt-5">Email</label>
                    <input className="rounded shadow border" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} name="email" id="email"/>
                    
                    <label htmlFor="password" className="block mt-5">New password</label>
                    <input className="rounded shadow border" type="password" onChange={(e)=>setPassword(e.target.value)} name="password"/>

                    <label htmlFor="status" className="block mt-5">Account Status</label>
                    <select value={status} onChange={(e)=>changeStatus(e.target.value)} name="status">
                        <option value="1">Active</option>
                        <option value="0">Disable</option>
                    </select>

                    <label htmlFor="groups" className="block mt-5">Groups</label>
                    <select multiple={true} value={groups} onChange={handleGroupChange} name="groups">
                        {allgroups.map((group)=>(
                            <option value={group}>{group}</option>
                        ))}
                        
                    </select>

                    <br></br>
                    <Link className="bg-teal-500 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-full mr-5 mt-5" to="/allusers">Cancel</Link>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mt-5">Submit</button>
                </form>
            </div>
            <div></div>
        </div>

        </>
     );
}

export default AdminEditUser;