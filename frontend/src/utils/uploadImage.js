import axiosInstance from "./axiosInstance";

const uploadImage = async (imageFile) => {
    const formData = new FormData();

    //Append image file to form data
    formData.append('image', imageFile);

    try{
        const response = await axiosInstance.post('/image-upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', //Set header file for file upload
            },
        });
        return response.data;
    } catch(error){
        console.error('Error uploading the image', error);
        throw error; //Rethrow error for handling
    }
};

export default uploadImage;