import {Link,useNavigate} from 'react-router-dom'
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signInSuccess,signInStart,signInFailure } from '../redux/user/userSlice';
import toast from 'react-hot-toast';

function SignIn() {
  
  const [formData, setFormData] = useState({});
  const [loading,setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(signInStart())
    setLoading(true)
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        toast.error('Failed to signed in')
        return;
      }
      if(res.ok){
        dispatch(signInSuccess(data));
        toast.success("Signed in successfully");
        navigate('/')
      }
    } catch (error) {
     dispatch(signInFailure(error.message))
     toast.error(error.message)
    }finally{
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-8 sm:px-12 max-w-5xl min-h-[80vh] mx-auto md:flex-row 
    md:p-3 md:items-center gap-10">
      <div className="flex-1">
        <Link to="/" className="text-6xl font-bold">
          <span className="rounded-lg text-slate-500">
            Aamira
          </span>
          <span className="text-slate-700">Tracking</span>
        </Link>
        <p className="text-sm mt-5 text-slate-600">
          This is a personal project. You can sign up with your email and
          password or with Google. You can track orders from our
          website. Share this to others to promote advertise.
        </p>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl text-center font-semibold my-7">Sign In</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
         
          <input
            type="email"
            placeholder="email"
            className="border border-slate-300 focus:outline-blue-300 rounded-lg p-3"
            id="email"
            onChange={handleChange}
          />
          <input
            type="password"
            placeholder="password"
            className="border border-slate-300 focus:outline-blue-300 rounded-lg p-3"
            id="password"
            onChange={handleChange}
          />
          <button
            disabled={loading}
            className="cursor-pointer p-3 rounded-lg bg-slate-700
                       text-white hover:opacity-90 uppercase disabled:opacity-80"
          >
            { loading ? 'Loading' : ' sign in'}
           
          </button>
        </form>
        <div className="flex gap-2 mt-4 justify-center">
          <p>Don't have an account?</p>
          <Link to="/sign-up">
            <span className="text-blue-700">Sign up</span>
          </Link>
        </div>
      </div>
       
    </div>
  );
}

export default SignIn