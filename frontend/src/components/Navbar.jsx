import React from 'react'
import { useNavigate } from 'react-router-dom';
import LOGO from '../assets/images/travel-icon.png';
import ProfileInfo from './Cards/ProfileInfo.jsx';
import SearchBar from './Input/SearchBar.jsx';


const Navbar = ({ userInfo,
  searchQuery,
  setSearchQuery,
  onSearchNote,
  handleClearSearch
}) => {  // Pass userInfo as a prop if needed

  const isToken = localStorage.getItem("token");
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");  // Corrected to use navigate instead of NavigationPreloadManager
  }

  const handleSearch=()=>{
    if(searchQuery)
    {
      onSearchNote(searchQuery);
    }
  };

  const onClearSearch=()=>{
    handleClearSearch();
    setSearchQuery("");
  };

  return (
    <div className='bg-white flex items-center justify-between px-6 py-2 drop-shadow sticky top-0 z-10'>
      <img src={LOGO} alt='travel story' className='h-9'/>

      {isToken && (
        <> 
          <SearchBar
            value={searchQuery}
            onChange={({target})=>{
              setSearchQuery(target.value);
            }}
            handleSearch={handleSearch}
            onClearSearch={onClearSearch}
            />
          <ProfileInfo userInfo={userInfo} onLogout={onLogout} /> {" "}
          </>
          )}
    </div>
  )
}

export default Navbar;