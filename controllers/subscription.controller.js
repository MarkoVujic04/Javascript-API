import Subscription from "../models/subscription.model.js";

export const createSubscription = async (req, res, next) => {
  try {
    const userId =
      req.user?.id ||
      req.user?._id?.toString?.();

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing user context" });
    }

    const subscription = await Subscription.create({
      ...req.body,
      user: userId,               
    });

    res.status(201).json({ success: true, data: subscription });
  } catch (error) {
    next(error);
  }
};

export const getUserSubscriptions = async (req, res, next) => {
    try {
        if(req.user.id != req.params.id) {
            const error = new Error("You cant see someone elses subscriptions");
            error.status = 401;
            throw error;
        }

        const subscriptions = await Subscription.find({ user: req.params.id });

        res.status(200).json({ success: true, data: subscriptions });
    }catch(error) {
        next(error);
    }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.user?._id?.toString?.();
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: missing user context" });
    }

    const { id } = req.params;

    const deleted = await Subscription.findOneAndDelete({ _id: id, user: userId });

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Subscription not found" });
    }

    return res.status(200).json({ success: true, message: "Subscription deleted" });
  } catch (err) {
    if (err.name === "CastError") {
      err.statusCode = 400;
      err.message = "Invalid subscription id";
    }
    next(err);
  }
};