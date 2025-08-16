import {DATABASE_NAME} from "../../constants.js";
import mongoose from "mongoose";


const connectDB = async () => {
    try{
        const connectionInstance  = await mongoose.connect(`${process.env.MONGODB_URI}/${DATABASE_NAME}`);
        console.log(`Connection :  ${connectionInstance .connection.host}`);
        console.log("Database is ready to use");
        return connectionInstance ;
    }catch(error){
     console.log("Error connecting to database:", error);
     process.exit(1);
    }
}

export default connectDB;
