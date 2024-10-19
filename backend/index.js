require('dotenv').config();
const bcrypt = require("bcryptjs");
const config = require("./config.json");
const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const multer = require("multer");


const {authenticateToken} = require("./utilities.js")

mongoose.connect(config.connectionString);


const User = require('./models/user.model.js');
const TravelStory = require('./models/travelStory.model.js');
const { parse } = require('dotenv');
const upload = require('./multer.js')

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" }));

// Test API
app.get("/hello", async (req, res) => {
    return res.status(200).json({ message: "hello" });
});

// Create Account
app.post("/create-account", async (req, res) => {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    const isUser = await User.findOne({ email });
    if (isUser) {
        return res.status(400).json({ error: true, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    await user.save();

    try {
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.json({
            error: false,
            message: "Account created successfully",
            user: { fullName: user.fullName, email: user.email },
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error creating token" });
    }
});

//Login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: true, message: "email and password are required" });
    }

    const user  = await User.findOne({email});

    if(!user){
        return res.status(400).json({message: "User not found"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if(!isPasswordValid){
        return res.status(400).json({message: "Invalid Credentials"});
    }

   try {
        const accessToken = jwt.sign(
            { userId: user._id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "72h" }
        );

        return res.json({
            error: false,
            message: "Login Successful",
            user: { fullName: user.fullName, email: user.email },
            accessToken,
        });
    } catch (error) {
        return res.status(500).json({ error: true, message: "Error creating token" });
    }
    
});

//get user
app.get("/get-user",authenticateToken, async(req,res) => {
    const { userId} = req.user

    const isUser = await User.findOne({_id: userId});

    if(!isUser){
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "",
    });
});

//Add Travel Story
app.post("/add-travel-story", authenticateToken, async (req, res) => {
    const { title, story, visitedLocation, imageUrl, visitedDate } = req.body;
    const { userId } = req.user;
    
    // Validate required fields
    if (!title || !story || !visitedLocation || !imageUrl || !visitedDate) {
        return res.status(400).json({ error: true, message: "All fields are required" });
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(Number(visitedDate));

    // Check if the parsed date is valid
    if (isNaN(parsedVisitedDate.getTime())) {
        return res.status(400).json({ error: true, message: "Invalid visitedDate format" });
    }

    try {
        const travelStory = new TravelStory({
            title,
            story,
            visitedLocation,
            userId,
            imageUrl,
            visitedDate: parsedVisitedDate,
        });

        await travelStory.save();

        res.status(201).json({ story: travelStory, message: "Added Successfully" });
    } catch (error) {
        res.status(400).json({ error: true, message: error.message });
    }
});

// Get All Travel Stories
app.get("/get-all-stories", authenticateToken, async(req,res) => {
    const {userId} = req.user;

    try{
        const travelStories = await TravelStory.find({ userId: userId}).sort({
            isFavourite: -1,
        });
        res.status(200).json({ stories:travelStories});
    } catch(error){
        res.status(500).json({error: true, message: error.message});
    }

});


app.post("/image-upload", upload.single("image"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: true, message: "No image uploaded or invalid file type" });
    }

    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.status(201).json({ imageUrl });
});

//Serve static files from the uploads and assests dirctory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/assets", express.static(path.join(__dirname, "assets")));


//Delete an image from uploads folder
app.delete("/delete-image", async (req, res) => {
  const { imageUrl } = req.query;

  if (!imageUrl) {
    return res.status(400).json({ error: true, message: "imageUrl parameter required" });
  }

  try {
    // Extract the filename from the imageUrl
    const filename = path.basename(imageUrl);

    // Define the file path
    const filePath = path.join(__dirname, 'uploads', filename);

    // Check if the file exists
    if (fs.existsSync(filePath)) {
      // Delete the file from the uploads folder
      fs.unlinkSync(filePath);
      res.status(200).json({ message: "Image deleted successfully" });
    } else {
      res.status(404).json({ error: true, message: "Image not found" });
    }
  } catch (error) {
    res.status(500).json({ error: true, message: error.message });
  }
});


//Edit travel story
app.post("/edit-story/:id", authenticateToken, async(req,res) => {
    const {id} = req.params;
    const {title, story, visitedLocation, imageUrl, visitedDate} = req.body;
    const { userId} = req.user;

    //Validate required fields
    if(!title || !story || !visitedDate  || !visitedLocation){
        return res
        .status(400)
        .json({error: true, message: "All fields are required"});
    }

    // Convert visitedDate from milliseconds to Date object
    const parsedVisitedDate = new Date(parseInt(visitedDate));

    try{
        //Find the travel story by its ID and ensure it belongs to authenticated user
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(404).json({error: true, message:"Travel story not found"});
        }

        const placeholderImageUrl = 'http://localhost:8000/assets/placeholder.png';

        travelStory.title = title;
        travelStory.story = story;
        travelStory.visitedLocation = visitedLocation;
        travelStory.imageUrl = imageUrl || placeholderImageUrl;
        travelStory.visitedDate = parsedVisitedDate;

        await travelStory.save();
        res.status(200).json({story: travelStory, message: "Update Successful"});
    } catch(error){
        res.status(500).json({ error: true, message: error.message});
    }
})


//Delete travel story
app.delete("/delete-story/:id", authenticateToken, async(req,res) => {
    const { id } = req.params;
    const { userId} = req.user;

    try{
        //Find the travel story by OD and ensure it belongs to the authenticated user
        const travelStory = await TravelStory.findOne({_id: id, userId: userId});

        if(!travelStory){
            return res.status(400)
            .json({error: true, message: "Travel story not found"});
        }

        //Delete the travel story from the database
        await travelStory.deleteOne({_id: id, userId: userId});

        //Extract the filename from the imageUrl
        const imageUrl = travelStory.imageUrl;
        const filename = path.basename(imageUrl);

        //Define the file path
        const filePath = path.join(__dirname, 'uploads', filename);

        //Delete the image file from uploads folder
        fs.unlink(filePath, (err) => {
            if(err){
                console.error("Failed to delete image file:", err);
            }
        });

        res.status(200).json({message: "Travel story deleted successfully"});

    } catch(error){
        res.status(500).json({ error: true, message: error.message});
    }
})

//Update isFavourite 
app.put("/update-isFavourite/:id", authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { isFavourite } = req.body;  // Correctly destructure from req.body
    const userId = req.user.userId; // Assuming userId is in req.user after authentication

    try {
        const travelStory = await TravelStory.findOne({ _id: id, userId: userId });

        if (!travelStory) {
            return res.status(404).json({ error: true, message: "Travel story not found" });
        }

        travelStory.isFavourite = isFavourite;

        const updatedStory = await travelStory.save(); // Save the updated story

        res.status(200).json({ message: "Updated isFavourite successfully", story: updatedStory });
    } catch (error) {
        console.error("Error updating travel story:", error);
        res.status(500).json({ error: true, message: "An unexpected error occurred" });
    }
});


//Search travel story
app.get('/search', authenticateToken, async (req, res) => {
    const { query } = req.query; // Assuming `query` is the parameter passed in the URL
    const { userId } = req.user;

    // Check if the query parameter is provided
    if (!query) {
        return res.status(400).json({ error: true, message: "Query is required" });
    }

    try {
        const searchResults = await TravelStory.find({
            userId: userId,
            $or: [
                { title: { $regex: query, $options: "i" } },
                { story: { $regex: query, $options: "i" } },
                { visitedLocation: { $regex: query, $options: "i" } },
            ],
        }).sort({ isFavourite: -1 });

        res.status(200).json({ stories: searchResults });
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }
});


//Filter travel stories by date range
app.get("/travel-stories/filter", authenticateToken, async(req,res) => {
    const {startDate, endDate} = req.query;
    const {userId} = req.user;

    try{
        //Convert startDate and endDate from milliseconds to Date objects
        const start = new Date(parseInt(startDate));
        const end = new Date(parseInt(endDate));

        //Find travel stories that belong to the authenticated user and fall within the date range
        const filteredStories = await TravelStory.find({
            userId: userId,
            visitedDate: {$gte: start, $lte:end},
        }).sort({isFavourite: -1});

        res.status(200).json({stories: filteredStories});
    } catch (error) {
        res.status(500).json({ error: true, message: error.message });
    }

});


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});

module.exports = app;
