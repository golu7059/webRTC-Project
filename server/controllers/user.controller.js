import User from "../models/user.model";
import AppError from "../utils/error.util";

const register = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return next(new AppError("All fields are required !", 401));
    }
    try {
        // check for user exist 

        let user = await User.findOne({ email });
        if (user) {
            return next(new AppError("user already exist", 401));
        }

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

        // now save file uploade on cloudinary 
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

                    // remove file from server
                    fs.rm(req.file.path);
                }
            } catch (error) {
                return next(new AppError("Cloudinary Error !", 500));
            }
        }

        await user.save();
        user.password = undefined;
        const token = await user.generateJWTToken();
        res.cookie("token", token, cookieOptions);
        console.log("Sending cookie", res.get("set-cookie"));

        return res.status(201).json({
            success: true,
            message: "user created successfully",
            user
        })

    } catch (error) {
        return new next(new AppError(error.message, 500));
    }
}

const login = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return new next(new AppError("All fields are required !", 401));
    }

    try {
        const user = User.findOne({ email }).select("+password");
        if (!user) {
            return new next(new AppError("No user with this email !", 401))
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return new next(new AppError("Incorrect password !", 401))
        }
        user.password = undefined;
        const token = user.generateJWTToken()
        res.cookie("token", token, cookieOptions);

        res.status(201).json({
            success: true,
            message: "user login successfully",
            user
        })
    } catch (error) {
        return new next(new AppError(error.message, 500));
    }
}

const logout = (req, res) => {
    try {
        res.cookie("token", null, {
            maxAge: 0,
            secure: true,
            httpOnly: true,
        });

        res.status(200).json({
            success: true,
            message: "user logout successfully",
        })

    } catch (error) {
        return new next(new AppError(error.message, 500));
    }
}

export { register, login, logout }