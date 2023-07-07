import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

//Import components
import Modal from "../global/modelComponent";

function AppOverview() {
    //navigate
    const navigate = useNavigate();

    //useState fields
    const [applications, setApps] = useState([]);

    //Get application
    async function getApplication(){
        try{
            const appResult = await Axios.post('http://localhost:3000/all-application', {}, {withCredentials:true});
            if(appResult.data.success){
                setApps(appResult.data.apps);
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
        getApplication();
    },[srcState.username])

    return ( 
        <>
            <div className="container mx-auto mt-5">
                <div className="mb-4">
                    <h1 className="text-xl font-bold">Applications</h1>
                </div>
                <div className="flex flex-col">
                    <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b font-medium dark:border-neutral-500">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">
                                        App_Acronym
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Description
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Running number
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Start date
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        End date
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Permit open group
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Permit todo group
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Permit doing group
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Permit done group
                                        </th>
                                        <th scope="col" className="px-6 py-4">
                                        Actions
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app, index) => (
                                            <tr key={index} className="border-b dark:border-neutral-500">
                                            <td  className="whitespace-nowrap px-6 py-4 font-medium">{app.App_Acronym}</td>
                                            <td  className="whitespace-nowrap px-6 py-4">
                                                <Modal description={app.App_Description} index={index} appName={app.App_Acronym}/>
                                            </td>
                                            <td  className="whitespace-nowrap px-6 py-4">{app.App_Rnumber}</td>
                                            <td  className="whitespace-nowrap px-6 py-4">{new Date(app.App_startDate).toISOString().substr(0, 10)}</td>

                                            <td  className="whitespace-nowrap px-6 py-4">{new Date(app.App_endDate).toISOString().substr(0, 10)}</td>

                                            <td  className="whitespace-nowrap px-6 py-4">{app.App_permit_Open ? <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{app.App_permit_Open}</span> : null}</td>

                                            <td  className="whitespace-nowrap px-6 py-4">{app.App_permit_toDoList ? <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{app.App_permit_toDoList}</span> : null}</td>

                                            <td  className="whitespace-nowrap px-6 py-4">{app.App_permit_Doing ? <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{app.App_permit_Doing}</span> : null}</td>

                                            <td  className="whitespace-nowrap px-6 py-4">{app.App_permit_Done ? <span class="bg-gray-100 text-gray-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-gray-300">{app.App_permit_Done}</span> : null}</td>

                                            <td  className="whitespace-nowrap px-6 py-4"><Link type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" to={"/edit-application"} state={{ acronym: app.App_Acronym }}>Edit</Link>

                                            <Link type="button" class="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-full text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700" to={"/plan-management"} state={{acronym:app.App_Acronym}}>View plans</Link></td>
                                            
                                            
                                            </tr>
                                            
                                        ))}
                                        
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
     );
}

export default AppOverview;