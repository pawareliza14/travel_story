import React, { useState } from 'react';
import {MdAdd, MdDeleteOutline,MdUpdate,MdClose} from "react-icons/md";
import DataSelector from './Input/DataSelector';
import ImageSelector from './Input/ImageSelector';
import TagInput from './Input/TagInput';
import moment from 'moment';
import { toast } from 'react-toastify';
import uploadImage from '../utils/uploadImage';
import axiosInstance from '../utils/axiosInstance';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => 
{
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
    const updateTravelStory = async () => {
    try {
        let imageUrl = "";

        // Prepare the initial post data
        let postData = {
            title,
            story,
            imageUrl: storyImg.imageUrl || "",
            visitedLocation,
            visitedDate: visitedDate ? moment(visitedDate).valueOf() : moment().valueOf(),
        };

        // Check if storyImg is an object (indicating a new image upload)
        if (typeof storyImg === "object") {
            const imgUploadRes = await uploadImage(storyImg);
            imageUrl = imgUploadRes.imageUrl || "";

            // Update postData with the new imageUrl
            postData = {
                ...postData,
                imageUrl, // Use the new imageUrl
            };
        }

        const response = await axiosInstance.post(`/edit-story/${storyInfo._id}`, postData);

        if (response.data?.story) {
            toast.success("Story Updated Successfully");

            // Refresh Stories
            getAllTravelStories();
            // Close modal or form
            onClose();
        }
    } catch (error) {
        // Improved error handling
        if (error.response) {
            toast.error(error.response.data?.message || "Failed to update story. Please try again.");
            console.error("Error updating travel story:", error.response.data);
        } else {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Error updating travel story:", error);
        }
    }
};



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
   const handleDeleteStoryImg = async () => {
    try {
        console.log("Attempting to delete image:", storyInfo.imageUrl);
        const deleteImgRes = await axiosInstance.delete("/delete-image", {
            params: { imageUrl: storyInfo.imageUrl },
        });

        console.log("Delete image response:", deleteImgRes.data);

        // Check if the deletion was successful
        if (deleteImgRes.status === 200) { // Adjusted to check for HTTP status
            const storyId = storyInfo._id;

            const updatedStoryData = {
                title,
                story,
                visitedLocation,
                visitedDate: Date.now(),
                imageUrl: "",
            };

            console.log("Updating story with data:", updatedStoryData);
            const response = await axiosInstance.post(`/edit-story/${storyId}`, updatedStoryData);
            if (response.data?.story) {
                setStoryImg(null);
                toast.success("Image deleted and story updated successfully.");
            } else {
                toast.error("Failed to update the story after image deletion.");
                console.error("Update response:", response.data);
            }
        } else {
            toast.error("Failed to delete the image. Unexpected response.");
            console.error("Unexpected delete response:", deleteImgRes);
        }
    } catch (error) {
        if (error.response) {
            toast.error(error.response.data?.message || "Failed to delete the image. Please try again.");
            console.error("Error deleting image:", error.response.data);
        } else {
            toast.error("An unexpected error occurred. Please try again.");
            console.error("Error deleting image:", error);
        }
    }
};



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