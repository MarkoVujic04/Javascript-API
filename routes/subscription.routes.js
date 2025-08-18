import { Router } from "express";
import { createSubscription, deleteSubscription, getUserSubscriptions } from "../controllers/subscription.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const subscriptionRouter = Router();

subscriptionRouter.post('/', authorize, createSubscription);
subscriptionRouter.delete('/', authorize, deleteSubscription);
subscriptionRouter.get('/user/:id', authorize, getUserSubscriptions);

export default subscriptionRouter;