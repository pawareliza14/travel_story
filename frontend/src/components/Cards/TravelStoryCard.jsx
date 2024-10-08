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
      TravelStoryCard
    </div>
  )
}

export default TravelStoryCard