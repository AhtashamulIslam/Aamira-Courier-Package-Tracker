import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { signOutSuccess } from "../redux/user/userSlice.js";
import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen,setIsMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const res = await fetch(`/api/user/signout`, {
        method: "POST"
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signOutSuccess());
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <header className="bg-slate-700 text-white py-6 px-6">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="text-3xl font-semibold">
          <span className="px-3 py-2 bg-black rounded-lg text-orange-500 mr-1">
            Aamira
          </span>
          Tracker
        </Link>
        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden md:inline  hover:text-black">Home</li>
          </Link>
          { currentUser && currentUser.isAdmin &&
            <Link to="/dashboard">
              <li className="hidden md:inline hover:text-black">Dashboard</li>
            </Link>
          }

          {currentUser ? (
            <li
              onClick={handleSignOut}
              className=" hover:text-black hidden md:inline cursor-pointer"
            >
              SignOut
            </li>
          ) : (
            <Link to="/sign-in">
              <li className=" hover:text-black hidden md:inline cursor-pointer">SignIn</li>
            </Link>
          )}
        </ul>
        <div className="flex items-center gap-4 md:hidden">
        <img
          src={assets.menuIcon}
          alt="menu_icon"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className='h-4'
        />
      </div>
        <div
        className={`fixed top-0 left-0 w-full h-screen z-10 bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close_icon" className="h-6.5" />
        </button>

        {currentUser && currentUser.isAdmin &&
            <button
              onClick={() => {
                navigate("/dashboard");
                setIsMenuOpen(false);
              }}
              className='border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all'
            >
              Dashboard
            </button>
    
          }
           {currentUser &&
            <button
              onClick={() => {
                handleSignOut()
                navigate("/");
                setIsMenuOpen(false);
              }}
              className='border px-4 py-1 text-sm font-light rounded-full cursor-pointer transition-all'
            >
              Sign Out
            </button>
    
          }

        {!currentUser && (
          <Link to="/sign-in">
            <button
              onClick={()=>{
                setIsMenuOpen(false)
              }}
              className="bg-black text-white px-8 py-2.5 rounded-full 
                    ml-4 transition-all duration-500"
            >
              Sign in
            </button>
          </Link>
        )}
      </div>
      </div>
    </header>
  );
};

export default Navbar;
