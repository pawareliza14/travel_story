import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get('/get-user');
      if (response.data?.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate('/login');
      }
    }
  };

  // Get all travel stories
  const getAllTravelStories = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/get-all-stories');
      if (response.data?.stories) {
        setAllStories(response.data.stories);
      } else {
        setAllStories([]);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle edit story click
  const handleEdit = (data) => {
    // Edit logic here
  };

  // Handle travel story click
  const handleViewStory = (data) => {
    // View story logic here
  };

  // Handle update favourite
  const updateIsFavourite = async (storyData) => {
    // Update favourite logic here
  };

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  return (
    <div>
      <Navbar userInfo={userInfo} />
      <div className='container mx-auto py-10'>
        <div className='flex gap-7'>
          <div className='flex-1'>
            {loading ? (
              <p>Loading...</p>
            ) : error ? (
              <p>{error}</p>
            ) : allStories.length > 0 ? (
              <div className='grid grid-cols-2 gap-4'>
                {allStories.map((item) => (
                  <TravelStoryCard
                    key={item._id}
                    imgUrl={item.imageUrl}
                    title={item.title}
                    story={item.story}
                    date={item.visitedDate}
                    visitedLocation={item.visitedLocation}
                    isFavourite={item.isFavourite}
                    onEdit={() => handleEdit(item)}
                    onClick={() => handleViewStory(item)}
                    onFavouriteClick={() => updateIsFavourite(item)}
                  />
                ))}
              </div>
            ) : (
              <div className='empty-state'>
                <p>No stories available. Start by adding your first travel story!</p>
              </div>
            )}
          </div>
          <div className='w-[320px]'></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
