const express = require('express');
const userRouter = express.Router();
const authUser = require('../middleware/auth');
const {
    loginUser, registerUser, adminLogin,
    getProfile, updateProfile, changePassword,
    addAddress, updateAddress, deleteAddress, setDefaultAddress,
} = require('../controllers/userController');

const rateLimiter = require('../middleware/redisAuth')

userRouter.post('/register', rateLimiter(5,60), registerUser);
userRouter.post('/login', rateLimiter(5, 60), loginUser);
userRouter.post('/admin', rateLimiter(5, 60), adminLogin);
userRouter.get('/profile', rateLimiter(30, 60), authUser, getProfile);
userRouter.put('/profile', rateLimiter(5, 60), authUser, updateProfile);
userRouter.put('/change-password', rateLimiter(5, 60), authUser, changePassword);
userRouter.post('/address/add', rateLimiter(30, 60), authUser, addAddress);
userRouter.put('/address/update', rateLimiter(30, 60), authUser, updateAddress);
userRouter.delete('/address/delete', rateLimiter(30, 60), authUser, deleteAddress);
userRouter.put('/address/set-default', rateLimiter(10, 60), authUser, setDefaultAddress);

module.exports = userRouter;
