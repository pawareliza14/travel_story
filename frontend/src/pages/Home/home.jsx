import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { MdAdd } from 'react-icons/md';
import TravelStoryCard from '../../components/Cards/TravelStoryCard';
import Modal from 'react-modal';
import ViewTravelStory from './ViewTravelStory';
import AddEditTravelStory from '../../components/AddEditTravelStory'; 
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EmptyCard from '../../components/Cards/EmptyCard';

import { DayPicker } from 'react-day-picker';
import moment from 'moment';
import FilterinfoTitle from '../../components/Cards/FilterinfoTitle';
import { getEmptyCardImg,getEmptyCardMessage } from '../../utils/helper';

Modal.setAppElement('#root');

const Home = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [allStories, setAllStories] = useState([]);

  const [searchQuery,setsearchQuery]=useState('');

  const [filterType,setFilterType]=useState('');
  const [dateRange, setDateRange]=useState({form:null, to:null});

  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });

  const [openViewModal, setOpenViewModal] = useState({
    isShow: false,
    type: "view",
    data: null,
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
    setOpenAddEditModal({ isShow: true, type: "edit", data:data });
  };

  // Handle travel story click
  const handleViewStory = (data) => {
    setOpenViewModal({ isShow: true, type: "view", data:data });
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
        toast.success("Story Updated Successfully!");

        if (filterType ==="search" && searchQuery)
        {
          onSearchStory(searchQuery);
        }
        else if(filterType==="date")
        {
          filterStoriesByDate(dateRange);
        }
        else{
          getAllTravelStories();
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  //Delete story
  const deleteTravelStory = async (data) => {
    const storyId = data._id;

    try{
      const response = await axiosInstance.delete("/delete-story/" + storyId);

      if(response.data && !response.data.error){
        toast.error("Story Deleted Successfully");
        setOpenViewModal((prevState) => ({
          ...prevState, isShown: false 
        }));
        getAllTravelStories();
      }
    } catch(error){
      //Handle unexpected errors
      console.log("An unexpected error occured. Please try again.");
    }
  };


  //search story
  const onSearchStory=async (query) =>{
    try{
      const response = await axiosInstance.get("/search" ,{
        params:{
          query,
        },
      });

      if(response.data && response.data.stories)
      {
        setFilterType("search");
        setAllStories(response.data.stories);
      }
    } catch(error){
      //Handle unexpected errors
      console.log("An unexpected error occured. Please try again.");
    }
  }

  useEffect(() => {
    getAllTravelStories();
    getUserInfo();
  }, []);

  const handleClearSearch=()=>{
    setFilterType('');
    getAllTravelStories();
  }

   //Handle filter travel story by date range
   const filterStoriesByDate = async (day)=>{ 
    try{
      const startDate=day.from ? moment(day.from).valueOf() :null;
      const endDate=day.to ? moment(day.to).valueOf():null;

      if(startDate && endDate)
      {
        const response =await axiosInstance.get("/travel-stories/filter",{
          params:{startDate,endDate},
        });

        if(response.data && response.data.stories)
        {
          setFilterType("date");
          setAllStories(response.data.stories);
        }
      }
    }catch(error)
    {
      console.log("An unexpected error occured. Please try again.");

    }
    
   }; 

  //Handle date range select
  const handleDayClick= (day)=>{
    setDateRange(day);
    filterStoriesByDate(day);
  }

  const resetFilter=()=>{
    setDateRange({from:null,to:null});
    setFilterType("");
    getAllTravelStories();
  };

  return (
    <div>
      
      <Navbar 
      userInfo={userInfo} 
      searchQuery={searchQuery} 
      setSearchQuery={setsearchQuery}
      onSearchNote={onSearchStory}
      handleClearSearch={handleClearSearch}
      />

      <div className='container mx-auto py-10'>

      <FilterinfoTitle
      filterType={filterType}
      filterDates={dateRange}
      onClear={()=>{
        resetFilter();
      }}
      />

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
              <EmptyCard imgSrc={getEmptyCardImg(filterType)}
              message={getEmptyCardMessage(filterType)}
              /> 
            )}
          </div>

          <div className='w-[350px]'>
            <div className='bg-white border border-slate-200 shadow-lg shadow-slate-200/60 rounded-lg'>
              <div className='p-3'>
                <DayPicker
                  captionLayout='dropdown-buttons'
                  mode='range'
                  selected={dateRange}
                  onSelect={handleDayClick}
                  pagedNavigation
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add & Edit Travel Story Modal  */}
      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => setOpenAddEditModal({ isShow: false, type: "add", data: null })}
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
      
      {/* View Travel Story Modal  */}
      <Modal
        isOpen={openViewModal.isShow}
        onRequestClose={() => setOpenViewModal({ isShow: false, type: "view", data: null })}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
            zIndex: 999
          },
        }}
        appElement={document.getElementById("root")}
        className="model-box">
        <ViewTravelStory storyInfo={openViewModal.data || null} 
        onClose={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShow:false}));
        }} 
        onEditClick={()=>{
          setOpenViewModal((prevState)=>({...prevState,isShow:false}));
          handleEdit(openViewModal.data || null)
        }} 
        onDeleteClick={()=>{
          deleteTravelStory(openViewModal.data || null);
        }}/>
      </Modal>

      <button 
        className='w-16 h-16 flex items-center justify-center rounded-full bg-primary hover:bg-cyan-400 fixed right-10 bottom-10'
        onClick={() => {
          setOpenAddEditModal({ isShow: true, type: "add", data: null });
        }}>
        <MdAdd className="text-[32px] text-white" />
      </button>
      <ToastContainer />
    </div>
  );
}

export default Home;
