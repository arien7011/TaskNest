import mongoose, {Schema} from "mongoose";

const attachMentModel = new Schema({
 fileName:{
    type:String
 },
 fileType:{
    type:String
 },
 fileUrl:{
    type:String
 },
 fileSize:{
    type:Number
 },
 task:{
    type:Schema.Types.ObjectId,
    ref:"Todo"
 },
 uploadedBy:{
    type:Schema.Types.ObjectId,
    ref:"User"
 },
  isDeleted:{
    type:Boolean
  },

},{timestamps:true})

export const Attachment  = mongoose.model("Attachment",attachMentSchema);