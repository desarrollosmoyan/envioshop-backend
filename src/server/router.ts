import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import ratingRouter from "../modules/rating/rating.route";
import trackingRouter from "../modules/tracking/tracking.router";
import userRouter from "../modules/user/user.route";
import turnRouter from "../modules/turn/turn.route";
import salesRouter from "../modules/sales/sales.router";
import meRouter from "../modules/me/me.route";
import onlyAdmin from "../middleware/onlyAdmin";
import shippingRouter from "../modules/shipment/shipping.route";
import statsRouter from "../modules/stats/stats.router";
const mainRouter = Router();

mainRouter.use("/rating", ratingRouter);
mainRouter.use("/tracking", trackingRouter);
mainRouter.use("/user", userRouter);
mainRouter.use("/turn", turnRouter);
mainRouter.use("/sales", salesRouter);
mainRouter.use("/me", meRouter);
mainRouter.use("/stats", statsRouter);
mainRouter.use("/shipping", shippingRouter);

export default mainRouter;
