import mongoose ,{Schema} from "mongoose";


const todoSchema = new Schema({
 title:{
   type:String,
   required:true,
   trim:true,
 },
 description : {
    type:String,
    required:true,
    trim:true
 },
 creater:{
    type:Schema.Types.ObjectId,
    ref:"User"
 },
 parentTask:{
    type:Schema.Types.ObjectId,
    ref:"Todo",
    default:null
 },
 status: {
    type:String,
    enum: ["Pending", "In Progress", "Completed"],
    default:"Pending"
 },
 priority : {
    type:String,
    enum : ["Low","Medium","High"],
    default:"Medium"
 },
  dueDate:{
    type:Date,
    default:null
  },
  repeat:{
    type:String,
    enum:["None","Daily","Weekly","Monthly","Yearly"],
    default:"None"
  },
 reminder: {
    type:Date,
    default:null
 },
  isDeletedAt:{
    type:Boolean,
    default:false
  },
  category:{
    type:String,
    trim:true,
    default:"General"
  },
  labels: [{
  type: String,
  trim: true
  }],
  attachments:{
    type:Schema.Types.ObjectId,
    ref:"Attachment"
  },
  isArchived:{
    type:Boolean,
    default:false
  }

},{timestamps:true})

export const Todo = mongoose.model("Todo",todoSchema);