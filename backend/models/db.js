const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://mzohaib0677:KcPAAXmFtfJqEAUA@cluster0.0hgzd.mongodb.net/CourseManagement?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});