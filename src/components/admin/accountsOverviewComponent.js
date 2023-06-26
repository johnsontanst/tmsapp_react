import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

//Context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";

import CreateGroup from "./createGroupComponent";

function AccountsOverview() {

    const [users, setUsers] = useState([]);
    const [groups, setGroups] = useState([]);

    //context
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);
    const navigate = useNavigate();
    
    async function getAllUsers(){
        try{
            const res = await Axios.post('http://localhost:3000/allusers', {authTokenC:localStorage.getItem('authToken')}, {withCredentials: true})
            if(res.data.success){
                setUsers(res.data.users);
                setGroups(res.data.groups);
            }
        }
        catch(err){
          console.log(err);
          srcDispatch({type:"flashMessage", value:"Not"});
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
              else {
                getAllUsers();
              }
          }
      }
      getUserInfo();
    }, [])

    return (
      <>
        <div className="m-3 text-lg font-black">All users</div>
        <CreateGroup />
        
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">
                        Username
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Group/s
                      </th>
                      <th scope="col" className="px-6 py-4">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user, index) => (
                       <tr key={index} className="border-b dark:border-neutral-500">
                        <td  className="whitespace-nowrap px-6 py-4 font-medium">{user.username}</td>
                        <td  className="whitespace-nowrap px-6 py-4">{user.email}</td>
                        <td  className="whitespace-nowrap px-6 py-4">{user.status == 1 ? `active` : `disabled`}</td>
                        <td  className="whitespace-nowrap px-6 py-4">{groups.map((group)=>(
                          user.username === group.fk_username ? group.fk_groupName + " " : ""
                        ))}</td>
                        <td  className="whitespace-nowrap px-6 py-4"><Link to={"/admin/user/profile"} state={{ username: user.username }}>Edit user</Link></td>
                       </tr>
                    ))}
                        
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <br></br>
        <br></br>
        <br></br>
        <br></br>

      </>
    );
}

export default AccountsOverview;