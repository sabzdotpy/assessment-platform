import mongoose from 'mongoose';
import { MONGODB_URI, NODE_ENV } from '../config/env.js';


const connectDB = async() => {
    if(!MONGODB_URI || !NODE_ENV){
        throw new Error('MONGODB_URI and NODE_ENV must be defined in the environment variables');
    }
    try {
        await mongoose.connect(MONGODB_URI);
        console.log(`MongoDB connected successfully in ${NODE_ENV} mode`);
    } catch(error){
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;