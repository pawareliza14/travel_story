import React, { useInsertionEffect } from 'react'

const ProfileInfo = ({userInfo}) => {
  return (
    userInfo && <div className='flex items-center gap-3'>
        <div className='w-12 h-12 flex item-center justify-center rounded-full text-slate-950 font-medium bg-state-100'>
            {getInitials(userInfo ? userInfo.fullName:"")}
        </div>
      
        <div>
            <p className='text-sm font-medium'>{userInfo.fullName || ""}</p>
            <button className='text-sm text-slate-700 underline' onClick={onLogout}>
                Logout
            </button>
        </div>
    </div>
  )
}

export default ProfileInfo
