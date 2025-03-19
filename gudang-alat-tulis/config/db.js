const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb+srv://furqonaryadana19:AzZitB0p1IbBVO43@cluster-belajar.yw6gf.mongodb.net/gudang?retryWrites=true&w=majority&appName=cluster-belajar", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB Connected...");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
