import User from "../models/user.model.js";
import AppError from "../utils/error.util.js";
import cloudinary from "cloudinary"; // Ensure cloudinary is configured correctly
import fs from "fs"; // Importing the fs module

const cookieOptions = {
    expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true,
}
const signup = async (req, res, next) => {
    console.log(req.body);
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return next(new AppError("All fields are required!", 401));
    }

    try {
        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            return next(new AppError("User already exists", 401));
        }

        // Create a new user with default or uploaded avatar
        user = await User.create({
            name,
            email,
            password,
            avatar: req.file ? {
                public_id: req.file.filename,
                secure_url: req.file.path,
            } : {
                public_id: email,
                secure_url: "https://res.cloudinary.com/dmcur395y/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1720752792/samples/cloudinary-icon.png",
            },
        });

        // Save file upload on Cloudinary
        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'lms',
                    width: 150,
                    height: 150,
                    gravity: "faces",
                    crop: 'fill',
                });
                if (result) {
                    user.avatar.public_id = result.public_id;
                    user.avatar.secure_url = result.secure_url;

                    // Remove file from server
                    await fs.promises.rm(req.file.path); // Use async version
                }
            } catch (error) {
                return next(new AppError("Cloudinary Error!", 500));
            }
        }

        await user.save();
        user.password = undefined;
        const token = await user.generateJWTToken(); // Use await for consistency
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "User created successfully",
            user,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new AppError("All fields are required!", 401));
    }

    try {
        const user = await User.findOne({ email }).select("+password"); // Added await
        if (!user) {
            return next(new AppError("No user with this email!", 401));
        }

        const isMatch = await user.comparePassword(password); // Ensure comparePassword is async
        if (!isMatch) {
            return next(new AppError("Incorrect password!", 401));
        }

        user.password = undefined;
        const token = await user.generateJWTToken(); // Use await for consistency
        res.cookie("token", token, cookieOptions);

        return res.status(201).json({
            success: true,
            message: "User login successfully",
            user,
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

const logout = (req, res) => {
    try {
        res.cookie("token", null, {
            maxAge: 0,
            secure: true,
            httpOnly: true,
        });

        return res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });

    } catch (error) {
        return next(new AppError(error.message, 500));
    }
}

export { signup, login, logout };
