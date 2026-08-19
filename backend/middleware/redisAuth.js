const redis = require("../config/redis");

const rateLimiter = (limit, window) => {
    return async (req, res, next) => {
        try {
            const ip = req.ip;
            const key = `user:${ip}:${req.baseUrl}:${req.path}`;

            const count = await redis.incr(key);

            if (count === 1) {
                await redis.expire(key, window);
            }

            if (count > limit) {
                return res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later."
                });
            }

            next();

        } catch (error) {
            console.error(error);

            return res.status(500).json({
                success: false,
                message: "Redis error"
            });
        }
    };
};

module.exports = rateLimiter;