import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true,
        trim: true,  
        index:true
    },
    email: {
        type: String,
        required: true,
        unique: true,  
        index: true,
        match: [/.+\@.+\..+/, "Please enter a valid email address"],  
    },
    password: {
        type: String,
        required: true,
    },
    mobileNo: {
        type: String,
        required: true,
        minlength: 10,
        maxlength: 10,
        match: /^[0-9]{10}$/, 
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); 
            },
            message: props => `${props.value} is not a valid 10-digit mobile number!`
        }
    },
    
    role: {
        type: String,
        enum: ['user', 'carOwner', 'admin'],  
        default: 'user',  
        required: true,
    }
}, { timestamps: true });

// Text Index for broad search
userSchema.index({ 
    fullname: 'text', 
    email: 'text' 
}, {
    weights: {
        fullname: 10,
        email: 5
    },
    name: "UserSearchIndex"
});

export const User = mongoose.model("User", userSchema);