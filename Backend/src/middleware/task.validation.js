import { body, param } from "express-validator";
import { handleValidationErrors } from "./validation.middleware.js";

const taskIdParamValidation = param("id")
    .isMongoId()
    .withMessage("Invalid task id");

const createTaskValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .bail()
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters")
        .escape(),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .bail()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .escape(),
    body("status")
        .optional()
        .isIn(["pending", "completed"])
        .withMessage("Status must be either pending or completed"),
    body("user")
        .not()
        .exists()
        .withMessage("Task ownership is managed by the server"),
    handleValidationErrors,
];

const getTaskValidation = [
    taskIdParamValidation,
    handleValidationErrors,
];

const updateTaskValidation = [
    taskIdParamValidation,
    body().custom((value, { req }) => {
        const allowedFields = ["title", "description", "status"];
        const hasAtLeastOneField = allowedFields.some((field) =>
            Object.prototype.hasOwnProperty.call(req.body, field),
        );

        if (!hasAtLeastOneField) {
            throw new Error("At least one of title, description, or status is required");
        }

        return true;
    }),
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .bail()
        .isLength({ max: 150 })
        .withMessage("Title cannot exceed 150 characters")
        .escape(),
    body("description")
        .optional()
        .isString()
        .withMessage("Description must be a string")
        .bail()
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters")
        .escape(),
    body("status")
        .optional()
        .isIn(["pending", "completed"])
        .withMessage("Status must be either pending or completed"),
    body("user")
        .not()
        .exists()
        .withMessage("Task ownership cannot be reassigned"),
    handleValidationErrors,
];

const deleteTaskValidation = [
    taskIdParamValidation,
    handleValidationErrors,
];

export {
    createTaskValidation,
    getTaskValidation,
    updateTaskValidation,
    deleteTaskValidation,
};
