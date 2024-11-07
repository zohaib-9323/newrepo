const mongoose = require('mongoose');
require('dotenv').config();


mongoose.connect(process.env.REACT_APP_MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");

})
.catch((error) => {
    console.error("MongoDB connection error:", error);

});
