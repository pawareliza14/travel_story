import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../../utils/axiosInstance";
import { useState } from 'react';
const Home = () => {
  const navigate =useNavigate()

  const [userInfo, setUserInfo] = useState(null)
  const [allStories,setAllStories]=useState([]);
  //get user info
  const getUserInfo= async()=>{
    try{

      const response=await axiosInstance.get("/get-user");

      if(response.data && response.data.user)
      {
        //set user info if data exists
        setUserInfo(response.data.user);
      }

    }catch(error){
      if(error.response.status===401){
        //clear storage if unauthorized
        localStorage.clear();
        navigate("/login");   //redirect to login
      }
    }
  };

  //Get all travel stories
  const getAllTravelStories=async()=>{
    try {
      const response=await axiosInstance.get("/get-all-strories");
      if(response.data && response.data.stories)
      {
        setAllStories(response.data.stories);
      }
    } catch (error) {
      console.log("An unexpected error occurred.Please try again.")
    }
  }
  useEffect(()=>{
    getAllTravelStories();
    getUserInfo();
    return()=>{};
  },[]);

  return (
    <div>
      <Navbar userInfo={userInfo}/>

      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
          <div className='flex-1'>
            {allStories.lenght>0 ? (
                <div className='grid grid-cols-2 gap-4'>
                  {allStories.map((item)=>
                  {
                    return (
                      <TravelStoryCard
                      key={item._id}
                      />
                    );
                  })}
                </div>
              ) : (
                <>Empty card here</>
              )}
            </div>
            <div className='w-[320px]'></div>
        </div>
      </div>
    </div>
  );
};

export default Home
