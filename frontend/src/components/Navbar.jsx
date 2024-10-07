import React from 'react'
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/images/travel-icon.png';
import ProfileInfo from './Cards/ProfileInfo';

const Navbar = ({ userInfo }) => {  // Pass userInfo as a prop if needed

  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");  // Corrected to use navigate instead of NavigationPreloadManager
  }

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      <img src={LOGO} alt='travel story' className='h-9'/>

      {isToken && <ProfileInfo userInfo={userInfo} onLogout={onLogout} />}
    </div>
  )
}

export default Navbar;
