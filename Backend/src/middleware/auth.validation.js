import { body } from "express-validator";
import { handleValidationErrors } from "./validation.middleware.js";

const registerValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required")
        .bail()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters")
        .escape(),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("A valid email is required")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required")
        .bail()
        .isLength({ min: 6, max: 64 })
        .withMessage("Password must be between 6 and 64 characters"),
    handleValidationErrors,
];

const loginValidation = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .bail()
        .isEmail()
        .withMessage("A valid email is required")
        .normalizeEmail(),
    body("password")
        .notEmpty()
        .withMessage("Password is required"),
    handleValidationErrors,
];

export { registerValidation, loginValidation };
