import mongoose, { connect } from "mongoose"

const connectDB = async()=>{
    try {
        await mongoose.connect("mongodb://localhost:27017/ShoppyGlobe")
        console.log("Database connection successful")
    } catch (error) {
        console.error("MongoDB Connection Error: ", error.message)
        process.exit(1)
    }
    
}

export default connectDB