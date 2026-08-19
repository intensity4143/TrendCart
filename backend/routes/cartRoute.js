const express = require('express');
const cartRouter = express.Router();

const { addToCart, updateCart, getUserCart, saveForLater, moveToCart, removeSavedItem, getSavedItems } = require('../controllers/cartController');
const authUser = require('../middleware/auth');
const rateLimiter = require('../middleware/redisAuth');

cartRouter.post('/get', authUser, rateLimiter(60, 60), getUserCart);
cartRouter.post('/add', authUser, rateLimiter(30, 60), addToCart);
cartRouter.post('/update', authUser, rateLimiter(30, 60), updateCart);
cartRouter.post('/save', authUser, rateLimiter(30, 60), saveForLater);
cartRouter.post('/move-to-cart', authUser, rateLimiter(30, 60), moveToCart);
cartRouter.post('/remove-saved', authUser, rateLimiter(30, 60), removeSavedItem);
cartRouter.post('/get-saved', authUser, rateLimiter(60, 60), getSavedItems);

module.exports = cartRouter;