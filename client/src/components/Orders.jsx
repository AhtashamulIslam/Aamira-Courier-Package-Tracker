import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";
import { useSelector } from "react-redux";

const Orders = () => {
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
  }, []);
  
  return (
    <>
      <div className="mt-3 mx-auto max-w-4xl">
        <h1 className=" text-slate-800 text-4xl font-bold mb-5">All Orders</h1>
        <div>
          {packages.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Orders;
