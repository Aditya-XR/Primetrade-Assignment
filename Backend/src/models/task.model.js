import mongoose, { Schema } from "mongoose";

const removeInternalFields = (_, returnedObject) => {
    delete returnedObject.__v;
    return returnedObject;
};

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: [true, "Title is required"],
            trim: true,
            maxlength: [150, "Title cannot exceed 150 characters"],
        },
        description: {
            type: String,
            trim: true,
            default: "",
            maxlength: [1000, "Description cannot exceed 1000 characters"],
        },
        status: {
            type: String,
            enum: ["pending", "completed"],
            default: "pending",
        },
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
        toJSON: { transform: removeInternalFields },
        toObject: { transform: removeInternalFields },
    },
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
