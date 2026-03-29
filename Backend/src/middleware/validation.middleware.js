import { validationResult } from "express-validator";
import { ApiError } from "../utils/ApiError.js";

const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (errors.isEmpty()) {
        return next();
    }

    return next(new ApiError(
        400,
        "Validation failed",
        errors.array().map(({ path, msg }) => ({
            field: path || "body",
            message: msg,
        })),
    ));
};

export { handleValidationErrors };
