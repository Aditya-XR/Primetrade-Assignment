import Task from "../models/task.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchHandler.js";

const TASK_USER_POPULATE_FIELDS = "name email role";

const getAccessibleTask = async (taskId, currentUser, shouldPopulate = true) => {
    const query = currentUser.role === "admin"
        ? { _id: taskId }
        : { _id: taskId, user: currentUser._id };

    let taskQuery = Task.findOne(query);

    if (shouldPopulate) {
        taskQuery = taskQuery.populate("user", TASK_USER_POPULATE_FIELDS);
    }

    return taskQuery;
};

const createTask = asyncHandler(async (req, res) => {
    const { title, description = "", status = "pending" } = req.body;

    const task = await Task.create({
        title,
        description,
        status,
        user: req.user._id,
    });

    const createdTask = await Task.findById(task._id).populate("user", TASK_USER_POPULATE_FIELDS);

    return res
        .status(201)
        .json(new ApiResponse(201, createdTask, "Task created successfully"));
});

const getTasks = asyncHandler(async (req, res) => {
    const filter = req.user.role === "admin" ? {} : { user: req.user._id };

    const tasks = await Task.find(filter)
        .sort({ createdAt: -1 })
        .populate("user", TASK_USER_POPULATE_FIELDS);

    return res
        .status(200)
        .json(new ApiResponse(200, tasks, "Tasks fetched successfully"));
});

const getTaskById = asyncHandler(async (req, res) => {
    const task = await getAccessibleTask(req.params.id, req.user);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, task, "Task fetched successfully"));
});

const updateTask = asyncHandler(async (req, res) => {
    const task = await getAccessibleTask(req.params.id, req.user, false);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const updatableFields = ["title", "description", "status"];

    updatableFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            task[field] = req.body[field];
        }
    });

    await task.save();

    const updatedTask = await Task.findById(task._id).populate("user", TASK_USER_POPULATE_FIELDS);

    return res
        .status(200)
        .json(new ApiResponse(200, updatedTask, "Task updated successfully"));
});

const deleteTask = asyncHandler(async (req, res) => {
    const task = await getAccessibleTask(req.params.id, req.user, false);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    await task.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Task deleted successfully"));
});

export { createTask, getTaskById, getTasks, updateTask, deleteTask };
