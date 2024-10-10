import React from 'react'
import { FaHeart } from 'react-icons/fa';
import { GrMapLocation } from 'react-icons/gr';
const TravelStoryCard = ({imgUrl,
  title,
  date,
  story,
  visitedLocation,
  isFavourite,
  onFavouriteClick,
  onClick,}) => {
  return (
    <div className='border rounded-lg overflow-hidden bg-white hover:shadow-lg hover:shadow-slate-200 transition-all ease-in-out relative cursor-pointer'>
      <img src={imgUrl} 
      alt={title} 
      className='w-full h-56 object-cover rounded-lg'
      onClick={onClick}/>

      <div className='p-4' onClick={onClick}>
        <div className='flex item-center gap-3'>
          <div className='flex-1'>
            <h6 className='text-sm font-medium'>{title}</h6>
            {/* <span className='text-xs text-slate-500'>
              {date ? moment(date).format("DD MM YYYY"): "-"}
            </span> */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TravelStoryCard
