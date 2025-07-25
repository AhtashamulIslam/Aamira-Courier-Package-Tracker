import { errorHandler } from "../utils/error.js";
import { v2 as cloudinary } from "cloudinary";
import Package from "../models/package.model.js";
import transporter from "../configs/nodemailer.js";
import User from '../models/user.model.js'

export const createPackage = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not registered user to add order for tracking")
    );
  }
  const {packageId, consumerEmail, city, eventTimeStamp, productDesc, price } = req.body;
   
  //const user = await User.findOne({email:consumerEmail});

  if (!packageId || !consumerEmail || !city || !eventTimeStamp || !productDesc || !price) {
    return next(errorHandler(400, "All fields are required"));
  }
  try {
    // Upload images to cloudinary
    const uploadImages = req.files.map(async (file) => {
      const response = await cloudinary.uploader.upload(file.path);
      // In this response we will get secure URL of image uploaded in cloudinary.
      return response.secure_url;
    });

    const productImage = await Promise.all(uploadImages);
    const receivedAt = new Date().toISOString();
    const packageOrder = new Package({
      packageId,
      consumerEmail: consumerEmail + Math.random().toString().slice(-7),
      city,
      eventTimeStamp,
      receivedAt,
      productDesc,
      price: +price,
      productImage
    });

    await packageOrder.save();
    
    // This is for SMTP object which will be sent to the Buyer's Email address. 
    //const confirmPackage =  await Package.findOne({packageId})
    //const recordDate = new Date(confirmPackage.eventTimeStamp);
   // const recordDateConfirm = recordDate.toISOString().substring(0,10)
    //const receiverEmail = confirmPackage.consumerEmail.slice(0,-7);
    
  //   const mailOptions = {
       
  //     from: process.env.SENDER_EMAIL,
  //     to: user.email,
  //     subject: "Order Details",
  //     html:`
  //           <h2> Your Order Details </h2>
  //           <p> Dear Consumer,</p>
  //           <p>Here are your order details:</p>
  //           <ul>
  //             <li><strong>Product ID :</strong> ${confirmPackage.packageId}</li>
  //             <li><strong>Consumer Email :</strong> ${user.email}</li>
  //             <li><strong>Location :</strong> ${confirmPackage.city}</li>
  //             <li><strong>Date of Record :</strong> ${recordDateConfirm}</li>
  //             <li><strong>Product's Price :</strong> $ ${confirmPackage.price} /night</li>
  //           </ul>
  //       <p>If yoy need to return or change your product, feel free to contact us.</p>
  //     `
  //  }
   //await transporter.sendMail(mailOptions)
    res.status(200).json("Package created successfully");
  } catch (error) {
    next(error);
  }
}; 

export const getPackages = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "You are not allowed to see packages for tracking")
    );
  }

  try {
    const packages = await Package.find({
      _id: { $ne: null } // This is to ensure we get all rooms except those with null IDs.
    }).sort({ createdAt: -1 });
    await res.status(200).json(packages);
  } catch (error) {
    next(error);
  }
};

// Get a single package using packageId 

export const getPackage = async(req,res,next)=>{
 
  try {
     const singlePackage = await Package.findById(req.params.productId)
     if(!singlePackage){
           return next(errorHandler(404,'Package not found'))
     }
     console.log(singlePackage)
     await res.status(200).json(singlePackage)
  } catch (error) {
     next(error)
  }
}













