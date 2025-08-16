import mongoose, {Schema} from "mongoose";


const notificationSchema = new Schema({
 userId:{
    type:Schema.Types.ObjectId,
    ref:"User"
 },
  message:{
    type:String
  },
  isRead:{
    type:Boolean
  },
  todoId:{
    type:Schema.Types.ObjectId,
    ref:"Todo"
  },
  type:{
    type:String,
    enum:["Reminder","Update","Deadline","Comment"]
  }
},{timestamps:true})

export const Notification = mongoose.model("Notification",notificationSchema);