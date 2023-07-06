import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";


function CreateApp() {
    //navigate
    const navigate = useNavigate();

    //useState fields
    const [acronym, setAcronym] = useState();
    const [description, setDescription] = useState();
    const [rnumber, setRnumber] = useState();
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();
    const [open, setOpen] = useState();
    const [toDo, setTodo] = useState();
    const [doing, setDoing] = useState();
    const [done, setDone] = useState();
    const [groups, setGroups] = useState([]);

    //HandleSubmit
    async function onSubmit(e){
        e.preventDefault();
        console.log(acronym, description, rnumber, startDate, endDate, open, toDo, doing, done);
        try{
            const result = await Axios.post('http://localhost:3000/create-application',{acronym, description, rnumber, startDate, endDate, open, toDo, doing, done}, {withCredentials:true});

        }
        catch(err){
            console.log(err.response.data.message);
            if(err.response.data.message === "invalid end date"){
                srcDispatch({type:"flashMessage", value:"Invalid end date"});
            }
            else if(err.response.data.message === "Input require fields"){
                srcDispatch({type:"flashMessage", value:"Input fields required"});
            }
            else if(err.response.data.message === "invalid start date"){
                srcDispatch({type:"flashMessage", value:"Invalid start date"});
            }
            else if(err.response.data.message === "invalid group open"){
                srcDispatch({type:"flashMessage", value:"Invalid permit open group"});
            }
            else if(err.response.data.message === "invalid group toDo"){
                srcDispatch({type:"flashMessage", value:"Invalid permit toDo group"});
            }
            else if(err.response.data.message === "invalid group doing"){
                srcDispatch({type:"flashMessage", value:"Invalid permit doing group"});
            }
            else if(err.response.data.message === "invalid group done"){
                srcDispatch({type:"flashMessage", value:"Invalid permit done group"});
            }
            else if(err.response.data.message.code === "ER_DUP_ENTRY"){
                srcDispatch({type:"flashMessage", value:"Application acronym exist"});
            }
            else{
                srcDispatch({type:"flashMessage", value:"Create application error"});
            }
        }
    }


    //Get groups
    async function getGroups(){
        try{
            const groupResult = await Axios.post('http://localhost:3000/allgroups', {un:srcState.username, gn:"admin"}, {withCredentials:true});
            if(groupResult.data.success){
                setGroups(groupResult.data.groups);
            }
            else{
                srcDispatch({type:"flashMessage", value:"Error in getting groups"});
            }
        }
        catch(e){
            console.log(e)
            srcDispatch({type:"flashMessage", value:"Error in getting groups"});
        }
    }

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    //useEffect
    useEffect(()=>{
        const getUserInfo = async()=>{
            const res = await Axios.post("http://localhost:3000/authtoken/return/userinfo", {},{withCredentials:true});
            if(res.data.success){
                srcDispatch({type:"login", value:res.data, admin:res.data.groups.includes("admin")});
                if(!await res.data.groups.includes("project leader")){
                    navigate("/");
                }
            }
        }
        getUserInfo();
    }, [])

    useEffect(()=>{
        getGroups();
    },[srcState.username])

    return ( 
        <>
            <div className="container mx-auto mt-5">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Create application</h1>
                </div>
                <form onSubmit={onSubmit}>
                    <div class="mb-6">
                        <label for="acronym" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Application Acronym</label>
                        <input type="text" onChange={(e)=>setAcronym(e.target.value)} id="acronym" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Application Acronym" required />
                    </div>
                    <div class="mb-6">
                        <label for="rnumber" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Running number</label>
                        <input type="number" id="rnumber" onChange={(e)=>setRnumber(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Running number" required />
                    </div>
                    <div class="mb-6 grid lg:grid-cols-2 gap-4 grid-cols-1">
                        <div>
                            <label for="startdate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start date</label>
                            <input type="date" id="startdate" onChange={(e)=>setStartDate(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div>
                            <label for="enddate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End date</label>
                            <input type="date" id="enddate" onChange={(e)=>setEndDate(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                        </div>
                        <div>
                            <label for="permitOpen" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permit open (group)</label>
                            <select onChange={(e)=>setOpen(e.target.value)}  id="permitOpen" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value=""></option>
                                {groups.map((g, index)=>{
                                    if(g.groupName != "admin"){
                                        return <option key={index} value={g.groupName}>{g.groupName}</option>;
                                    }
                                })}
                            </select>
                        </div>
                        <div>
                            <label for="permitTodo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permit todo (group)</label>
                            <select id="permitTodo" onChange={(e)=>setTodo(e.target.value)}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value=""></option>
                                {groups.map((g, index)=>{
                                        if(g.groupName != "admin"){
                                            return <option key={index} value={g.groupName}>{g.groupName}</option>;
                                        }
                                })}
                            </select>
                        </div>
                        <div>
                            <label for="permitClose" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permit doing (group)</label>
                            <select id="permitClose" onChange={(e)=>setDoing(e.target.value)}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value=""></option>
                                {groups.map((g, index)=>{
                                        if(g.groupName != "admin"){
                                            return <option key={index} value={g.groupName}>{g.groupName}</option>;
                                        }
                                })}
                            </select>
                        </div>
                        <div>
                            <label for="permitDone" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Permit done (group)</label>
                            <select id="permitDone" onChange={(e)=>setDone(e.target.value)}  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                <option value=""></option>
                                {groups.map((g, index)=>{
                                        if(g.groupName != "admin"){
                                            return <option key={index} value={g.groupName}>{g.groupName}</option>;
                                        }
                                })}
                            </select>
                        </div>
                        
                    </div>
                    <div className="mb-6">
                        <label for="desc" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Application description</label>
                        <textarea onChange={(e)=>setDescription(e.target.value)} id="desc" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Application description...."></textarea>

                    </div>



                    <button type="submit" class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800 mr-5">Cancel</button>
                    <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
                </form>
            </div>
        </>
     );
}

export default CreateApp;