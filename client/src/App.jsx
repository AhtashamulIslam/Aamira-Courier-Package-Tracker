import Navbar from "./components/Navbar";
import Orders from "./components/Orders";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import TrackOrder from "./components/TrackOrder";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import AddOrder from "./pages/AddOrder";
import {Toaster} from "react-hot-toast"
import TrackingStatus from "./components/TrackingStatus";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} >
          <Route index element={<Orders />} />
          <Route path="add-order" element={<AddOrder />} />
          <Route path="tracking-status" element={<TrackingStatus />} />
          </Route>
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
         <Route path="/track/:packageId" element={<TrackOrder />} />
        </Route>
        </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
