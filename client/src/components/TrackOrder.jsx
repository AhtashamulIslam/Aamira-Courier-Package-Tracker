import React, { useState } from "react";
import { useParams } from "react-router-dom";
import DeliveryImage from "/images/deliveryMan.png";
import ConfirmImage from "/images/confirm.png";
import CancelImage from "/images/cancel.png"
import OutForDeliveryImage from "/images/outfordelivery.png"
import DelayImage from "/images/delay.png"
import InTransitImage from "/images/intransit.png"
import LabelImage from "/images/label.png"
import PickedImage from "/images/picked.png"

import { useEffect } from "react";
import { useSelector } from "react-redux";

const TrackOrder = () => {
  const { packageId } = useParams();
  const { currentUser } = useSelector((state) => state.user);
  const [packData, setPackData] = useState([]);

  useEffect(() => {
    const getTrackingDetails = async () => {
      try {
        const res = await fetch(`/api/aamira/get-package/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setPackData(data);
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };
    getTrackingDetails();
     const interval = setInterval(getTrackingDetails, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);
  const trackedImages = {
    DeliveryImage,
    ConfirmImage,
    CancelImage,
    PickedImage,
    OutForDeliveryImage,
    InTransitImage,
    DelayImage,
    LabelImage
  };

  const packageData = packData.filter(
    (singlePackage) => singlePackage._id === packageId
  );
  return (
    <>
      <div className="text-black max-w-5xl mx-auto flex min-h-[75vh] flex-col gap-3 justify-center">
        <div className="mx-auto p-5 w-full flex justify-center items-center flex-col gap-2">
          <img src={trackedImages.DeliveryImage} className="h-50 w-80" />
          <h2 className="text-center">
            Tracking Number : <span className="font-semibold">{packageId}</span>
          </h2>
          {packageData.map((order) => (
            <div
              key={order.packageId}
              className="flex gap-7 flex-col sm:flex-row p-5 justify-start mt-3 border-2 border-slate-500"
            >
              <div className="flex-1">
                <h2 className="font-semibold text-lg ml-1.5 mb-1">
                  Tracking Status:
                </h2>
                <div className="flex gap-6 justify-start">
                  <div>
                    { order.status === 'CANCELLED' &&
                     <img
                      src={trackedImages.CancelImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    /> }
                    { order.status === 'DELIVERED' &&
                    <img
                      src={trackedImages.ConfirmImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                   { order.status === 'EXCEPTION' && 
                     <img
                      src={trackedImages.DelayImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                   { order.status === 'CREATED' && 
                     <img
                      src={trackedImages.LabelImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                   { order.status === 'IN_TRANSIT' && 
                     <img
                      src={trackedImages.InTransitImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                   { order.status === 'OUT_FOR_DELIVERY' && 
                     <img
                      src={trackedImages.OutForDeliveryImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                   { order.status === 'PICKED_UP' && 
                     <img
                      src={trackedImages.PickedImage}
                      alt="tracking_icons"
                      className="h-18 w-18 rounded-full"
                    />
                   }
                  </div>
                  <div className="flex flex-col justify-center">
                    <h2>
                      {order.status === "CREATED" &&
                        "Label generated; not yet picked up"}
                    </h2>
                    <h2>
                      {order.status === "PICKED_UP" &&
                        "Courier has the package"}
                    </h2>
                    <h2>
                      {order.status === "IN_TRANSIT" &&
                        "Moving between facilities/route stops"}
                    </h2>
                    <h2>
                      {order.status === "OUT_FOR_DELIVERY" &&
                        "On vehicle and en route to final drop"}
                    </h2>
                    <h2>
                      {order.status === "DELIVERED" &&
                        "Delivered to the recipient"}
                    </h2>
                    <h2>
                      {order.status === "EXCEPTION" &&
                        "Delay due to some reasons"}
                    </h2>
                    <h2>
                      {order.status === "CANCELLED" &&
                        "Order has been cancelled"}
                    </h2>
                    <p>
                      Shipping destination is <strong>{order.city}</strong>
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h2 className="font-semibold text-lg mb-1">
                  Products Details:
                </h2>
                <div>
                  <p className="text-md">
                    Consumer's Email :{" "}
                    <strong>{order.consumerEmail.slice(0, -7)}</strong>
                  </p>
                  <p className="text-md">
                    Product : <strong>{order.productDesc}</strong>
                  </p>
                  <p className="text-md">
                    Price : <strong>{order.price} TK</strong>
                  </p>
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
