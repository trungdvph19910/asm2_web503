import User from '../model/user';
import jwt from "jsonwebtoken"

const checkPermission = async (req, res, next) => {
    try {
        const permission = req.headers.authorization;
        if (!permission) {
            return res.json({
                messagem: "Bạn chưa đăng nhập"
            })
        }
        //
        const token = permission.split(" ")[1];
        jwt.verify(token, "maidaica", async (error, payload) => {
            if (error) {
                if (error.name == 'TokenExpiredError') {
                    return res.json({
                        message: "Token hết hạn"
                    })
                }
                if (error.name == 'JsonWebTokenError') {
                    return res.json({
                        message: "Token không hợp lệ"
                    })
                }
            }
            const user = await User.findById(payload._id);
            if (user.role !== "admin") {
                return res.json({
                    message: "Bạn không có quyền truy cập tài nguyên này"
                })
            }
            next()
        });

    } catch (error) {
        return res.json({
            message: error
        })
    }
}

export default checkPermission
