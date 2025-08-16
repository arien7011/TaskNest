import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { Todo } from "../models/todo.model.js";

const createTodo = asyncHandler(async (req, res) => {
  console.log({ payload: req.body });
  const {
    title,
    description,
    dueDate,
    status,
    priority,
    repeat,
    reminder,
    category,
    labels,
    isDeletedAt,
    isArchived,
  } = req.body;
  if ([title, description, dueDate].some((value) => value.trim() === "")) {
    throw new ApiError(400, "Title, description, and due date are required.");
  }

  const attachementLocalpath = req.file?.path;
  let attachmentUrl = "";
  if (attachementLocalpath) {
    let uploaded = await uploadOnCloudinary(attachementLocalpath);
    console.log({ uploadedFile: uploaded });
    if (!uploaded?.url) {
      throw new ApiError(
        500,
        "Error while uploading attachement on cloudinary"
      );
    }
    attachmentUrl = uploaded.url;
  }

  console.log({ attachmentUrl: attachmentUrl });

  const newTodo = await Todo.create({
    title,
    description,
    dueDate,
    status: status ?? "Pending",
    priority: priority ?? "Medium",
    repeat: repeat ?? "None",
    reminder: reminder ?? undefined,
    category: category ?? "General",
    label: labels ?? [],
    attachement: attachmentUrl ?? "",
    creater: req.user._id,
    isDeletedAt: isDeletedAt ?? false,
    isArchived: isArchived ?? false,
  });
  console.log({ newTodo: newTodo });
  const createdTodo = await Todo.findById(newTodo._id);

  if (!createdTodo) {
    throw new ApiError(500, "Error while creating Todo");
  }

  res
    .status(200)
    .json(new ApiResponse(200, createdTodo, "Todo Created Successfully"));
});

const getTodo = asyncHandler(async (req, res) => {
  const todoId = req.params?.id;
  console.log({ params: todoId });

  if (!todoId) {
    throw new ApiError(401, "todo id is missing");
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new ApiError(401, "Todo not found");
  }

  res.status(200).json(new ApiResponse(200, todo, "Todo fetched successfully"));
});

const todoList = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const todos = await Todo.find({ creater: userId });

  if (!todos) {
    throw new ApiError(500, "Something went wrong while fetching todo List");
  }

  res
    .status(200)
    .json(new ApiResponse(200, todos, "Todo List fetched successfully"));
});

const updateTodo = asyncHandler(async (req, res) => {
  const {
    title,
    description,
    status,
    priority,
    category,
    labels,
    repeat,
    reminder,
    dueDate,
  } = req.body;

  const todoId = req.params?.id;

  if ([title, description, dueDate].some((value) => value.trim() === "")) {
    throw new ApiError(401, "Please fill all required fields");
  }

  if (!todoId) {
    throw new ApiError(401, "todoId is missing");
  }

  const todo = await Todo.findById(todoId);

  if (!todo) {
    throw new ApiError(401, "TodoId is incorrect");
  }

  const updatedTodo = await Todo.findByIdAndUpdate(
    todoId,
    {
      title,
      description,
      status,
      category,
      priority,
      labels,
      repeat,
      reminder,
      dueDate,
    },
    { new: true }
  );

  if (!updatedTodo) {
    throw new ApiError(500, "Something went wrong while saving Todo");
  }

  res
    .status(200)
    .json(new ApiResponse(200, updatedTodo, "Todo is updated Successfully"));
});

  const updateAttachment = asyncHandler(async(req,res) =>{
    const attachment = req.file;
    const todoId = req.params?.id;

    if(!todoId){
        throw new ApiError(401,"todoId is missing");
    }

    const todo = await Todo.findById(todoId);

    if(!todo){
        throw new ApiError(401,"Please send correct todo Id");
    }

    if(!attachment) {
      throw new ApiError(401,"Please upload an attachment");
    }

    const allowedTypes = ["jpg","jpeg","png"];
    const fileExtension = attachment.originalname.split('.').pop().toLowerCase();
    const isMatchTypes = allowedTypes.includes(fileExtension);
    if(!isMatchTypes){
        throw new ApiError(401,"Please send attachment in allowed format(jpg,jpeg,png)");
    }
    
    const uploadedFile = await uploadOnCloudinary(attachment.url);

    if(!uploadedFile){
        throw new ApiError(500,"Something went wrong while uploading attachement on cloudinary");
    }

    const updatedTodo = await Todo.findByIdAndUpdate(
        {attachement:uploadedFile?.url},
        {new:true}
    )

     if(!updatedTodo){
        throw new ApiError(500,"Something went wrong while updating attachement")
     }

     res.status(200).json(new ApiResponse(200,updatedTodo,"Attachment updated Successfully"));
  })

export { createTodo, getTodo, todoList,updateTodo,updateAttachment };

/*
{
   $lookup:
     {
       from: <collection to join>,
       localField: <field from the input documents>,
       foreignField: <field from the documents of the "from" collection>,
       pipeline: [ <pipeline to run> ],
       as: <output array field>
     }
}

*/
