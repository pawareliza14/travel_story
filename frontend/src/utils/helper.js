import NO_SEARCH_DATA_IMG from '../assets/images/no-search-data.svg'
import NO_FILTER_DATA_IMG from '../assets/images/no-filter-data.svg'
import ADD_STORY_IMG from '../assets/images/add-story.svg'
export const validateEmail=(email)=>{
    const regex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getEmptyCardMessage = (filterType)=>{
    switch (filterType)
    {
        case "search":
            return `Oops! No stories found matching your search.`;
        case "date":
            return `Oops! No stories found matching your date.`;
        default:
            return `Start creating uour first Travel Story! Click the 'Add' button to jot down your thoughts, ideas and memories. Let's get started!`;
    }
}

export const getEmptyCardImg = (filterType)=>{
    switch (filterType) {
        case "search":
            return NO_SEARCH_DATA_IMG;
            case "date":
                return NO_FILTER_DATA_IMG;
            default:
                return ADD_STORY_IMG;
        }
}