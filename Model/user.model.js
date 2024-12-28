import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    userId : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type: String,
        required: true
    }
})

const User = mongoose.model('user', userSchema);
export default User;