import { Router } from "express";
import {
    createTask,
    deleteTask,
    getTaskById,
    getTasks,
    updateTask,
} from "../controllers/task.controller.js";
import { authorizeRoles, verifyJWT } from "../middleware/auth.middleware.js";
import {
    createTaskValidation,
    deleteTaskValidation,
    getTaskValidation,
    updateTaskValidation,
} from "../middleware/task.validation.js";

const router = Router();

router.use(verifyJWT, authorizeRoles("user", "admin"));

router.get("/admin/all", authorizeRoles("admin"), getTasks);

router
    .route("/")
    .post(createTaskValidation, createTask)
    .get(getTasks);

router
    .route("/:id")
    .get(getTaskValidation, getTaskById)
    .patch(updateTaskValidation, updateTask)
    .delete(deleteTaskValidation, deleteTask);

export default router;
