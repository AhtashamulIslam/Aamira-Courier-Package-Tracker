import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";

function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success === false) {
        setError(data.message);
        return;
      }
      if(res.ok){
        setError(null)
        navigate('/sign-in')
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col px-8 sm:px-12 mt-10 max-w-5xl mx-auto min-h-[80vh]
    md:flex-row md:p-3 md:items-center gap-10">
      <div className="flex-1">
        <Link to="/" className="text-6xl dark:text-white font-bold">
          <span className="rounded-lg text-slate-500 dark:text-white">
            Aamira
          </span>
          <span className="text-slate-700">Tracking</span>
        </Link>
        <p className="text-sm mt-5 text-slate-600">
          This is a personal project. You can sign up with your email and
          password or with Google. You can find your dream destiny from our
          website. Share this to others to promote advertise.
        </p>
      </div>
      <div className="flex-1">
        <h1 className="text-4xl text-center font-semibold my-7">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="username"
            className="border border-slate-300 focus:outline-blue-300 rounded-lg p-3"
            id="username"
            onChange={handleChange}
          />
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
            
            className="cursor-pointer p-3 rounded-lg bg-slate-700
                       text-white hover:opacity-90 uppercase disabled:opacity-80"
          >
            sign up
          </button>
        </form>
        <div className="flex gap-2 mt-4 justify-center">
          <p>Have an account?</p>
          <Link to="/sign-in">
            <span className="text-blue-700">Sign in</span>
          </Link>
        </div>
         {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
       
    </div>
  );
}

export default SignUp;
