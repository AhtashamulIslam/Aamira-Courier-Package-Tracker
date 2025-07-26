import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const TrackingStatus = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const res = await fetch(`/api/aamira/get-packages/${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setPackages(data);
        }
      } catch (error) {
        console.error("Error fetching package data:", error);
      }
    };
    fetchPackages();

    const interval = setInterval(fetchPackages, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="p-10">
      <h1 className=" text-slate-800 text-4xl font-bold mb-5">
        Tracking Status
      </h1>
      <div
        className="w-full max-w-5xl text-left border border-gray-300 
            rounded-lg max-h-screen overflow-y-scroll mt-3 p-5"
      >
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-4 text-gray-800 font-semibold">
                Package ID
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold max-sm:hidden">
                Product Image
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold max-sm:hidden">
                Product Title
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold max-sm:hidden">
                Price
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold max-sm:hidden">
                Consumer's Email
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold">
                Destination
              </th>
              <th className="py-3 px-4 text-gray-800 font-semibold text-center">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {packages.map((item, index) => (
              <tr key={index}>
                <td className="py-3 px-4 text-gray-700 border-t font-medium border-gray-300">
                  {item.packageId}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t font-medium border-gray-300 max-sm:hidden">
                  <img
                    src={item.productImage[0][0]}
                    alt="Product_image"
                    width="80px"
                  />
                </td>
                <td className="py-3 px-4 text-gray-700 border-t font-medium uppercase border-gray-300 max-sm:hidden">
                  {item.productDesc}
                </td>
                <td className="py-3 px-4 text-gray-700 border-t font-medium border-gray-300 max-sm:hidden">
                  {item.price}TK
                </td>
                <td className="py-3 px-4 text-gray-700 border-t font-medium border-gray-300 max-sm:hidden">
                  {item.consumerEmail.slice(0, -7)}
                </td>
                <td className="py-3 px-4 text-gray-700 text-sm border-t font-medium border-gray-300">
                  {item.city}
                </td>
                <td className="py-3 px-4 border-t font-semibold border-gray-300 ">
                  {item.status === "CREATED" && (
                    <span className="bg-purple-500 px-1 rounded-md text-white">
                      labeled
                    </span>
                  )}
                  {item.status === "PICKED_UP" && (
                    <span className="bg-slate-500 px-1 rounded-md text-white">
                      picked_up
                    </span>
                  )}
                  {item.status === "IN_TRANSIT" && (
                    <span className="bg-yellow-500 px-1 rounded-md text-white">
                      in_transit
                    </span>
                  )}
                  {item.status === "OUT_FOR_DELIVERY" && (
                    <span className="bg-blue-500 px-1 rounded-md text-white">
                      out_for_delivery
                    </span>
                  )}
                  {item.status === "DELIVERED" && (
                    <span className="bg-green-700 px-1 rounded-md text-white">
                      delivered
                    </span>
                  )}
                  {item.status === "CANCELLED" && (
                    <span className="bg-red-700 px-1 rounded-md text-white">
                      cancelled
                    </span>
                  )}
                   {item.status === "EXCEPTION" && (
                    <span className="bg-black px-1 rounded-md text-white">
                      exception
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TrackingStatus;
