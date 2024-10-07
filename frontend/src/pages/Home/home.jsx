import React from 'react'
import Navbar from '../../components/Input/Navbar'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  const navigate =useNavigate()

  const [userInfo, setUserInfo] = useState(null)

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

  return (
    <div>
      <Navbar/>
    </div>
  )
}

export default Home
