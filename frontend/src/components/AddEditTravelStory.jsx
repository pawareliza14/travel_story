import React, { useState } from 'react';
import {MdAdd, MdDeleteOutline,MdUpdate,MdClose} from "react-icons/md";
import DataSelector from './Input/DataSelector';
import ImageSelector from './Input/ImageSelector';
import TagInput from './Input/TagInput';
import moment from 'moment';
import { toast } from 'react-toastify';

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
    const[title,setTitle]=React.useState("");
    const [visitedDate,setVisitedDate]=React.useState(null);
    const [story,setStory]=React.useState("");
    const [visitedLocation,setVisitedLocation]=useState([]);
    const [storyImg, setStoryImg] = useState(null);

    const [error,setError]=useState("");

    //add new travel story
    const addNewTravelStory=async()=>{
        try {
            let imageUrl="";

            //upload image if present
            if(storyImg)
            {
                const imgUploadRes=await uploadImage(storyImg);
                //get image url
                imageUrl=imgUploadRes.imageUrl || "";
            }

            const response = await axiosInstance.post("/add-travel-story", {
                title,
                story,imageUrl:imageUrl ||"",
                visitedLocation,
                visitedDate: visitedDate 
                ? moment(visitedDate).valueOf()
                :moment().valueOf(),
            });

            if(response.data && response.data.story)
            {
                toast.success("Story Added Successfully");
                //refresh stories
                getAllTravelStories();
                //close modal or form
                onclose();
            }
        } catch (error) {
            
        }
    }

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
    <div>
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

                    {/* <button className='btn-small btn-delete' onClick={onclose}>
                        <MdDeleteOutline className="text-lg"/>DELETE
                    </button> */}
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
                placeholder='A day at The Freat Wall' 
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