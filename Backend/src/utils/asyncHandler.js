const asyncHandler = (apiFunc) => {
    return (req,res,next) =>{
        Promise.resolve(apiFunc(req,res,next)).catch((error)=>{
            next(error);
        });
    }
} 

export {asyncHandler};
