import User from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchHandler.js";

const createAuthPayload = (userDocument) => {
    const accessToken = userDocument.generateAccessToken();

    return {
        user: userDocument.toObject(),
        accessToken,
        tokenType: "Bearer",
    };
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const user = await User.create({
        name,
        email,
        password,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, createAuthPayload(user), "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createAuthPayload(user), "Logged in successfully"));
});

export { registerUser, loginUser };
