import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddOrder = () => {
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const localDateTime = ()=> new Date().toISOString();
  const navigate = useNavigate();
  let timeStamp;
  useEffect(()=>{
       timeStamp = localDateTime();
  })

  const [productImage, setProductImage] = useState({
    1: null
  });

  const [inputs, setInputs] = useState({
    packageId:'',
    consumerEmail:'',
    city:'',
    productDesc:'',
    price: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !inputs.packageId ||
      !inputs.consumerEmail ||
      !inputs.city ||
      !inputs.productDesc ||
      !inputs.price ||
      !Object.values(productImage).some((image) => image)
    ) {
      toast.error("Please fill all the fields and upload all images.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("packageId", inputs.packageId);
      formData.append("consumerEmail", inputs.consumerEmail);
      formData.append("city", inputs.city);
      formData.append("eventTimeStamp",timeStamp);
      formData.append("productDesc", inputs.productDesc);
      formData.append("price", inputs.price);
      Object.keys(productImage).forEach((key) => {
        productImage[key] && formData.append("productImage", productImage[key]);
      });
      const { data } = await axios.post(
        `/api/aamira/create-package/${currentUser._id}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );

      if (data.success === false) {
        toast.error("Failed to create a package");
      }
      if (data === "Package created successfully") {
        toast.success("Package created successfully");
        setInputs({
          packageId:'',
          consumerEmail:'',
          city:'',
          productDesc:'',
          price: 0
        });
        setProductImage({
            1:null,
        })
        navigate('/dashboard/add-order');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="max-w-3xl sm:mx-auto w-full p-4">
      <h1 className="text-4xl font-bold text-gray-700">
        Add an Order to be tracked
      </h1>
      <form className="mt-5 w-full mb-5" onSubmit={handleSubmit}>
        <p className="text-gray-600 font-semibold mt-10">Product Image</p>
        <div className="grid grid-cols-2 gap-4 my-2 sm:flex flex-wrap">
          {Object.keys(productImage).map((key, index) => (
            <label htmlFor={`productImage${key}`} key={key}>
              <img
                className="max-h-30 cursor-pointer opacity-80"
                src={
                  productImage[key]
                    ? URL.createObjectURL(productImage[key])
                    : assets.uploadArea
                }
                alt={`Product Image ${key}`}
              />
              <input
                type="file"
                accept="image/*"
                id={`productImage${key}`}
                hidden
                onChange={(e) =>
                  setProductImage({ ...productImage, [key]: e.target.files[0] })
                }
              />
            </label>
          ))}
        </div>
        <div className="flex flex-col sm:gap-4 mt-6 items-start">
        <div>
            <p className="max-sm:mt-4 font-semibold max-sm:text-center text-gray-600">
              PackageId:
            </p>
            <input
              type="text"
              placeholder="PKG23456"
              className="border border-gray-300 mt-2 rounded p-2 w-full sm:w-85 text-gray-700"
              required
              value={inputs.packageId}
              onChange={(e) =>
                setInputs({ ...inputs, packageId: e.target.value })
              }
            />
          </div>
          <div>
            <p className="max-sm:mt-4 font-semibold max-sm:text-center text-gray-600">
              Buyer's Email:
            </p>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 mt-2 rounded p-2 w-full sm:w-85 text-gray-700"
              required
              value={inputs.consumerEmail}
              onChange={(e) =>
                setInputs({ ...inputs, consumerEmail: e.target.value })
              }
            />
          </div>
          <div>
            <p className="max-sm:mt-4 font-semibold max-sm:text-center text-gray-600">
              City:
            </p>
            <input
              type="text"
              placeholder="Location"
              className="border border-gray-300 mt-2 rounded p-2 w-full sm:w-85 text-gray-700"
              value={inputs.city}
              onChange={(e) => setInputs({ ...inputs, city: e.target.value })}
            />
          </div>
          <div>
            <p className="max-sm:mt-4 font-semibold max-sm:text-center text-gray-600">
              Product's Description:
            </p>
            <textarea
              id="textpost"
              placeholder="Write something..."
              className="h-25 border border-gray-300 mt-2 rounded p-2 w-full sm:w-85 text-gray-700"
              required
              value={inputs.productDesc}
              onChange={(e) => {
                setInputs({ ...inputs, productDesc: e.target.value });
              }}
            />
          </div>
          <div>
            <p className="max-sm:mt-4 font-semibold max-sm:text-center text-gray-600">
              Product's Price:
            </p>
            <input
              type="number"
              placeholder="0"
              className="border border-gray-300 mt-2 rounded p-2 w-full sm:w-85 text-gray-700"
              value={inputs.price}
              onChange={(e) => {
                setInputs({ ...inputs, price: e.target.value });
              }}
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-8 py-2 sm:w-85 rounded mt-6 mb-8"
          disabled={loading}
        >
          {loading ? "Adding ..." : "Add Order"}
        </button>
      </form>
    </div>
  );
};

export default AddOrder;
