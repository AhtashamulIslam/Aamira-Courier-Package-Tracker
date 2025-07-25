import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DeliveryImage from "/images/deliveryMan.png";
import ConfirmImage from "/images/confirm.png";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TrackOrder = () => {
  const { packageId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [packData, setPackData] = useState([]);

  useEffect(() => {
    const getTrackingDetails = async () => {
      try {
        const res = await fetch(
          `/api/aamira/get-package/${currentUser._id}`
        );
        const data = await res.json();
        if (res.ok) {
          setPackData(data);
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };
    getTrackingDetails();
  }, [packData]);
  const trackedImages = {
    DeliveryImage,
    ConfirmImage
  };
  
  const packageData = (packData.filter(singlePackage=>singlePackage._id===packageId));
  return (
    <>
      <div className="text-black max-w-3xl mx-auto flex min-h-[72vh] flex-col gap-3 justify-center">
        <div className="mx-auto p-5 flex justify-center items-center flex-col gap-2">
          <img src={trackedImages.DeliveryImage} className="h-50 w-80" />
          <h2 className="text-center">
            Tracking Number : <span className="font-semibold">{packageId}</span>
          </h2>
          {packageData.map((order) => (
            <div
              key={order.packageId}
              className="flex gap-7 flex-col sm:flex-row p-5 justify-start mt-3 border-2 border-slate-500"
            >
              <div>
                <h2 className="font-semibold text-lg ml-1.5 mb-1">Tracking Status:</h2>
              <div className="flex justify-start">

                <div>
                  <img
                    src={trackedImages.ConfirmImage}
                    alt="tracking_icons"
                    className="h-18 w-18 rounded-full"
                  />
                </div>
                <div className="flex flex-col justify-center">
                  <h2>{order.status === "CREATED" && "Order confirmed"}</h2>
                  <h2>
                    {order.status === "IN_TRANSIT" && "Order shipped"}
                  </h2>
                  <h2>{order.status === "DELIVERED" && "Order delivered"}</h2>
                  <p>Shipping destination is <strong>{order.city}</strong></p>
                </div>
              </div>
              </div>
              <div>
                <h2 className="font-semibold text-lg mb-1">Products Details:</h2>
                <div>
                   <p className="text-md">Consumer's Email : <strong>{order.consumerEmail.slice(0,-7)}</strong></p>
                   <p className="text-md">Product : <strong>{order.productDesc}</strong></p>
                   <p className="text-md">Price : <strong>{order.price} TK</strong></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default TrackOrder;
