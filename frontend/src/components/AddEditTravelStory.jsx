import React from 'react';
import {MdAdd, MdDeleteOutline,MdUpdate,MdClose} from "react-icons/md";

const AddEditTravelStory = ({ storyInfo, type, onClose, getAllTravelStories }) => {
    const handleAddOrUpdateClick=()=>{};
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
            </div>
        </div>

        <div>
            <div className='flex-1 flex flex-col gap-2 pt-4'>
                <label htmlFor="input-label">TITLE</label>
                <input type="text" className='text-2xl text-slate-950 outline-none'
                placeholder='A day at The Freat Wall' 
                />

                <div className='my-3'>
                    <DataSelector/>
                </div>

            </div>
        </div>
    </div>
  );
};

export default AddEditTravelStory;
