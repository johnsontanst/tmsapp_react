import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom";
import Axios from "axios";

//context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";

function CreatePlan() {

    //react useLocation to get the state and retrieve the app acronym
    const {state} = useLocation();

    //required variables 
    const [planName, setPlanName] = useState();
    const[acronym, setAcronym] = useState();
    const [planStartDate, setPlanStartDate] = useState();
    const [planEndDate, setPlanEndDate] = useState();
    const [planColour, setPlanColour] = useState("#000000");

    //navigate
    const navigate = useNavigate();

    //Navigate to previous page
    async function backPrev(){
      return navigate(-1);
    }

    //handle submit
    async function onSubmit(e){
      e.preventDefault();
      
      //create plan
      try{
        const result = await Axios.post("http://localhost:3000/create-plan", {planName, startDate:planStartDate, endDate:planEndDate, appAcronym:acronym, colour:planColour}, {withCredentials:true});
        console.log(result)
        if(result.data.success){
          //Display message
          srcDispatch({type:"flashMessage", value:"Plan created"});

          //Clear fields
          setPlanName("");
          setPlanStartDate("");
          setPlanEndDate("");
          setPlanColour("#000000");
          document.getElementById("planName").value ="";
          document.getElementById("startdate").value ="";
          document.getElementById("enddate").value ="";
          document.getElementById("planColour").value ="";
          return navigate("/create/plan", {state:{acronym:acronym}});
        }
      }
      catch(err){

        console.log(err)
        if(err.response.data.message === "missing input"){
          srcDispatch({type:"flashMessage", value:"Missing input"});
        }
        else if(err.response.data.message === "invalid end date"){
          srcDispatch({type:"flashMessage", value:"Invalid end date"});
        }
        else if(err.response.data.message === "invalid application"){
          srcDispatch({type:"flashMessage", value:"Invalid application"});
        }
        else if(err.response.data.message === "date invalid"){
          srcDispatch({type:"flashMessage", value:"Plan start and end date must be in application start and end date"});
        }
        else{
          srcDispatch({type:"flashMessage", value:"Create plan error"});
        }

      }
    }

    //check if app exist 
    async function checkApp(){
      if(!state.acronym){
        navigate(-1);
      }
      
      //get app 
      const appResult = await Axios.post("http://localhost:3000/get-application", {acronym:state.acronym},{withCredentials:true});
      if(!appResult.data.success){
        srcDispatch({type:"flashMessage", value:"Invalid app acronym"});
        navigate(-1);
      }else{
        //checkgroup
        const ableToCreatePlan = await Axios.post("http://localhost:3000/cg", {un:srcState.username, gn:appResult.data.apps[0].App_permit_Open})
        if(!ableToCreatePlan.data.cgResult){
          srcDispatch({type:"flashMessage", value:"Not authorized"});
          navigate(-1);
        }
      }
    }

    //context 
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    //useEffect
    useEffect(()=>{

      const getUserInfo = async()=>{
        //Check if state is null
          if(state == null){
            return navigate("/")
          }
          const res = await Axios.post("http://localhost:3000/authtoken/return/userinfo", {},{withCredentials:true});
          if(res.data.success){
              srcDispatch({type:"login", value:res.data, admin:res.data.groups.includes("admin")});
              setAcronym(state.acronym);
              if(!await res.data.groups.includes("project leader")){
                srcDispatch({type:"flashMessage", value:"Not project leader"});
                navigate("/");
              }
          }
      }
      getUserInfo();
    }, [])

    useEffect(()=>{
      if(srcState.username != "nil"){
        checkApp();
      }
    }, [srcState.username]);

  return (
    <>
      <div className="container mx-auto mt-5">
          <div className="mb-4">
              <h1 className="text-xl font-bold">Create plan for Application: {acronym? acronym : null}</h1>
          </div>
          <form onSubmit={onSubmit}>
              <div class="mb-6">
                  <label for="planName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plan name</label>
                  <input type="text" onChange={(e)=>setPlanName(e.target.value)} id="planName" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Application Acronym" required />
              </div>
              <div class="mb-6 grid lg:grid-cols-3 gap-4 grid-cols-1">
                  <div>
                      <label for="startdate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Start date</label>
                      <input type="date" id="startdate" onChange={(e)=>setPlanStartDate(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  </div>
                  <div>
                      <label for="enddate" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">End date</label>
                      <input type="date" id="enddate" onChange={(e)=>setPlanEndDate(e.target.value)} class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required />
                  </div>
                  <div>
                    <label for="planColour" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Plan colour</label>
                    <input type="color" onChange={(e)=>setPlanColour(e.target.value)} id="planColour" className="w-full h-11"required />
                  </div>
                  
              </div>

              <button type="button" onClick={backPrev} class="text-white bg-gray-700 hover:bg-gray-800 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-blue-800 mr-5">Cancel</button>
              <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Submit</button>
          </form>
      </div>
    </>
  )
}

export default CreatePlan