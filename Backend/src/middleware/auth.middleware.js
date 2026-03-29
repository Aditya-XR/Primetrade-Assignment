import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asynchHandler.js";

const extractBearerToken = (authorizationHeader = "") => {
    if (!authorizationHeader.startsWith("Bearer ")) {
        return null;
    }

    return authorizationHeader.split(" ")[1]?.trim() || null;
};

const verifyJWT = asyncHandler(async (req, res, next) => {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        throw new ApiError(401, "Access token is required in the Authorization header");
    }

    if (!process.env.ACCESS_TOKEN_SECRET) {
        throw new ApiError(500, "Access token secret is not configured");
    }

    let decodedToken;

    try {
        decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    } catch (error) {
        const message = error.name === "TokenExpiredError" ? "Access token has expired" : "Invalid access token";
        throw new ApiError(401, message);
    }

    const user = await User.findById(decodedToken._id);

    if (!user) {
        throw new ApiError(401, "Invalid access token");
    }

    req.user = user;
    next();
});

const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return next(new ApiError(401, "Authentication required"));
        }

        if (!allowedRoles.includes(req.user.role)) {
            return next(new ApiError(403, "You do not have permission to access this resource"));
        }

        return next();
    };
};

export { verifyJWT, authorizeRoles };
