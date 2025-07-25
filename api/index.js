import dotenv from "dotenv";
import express from "express";
import trackingRoute from "./routes/track.route.js";
import mongoose from "mongoose";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import connectCloudinary from "./configs/cloudinary.js";
import Agenda from "agenda";
import Package from "./models/package.model.js";
import path from 'path'

dotenv.config();

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

connectCloudinary();

 const __dirname = path.resolve();

const app = express();

const PORT = process.env.PORT || "3000";

app.use(express.json());
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running at port ${PORT}`);
});

app.use("/api/aamira", trackingRoute);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('/{*any}', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
})

const agenda = new Agenda({ db: { address: process.env.MONGODB_URI } });
agenda.define("update status", async (job) => {
  const packages = await Package.find();
  packages.map((packageOrder) => {
    function getMinutesDifference(dt1, dt2) {
      const diffMilliseconds = Math.abs(dt2.getTime() - dt1.getTime());
      const diffMinutes = Math.round(diffMilliseconds / 60000);
      return diffMinutes;
    }

    const startTime = new Date(packageOrder.eventTimeStamp);
    const endTime = new Date(new Date().toISOString());

    const minutesBetween = getMinutesDifference(startTime, endTime);
    if (minutesBetween > 0) {
      const updatePackageStatus = async () => {
        if((minutesBetween > 30) && (minutesBetween < 721)){
        if (packageOrder.status === "CREATED") {
          await Package.findByIdAndUpdate(packageOrder._id, {
            $set: { status: "PICKED_UP" }
          });
        }else if(packageOrder.status === "PICKED_UP"){
             await Package.findByIdAndUpdate(packageOrder._id, {
            $set: { status: "IN_TRANSIT" }
          });
        }else if(packageOrder.status === "IN_TRANSIT"){
             await Package.findByIdAndUpdate(packageOrder._id, {
            $set: { status: "OUT_FOR_DELIVERY" }
          });
        }else if(packageOrder.status === "OUT_FOR_DELIVERY") {
             await Package.findByIdAndUpdate(packageOrder._id, {
            $set: { status: "DELIVERED" }
          });
        }
      }else{
        if((minutesBetween >= 721 ) && (minutesBetween <= 1440) && (packageOrder.status !== "DELIVERED")){
             if(packageOrder.status !== "EXCEPTION"){
               await Package.findByIdAndUpdate(packageOrder._id, {
               $set: { status: "EXCEPTION" }
              });
             
             }else{
               await Package.findByIdAndUpdate(packageOrder._id, {
               $set: { status: "DELIVERED" }
              });
             }
           }else{
               await Package.findByIdAndUpdate(packageOrder._id, {
               $set: { status: "CANCELED" }
              });
           }

        }
     }
     updatePackageStatus();
  }
  });
});
(async function () {
  await agenda.start();
  await agenda.every("35 minutes", "update status");
})();
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message
  });
});
