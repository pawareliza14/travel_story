import React, { useState, useRef, useEffect } from 'react';
import { MdOutlineDateRange, MdClose } from 'react-icons/md';
import { DayPicker } from "react-day-picker";
import moment from 'moment';

const DataSelector = ({ date, setDate }) => {
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const datePickerRef = useRef(null);

    const handleClickOutside = (event) => {
        if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
            setOpenDatePicker(false);
        }
    };

    useEffect(() => {
        if (openDatePicker) {
            window.addEventListener('click', handleClickOutside);
        } else {
            window.removeEventListener('click', handleClickOutside);
        }
        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [openDatePicker]);

    return (
        <div ref={datePickerRef}>
            <button
                className='inline-flex items-center gap-2 text-[13px] font-medium text-sky-600 bg-sky-200/40 hover:bg-sky-200/70 rounded px-2 py-1 cursor-pointer'
                onClick={() => setOpenDatePicker(true)}
                aria-expanded={openDatePicker}
            >
                <MdOutlineDateRange className="text-lg" />
                {date ? moment(date).format("DD MM YYYY") : moment().format("DD MM YYYY")}
            </button>

            {openDatePicker && (
                <div className='overflow-y-scroll p-5 bg-sky-50/80 rounded-lg relative pt-9'>
                    <button
                        className='w-10 h-10 rounded-full flex items-center justify-center bg-sky-100 hover:bg-sky-100 absolute top-2 right-2'
                        onClick={() => setOpenDatePicker(false)}
                    >
                        <MdClose className="text-xl text-sky-600" />
                    </button>
                    <DayPicker
                        captionLayout='dropdown-buttons'
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        pagedNavigation
                    />
                </div>
            )}
        </div>
    );
};

export default DataSelector;
