import React, { useDebugValue, useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import Modal from 'react-modal';
Modal.setAppElement('#root');
import AddEditTravelStory from '../../components/AddEditTravelStory'; 

import { ToastContainer,toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [openAddEditModal,setOpenAddEditModal]=useState({
    isShow:false,
    type:"add",
    data:null,
  });

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
    const storyId = storyData._id;

    try {
      const response = await axiosInstance.put(
        "/update-isFavourite/" + storyId,
        {
          isFavourite: !storyData.isFavourite,
        }
      );

      if (response.data && response.data.story) {
        toast.success("Story Updated Successfully!")
        getAllTravelStories();
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
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

 
      {/* Add & edit travel story modal  */}
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box">
        <AddEditTravelStory
          type={openAddEditModal.type}
          storyInfo={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShow: false, type: "add", data: null });
          }} 
          getAllTravelStories={getAllTravelStories}
        />
      </Modal>
      


      <button className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10'
      onClick={()=>{
        setOpenAddEditModal({isShow: true,type:"add",data:null});
      }}>
        <MdAdd className="text-[32px] text-white"/>
      </button>
      <ToastContainer/>

    </div>
  );
};

export default Home;