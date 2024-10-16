import React, { useState } from 'react';
import {MdAdd, MdDeleteOutline,MdUpdate,MdClose} from "react-icons/md";
import DataSelector from './Input/DataSelector';
import ImageSelector from './Input/ImageSelector';
import TagInput from './Input/TagInput';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage';
import axiosInstance from '../utils/axiosInstance';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
    const[title,setTitle]=React.useState(storyInfo?.title || "");
    const [visitedDate,setVisitedDate]=React.useState(storyInfo?.visitedDate || null);
    const [story,setStory]=React.useState(storyInfo?.story || null);
    const [visitedLocation,setVisitedLocation]=useState(storyInfo?.visitedLocation || []);
    const [storyImg, setStoryImg] = useState(storyInfo?.imageUrl || null);

    const [error,setError]=useState("");

    //add new travel story
    const addNewTravelStory = async () => {
    try {
        let imageUrl = "";

        // Upload image if present
        if (storyImg) {
            const imgUploadRes = await uploadImage(storyImg);
            // Get image URL
            imageUrl = imgUploadRes.imageUrl || ""; // Ensure this matches the response structure
        }

        const response = await axiosInstance.post("/add-travel-story", {
            title,
            story,
            imageUrl: imageUrl || "",
            visitedLocation,
            visitedDate: visitedDate
                ? moment(visitedDate).valueOf()
                : moment().valueOf(),
        });

        if (response.data && response.data.story) {
            toast.success("Story Added Successfully");
            getAllTravelStories();
            onClose(); // Ensure this is correctly spelled (onClose)
        }
    } catch (error) {
        toast.error("Failed to add story. Please try again."); // Handle the error more gracefully
        console.error("Error adding travel story:", error);
    }
};

    //update travel story
    const updateTravelStory=async()=>{}


    const handleAddOrUpdateClick=()=>{
        if(!title)
        {
            setError("Please enter the title");
            return;
        }
        if(!story)
        {
            setError("Please enter the story");
            return;
        }

        setError("");

        if(type==="edit"){
            updateTravelStory();
        }
        else{
            addNewTravelStory();
        }
    };


    //delete story image and update the story
    const handleDeleteStoryImg=async()=>{}

    return (
    <div className='relative'>
        <div className='flex items-center justify-between'>
            <h5 className='text-xl font-medium text-slate-700'>
                {type==="add"? "Add Story" : "Update Story"}
            </h5>

            <div>
                <div className='flex items-center gap-3 bg-cyan-50/50 p-2 rounded-l-lg'>
                    {type==='add' ? (
                    <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdAdd className="text-lg"/>ADD STORY
                    </button>
                    ) :(
                    <>
                    <button className='btn-small' onClick={handleAddOrUpdateClick}>
                        <MdUpdate className="text-lg"/>UPDATE STORY
                    </button>

                    </>)}

                    <button className='' onClick={onClose}>
                        <MdClose className="text-xl text-slate-400"/>
                    </button>
                </div>

                {error &&(
                    <p className='text-red-500 text-xs pt-2 text-right'>{error}</p>
                )}
            </div>
        </div>

        <div>
            <div className='flex-1 flex flex-col gap-2 pt-4'>
                <label htmlFor="input-label">TITLE</label>
                <input type="text" className='text-2xl text-slate-950 outline-none'
                placeholder='A day at The Great Wall' 
                value={title}
                onChange={({target})=>setTitle(target.value)}
                />

                <div className='my-3'>
                    <DataSelector date={visitedDate} setDate={setVisitedDate}/>
                </div>

                <ImageSelector
                image={storyImg}
                setImage={setStoryImg}
                handleDeleteImg={handleDeleteStoryImg}
                />

                <div className='flex flex-col gap-2 mt-4'>
                    <label className='input-label'>STORY</label>
                    <textarea 
                    type="text" 
                    className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded'
                    placeholder='Your Story'
                    rows={10}
                    value={story}
                    onChange={({target})=>setStory(target.value)}/>
                </div>

                <div className='pt-3'>
                    <label className='input-label'>VISITED LOCATION</label>
                        <TagInput tags={visitedLocation} setTags={setVisitedLocation}/>
                </div>
            </div>
        </div>
    </div>
  );
};

export default AddEditTravelStory;