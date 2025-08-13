import { Router } from "express";

const subscriptionRouter = Router();

subscriptionRouter.post('/', (req, res) => res.send({title: 'GET all subscriptionss'}));


export default subscriptionRouter;