import React from 'react';

// Function to get initials from full name
const getInitials = (fullName) => {
    const names = fullName.split(' ');
    if (names.length > 1) {
        return names[0][0] + names[1][0]; // First letter of first and last name
    }
    return names[0][0]; // Just the first letter if only one name
};

const ProfileInfo = ({ userInfo, onLogout }) => {
  return (
    <div className='flex items-center gap-3'>
      {userInfo && (
        <>
          <div className='w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-state-100'>
            {getInitials(userInfo.fullName || "")}
          </div>
          
          <div>
            <p className='text-sm font-medium'>{userInfo.fullName || ""}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>
              Logout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileInfo;
