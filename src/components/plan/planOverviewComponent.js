import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";



function PlanOverview() {
    //useLocation to get the acronym from the Link button
    const {state} = useLocation();

    //navigate
    const navigate = useNavigate();

    //useState fields
    const [acronym, setAcronym] = useState();
    const [startDate, setStartDate] = useState("NULL");
    const [endDate, setEndDate] = useState("NULL");
    const [planColour, setPlanColour] = useState("");
    const [appStartDate, setAppStartDate] = useState();
    const [appEndDate, setAppEndDate] = useState();
    const [open, setOpen] = useState([]);
    const [todo, setTodo] = useState([]);
    const [doing, setDoing] = useState([]);
    const [done, setDone] = useState([]);
    const [closed, setClosed] = useState([]);
    const [plan, setPlan] = useState([]);

    //authorization for tasks
    const [aCreate, setACreate] = useState(false);
    const [aOpen, setAOpen] = useState(false);
    const [aTodo, setATodo] = useState(false);
    const [aDoing, setADoing] = useState(false);
    const [aDone, setADone] = useState(false);

    //handle plan start and end date (display)
    async function displaySEdate(startDate, endDate, planColour){
        var tempStartDate = new Date(startDate).toISOString().substr(0,10);
        var tempEndDate = new Date(endDate).toISOString().substr(0,10);
        setStartDate(tempStartDate);
        setEndDate(tempEndDate);
        setPlanColour(planColour);
    }

    //get application, plan and task
    async function getApp(){
        //check state acronym 
        if(!state.acronym){
            srcDispatch({type:"flashMessage", value:"Invalid acronym"});
            navigate(-1);
        }

        //check roles

        //Axios get app
        const appResult = await Axios.post("http://localhost:3000/get-application", {acronym:state.acronym}, {withCredentials:true})
        if(appResult.data.success){
            setAppStartDate(new Date(appResult.data.apps[0].App_startDate).toISOString().substr(0,10));
            setAppEndDate(new Date(appResult.data.apps[0].App_endDate).toISOString().substr(0,10));
            setAcronym(appResult.data.apps[0].App_Acronym);

        }

        //Axios get plan by app acronym
        const planResult = await Axios.post("http://localhost:3000/all-plan/app", {app_Acronym:state.acronym}, {withCredentials:true});
        //console.log(planResult)
        if(planResult.data.success){
            setPlan(planResult.data.plans);
        }


        //Axios get task by app acronym
        const taskResult = await Axios.post("http://localhost:3000/all-task/app", {app_Acronym:state.acronym}, {withCredentials:true});
        if(taskResult.data.success){
            console.log(taskResult.data.tasks);
            //re-arrange tasks into different state
            for(const k in taskResult.data.tasks){
                if(taskResult.data.tasks[k].Task_state === "open"){
                    //Get the colour of the task based on the plan and append to the array 
                    if(taskResult.data.tasks[k].Task_plan){
                        const taskPlanColour = await Axios.post("http://localhost:3000/get-plan/planname", {planName:taskResult.data.tasks[k].Task_plan}, {withCredentials:true});
                        if(taskPlanColour.data.success){
                            taskResult.data.tasks[k]['colour'] = taskPlanColour.data.plan[0].colour;
                            setOpen(setOpen => [...setOpen,  taskResult.data.tasks[k]]);
                        }else{
                            setOpen(setOpen => [...setOpen,  taskResult.data.tasks[k]]);
                        }
                    }
                    else{
                        setOpen(setOpen => [...setOpen, taskResult.data.tasks[k]]);
                    }
                }
                else if(taskResult.data.tasks[k].Task_state === "todo"){

                    //Get the colour of the task based on the plan and append to the array 
                    if(taskResult.data.tasks[k].Task_plan){
                        const taskPlanColour = await Axios.post("http://localhost:3000/get-plan/planname", {planName:taskResult.data.tasks[k].Task_plan}, {withCredentials:true});
                        if(taskPlanColour.data.success){
                            taskResult.data.tasks[k]['colour'] = taskPlanColour.data.plan[0].colour;
                            setTodo(setTodo => [...setTodo,  taskResult.data.tasks[k]]);
                        }else{
                            setTodo(setTodo => [...setTodo,  taskResult.data.tasks[k]]);
                        }
                    }
                    else{
                        setTodo(setTodo => [...setTodo, taskResult.data.tasks[k]]);
                    }

                }
                else if(taskResult.data.tasks[k].Task_state === "doing"){

                    //Get the colour of the task based on the plan and append to the array 
                    if(taskResult.data.tasks[k].Task_plan){
                        const taskPlanColour = await Axios.post("http://localhost:3000/get-plan/planname", {planName:taskResult.data.tasks[k].Task_plan}, {withCredentials:true});
                        if(taskPlanColour.data.success){
                            taskResult.data.tasks[k]['colour'] = taskPlanColour.data.plan[0].colour;
                            setDoing(setDoing => [...setDoing, taskResult.data.tasks[k]]);
                        }else{
                            console.log("enetered else")
                            setDoing(setDoing => [...setDoing, taskResult.data.tasks[k]]);
                        }
                    }
                    else{
                        console.log("teem")
                        setDoing(setDoing => [...setDoing, taskResult.data.tasks[k]]);
                    }

                }
                else if(taskResult.data.tasks[k].Task_state === "done"){

                    //Get the colour of the task based on the plan and append to the array 
                    if(taskResult.data.tasks[k].Task_plan){
                        const taskPlanColour = await Axios.post("http://localhost:3000/get-plan/planname", {planName:taskResult.data.tasks[k].Task_plan}, {withCredentials:true});
                        if(taskPlanColour.data.success){
                            taskResult.data.tasks[k]['colour'] = taskPlanColour.data.plan[0].colour;
                            setDone(setDone => [...setDone,  taskResult.data.tasks[k]]);
                        }else{
                            setDone(setDone => [...setDone,  taskResult.data.tasks[k]]);
                        }
                    }
                    else{
                        setDone(setDone => [...setDone, taskResult.data.tasks[k]]);
                    }

                }
                else if(taskResult.data.tasks[k].Task_state === "closed"){

                    //Get the colour of the task based on the plan and append to the array 
                    if(taskResult.data.tasks[k].Task_plan){
                        const taskPlanColour = await Axios.post("http://localhost:3000/get-plan/planname", {planName:taskResult.data.tasks[k].Task_plan}, {withCredentials:true});
                        if(taskPlanColour.data.success){
                            taskResult.data.tasks[k]['colour'] = taskPlanColour.data.plan[0].colour;
                            setClosed(setClosed => [...setClosed,  taskResult.data.tasks[k]]);
                        }else{
                            setClosed(setClosed => [...setClosed,  taskResult.data.tasks[k]]);
                        }
                    }
                    else{
                        setClosed(setClosed => [...setClosed, taskResult.data.tasks[k]]);
                    }

                }
            }
        }
        
    }

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    //useEffect
    useEffect(()=>{
        console.log(state.acronym)
        const getUserInfo = async()=>{
            const res = await Axios.post("http://localhost:3000/authtoken/return/userinfo", {},{withCredentials:true});
            if(res.data.success){
                srcDispatch({type:"login", value:res.data, admin:res.data.groups.includes("admin")});
                if(!await res.data.groups.includes("project leader")){
                    navigate("/");
                }

                //Implement the authroization 
                
            }
        }
        getUserInfo();
    }, [])

    useEffect(()=>{
        getApp();
    },[state.acronym])

    return ( 
        <>
            <div className="m-8">
                <div className="flex justify-between mb-7">
                    <div>
                        <h1 className="text-3xl mb-5">Application: {acronym}</h1>
                        <span className="text-md mt-1">Start date: {appStartDate}</span><br/>
                        <span className="text-md mt-1">End date: {appEndDate}</span>
                    </div>
                    <div className="grid grid-cols-3">
                        <div className="mr-4">
                            <p>Plan start date: {startDate}</p>
                            <p>Plan end date: {endDate}</p>
                            <p className="flex">Plan colour: &nbsp;<div className="w-5 h-5" style={{background:planColour}}></div></p>
                        </div>
                        <div>
                            <div className="overflow-y-auto">
                                <select multiple={true} className="flex w-32">
                                    {plan.map((pl, index)=>(
                                        <option key={index} style={{background:pl.colour}} className="text-white" onClick={() => displaySEdate(pl.Plan_startDate, pl.Plan_endDate, pl.colour)}>{pl.Plan_MVP_name}</option>
                                    ))}                                 
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-rows-2 gap-3">
                            <Link to={"/create/plan"} type="button" className="bg-blue-500 text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" state={{acronym:state.acronym}}>Create plan</Link>
                            <Link to={"/create/task"} state={{acronym:state.acronym}} type="button" className="bg-blue-500 text-center hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">Create Task</Link>
                        </div>
                    </div>
                </div>

                
                <div className="grid lg:grid-cols-5 gap-4 grid-cols-2">
                    <div className="">
                        <h1 className="text-lg font-bold bg-sky-200 text-center">OPEN</h1>
                        

                        {open.map((task, index)=>(
                            <div class="max-w-sm overflow-hidden shadow-lg mt-5 border">
                                <div className="w-full h-8" style={{background:task.colour}}></div>
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">{task.Task_name}</div>
                                    <p class="text-gray-700 text-base">
                                        ID: {task.Task_id}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Owner: {task.Task_owner}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Creator: {task.Task_creator}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Created at: {new Date(task.Task_createDate).toISOString().substr(0,10)}
                                    </p>

                                </div>
                                <div class="px-6 pt-4 pb-2">
                                    <div className="flex justify-between">
                                        <Link type="button" to={""} className=""><div class="w-5 overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black -rotate-45 transform origin-top-right"></div>
                                        </div></Link>

                                        <Link type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10 text-center" to={"/pm-update/task"} state={{taskId:task.Task_id, acronym:state.acronym}}>Edit</Link>

                                        <Link type="button" to={""} ><div class="w-5  overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black rotate-45 transform origin-top-left"></div>
                                        </div></Link>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}


                    </div>

                    <div className="">
                        <h1 className="text-lg font-bold bg-sky-300 text-center">TODO</h1>

                        {todo.map((task, index)=>(
                            <div class="max-w-sm overflow-hidden shadow-lg mt-5 border">
                                <div className="w-full h-8" style={{background:task.colour}}></div>
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">{task.Task_name}</div>
                                    <p class="text-gray-700 text-base">
                                        ID: {task.Task_id}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Owner: {task.Task_owner}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Creator: {task.Task_creator}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Created at: {new Date(task.Task_createDate).toISOString().substr(0,10)}
                                    </p>

                                </div>
                                <div class="px-6 pt-4 pb-2">
                                    <div className="flex justify-between">
                                        <Link type="button" to={""} className=""><div class="w-5 overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black -rotate-45 transform origin-top-right"></div>
                                        </div></Link>

                                        <Link type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10 text-center" to={"/team-update/task"} state={{taskId:task.Task_id, acronym:state.acronym}} >Edit</Link>

                                        <Link type="button" to={""} ><div class="w-5  overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black rotate-45 transform origin-top-left"></div>
                                        </div></Link>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}



                    </div>

                    <div className="">
                        <h1 className="text-lg font-bold bg-sky-200 text-center">DOING</h1>
                        
                        {doing.map((task, index)=>(
                            <div class="max-w-sm overflow-hidden shadow-lg mt-5 border">
                                <div className="w-full h-8" style={{background:task.colour}}></div>
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">{task.Task_name}</div>
                                    <p class="text-gray-700 text-base">
                                        ID: {task.Task_id}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Owner: {task.Task_owner}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Creator: {task.Task_creator}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Created at: {new Date(task.Task_createDate).toISOString().substr(0,10)}
                                    </p>

                                </div>
                                <div class="px-6 pt-4 pb-2">
                                    <div className="flex justify-between">
                                        <Link type="button" to={""} className=""><div class="w-5 overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black -rotate-45 transform origin-top-right"></div>
                                        </div></Link>

                                        <Link type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10 text-center" to={"/team-update/task"} state={{taskId:task.Task_id, acronym:state.acronym}} >Edit</Link>

                                        <Link type="button" to={""} ><div class="w-5  overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black rotate-45 transform origin-top-left"></div>
                                        </div></Link>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}

                    </div>

                    <div className="">
                        <h1 className="text-lg font-bold bg-sky-300 text-center">DONE</h1>

                        {done.map((task, index)=>(
                            <div class="max-w-sm overflow-hidden shadow-lg mt-5 border">
                                <div className="w-full h-8" style={{background:task.colour}}></div>
                                <div class="px-6 py-4">
                                    <div class="font-bold text-xl mb-2">{task.Task_name}</div>
                                    <p class="text-gray-700 text-base">
                                        ID: {task.Task_id}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Owner: {task.Task_owner}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Creator: {task.Task_creator}
                                    </p>
                                    <p class="text-gray-700 text-base">
                                        Created at: {new Date(task.Task_createDate).toISOString().substr(0,10)}
                                    </p>

                                </div>
                                <div class="px-6 pt-4 pb-2">
                                    <div className="flex justify-between">
                                        <Link type="button" to={""} className=""><div class="w-5 overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black -rotate-45 transform origin-top-right"></div>
                                        </div></Link>

                                        <Link type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10 text-center" to={"/pl-update/task"} state={{taskId:task.Task_id, acronym:state.acronym}} >Edit</Link>

                                        <Link type="button" to={""} ><div class="w-5  overflow-hidden inline-block">
                                        <div class=" h-10 hover:bg-slate-500 bg-black rotate-45 transform origin-top-left"></div>
                                        </div></Link>
                                    </div>
                                    
                                </div>
                            </div>
                        ))}


                    </div>

                    <div className="">
                        <h1 className="text-lg font-bold bg-sky-200 text-center">CLOSED</h1>

                        {closed.map((task, index)=>(
                                <div class="max-w-sm overflow-hidden shadow-lg mt-5 border">
                                    <div className="w-full h-8" style={{background:task.colour}}></div>
                                    <div class="px-6 py-4">
                                        <div class="font-bold text-xl mb-2">{task.Task_name}</div>
                                        <p class="text-gray-700 text-base">
                                            ID: {task.Task_id}
                                        </p>
                                        <p class="text-gray-700 text-base">
                                            Owner: {task.Task_owner}
                                        </p>
                                        <p class="text-gray-700 text-base">
                                            Creator: {task.Task_creator}
                                        </p>
                                        <p class="text-gray-700 text-base">
                                            Created at: {new Date(task.Task_createDate).toISOString().substr(0,10)}
                                        </p>

                                    </div>
                                    <div class="px-6 pt-4 pb-2">
                                        <div className="flex justify-between">
                                            <Link type="button" to={""} className=""><div class="w-5 overflow-hidden inline-block">
                                            <div class=" h-10 hover:bg-slate-500 bg-black -rotate-45 transform origin-top-right"></div>
                                            </div></Link>

                                            <Link type="button" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full h-10 text-center" to={"/pl-update/task"} state={{taskId:task.Task_id, acronym:state.acronym}} >Edit</Link>

                                            <Link type="button" to={""} ><div class="w-5  overflow-hidden inline-block">
                                            <div class=" h-10 hover:bg-slate-500 bg-black rotate-45 transform origin-top-left"></div>
                                            </div></Link>
                                        </div>
                                        
                                    </div>
                                </div>
                            ))}

                    </div>

                </div>
            </div>
            
        </>
     );
}

export default PlanOverview;