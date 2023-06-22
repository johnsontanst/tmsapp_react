import React, { useEffect, useContext, useReducer, useState } from "react"
import { Link, useNavigate } from "react-router-dom";

//Context
import StateContext from "../../StateContext";
import DispatchContext from "../../DispatchContext";
import Axios from "axios";

function AccountsOverview() {

    const [users, setUsers] = useState([]);

    //context
    const srcState = useContext(StateContext);
    const srcDispatch = useContext(DispatchContext);

    async function getAllUsers(){
        try{
            const res = await Axios.post('http://localhost:3000/allusers', {authTokenC:localStorage.getItem('authToken')})
            if(res.data.success){
                setUsers(res.data.users);
                console.log(res.data.users);
            }
        }
        catch(e){
            console.log(e);
            srcDispatch({type:"flashMessage", value:"Error in getting users"});
        }
    }
    


    useEffect(()=>{
        getAllUsers();

    }, [])
    return (
      <>
        <div>All users</div>

        <div class="flex flex-col">
          <div class="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div class="overflow-hidden">
                <table class="min-w-full text-left text-sm font-light">
                  <thead class="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" class="px-6 py-4">
                        Username
                      </th>
                      <th scope="col" class="px-6 py-4">
                        Email
                      </th>
                      <th scope="col" class="px-6 py-4">
                        Status
                      </th>
                      <th scope="col" class="px-6 py-4">
                        Handle
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr class="border-b dark:border-neutral-500">
                      <td class="whitespace-nowrap px-6 py-4 font-medium">1</td>
                      <td class="whitespace-nowrap px-6 py-4">Mark</td>
                      <td class="whitespace-nowrap px-6 py-4">Otto</td>
                      <td class="whitespace-nowrap px-6 py-4">@mdo</td>
                    </tr>
                    <tr class="border-b dark:border-neutral-500">
                      <td class="whitespace-nowrap px-6 py-4 font-medium">2</td>
                      <td class="whitespace-nowrap px-6 py-4">Jacob</td>
                      <td class="whitespace-nowrap px-6 py-4">Thornton</td>
                      <td class="whitespace-nowrap px-6 py-4">@fat</td>
                    </tr>
                    <tr class="border-b dark:border-neutral-500">
                      <td class="whitespace-nowrap px-6 py-4 font-medium">3</td>
                      <td class="whitespace-nowrap px-6 py-4">Larry</td>
                      <td class="whitespace-nowrap px-6 py-4">Wild</td>
                      <td class="whitespace-nowrap px-6 py-4">@twitter</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div>
          {users.map((user) => (
            <p>{user.username}</p>
          ))}
        </div>
      </>
    );
}

export default AccountsOverview;