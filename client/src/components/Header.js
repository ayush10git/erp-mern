import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { server } from "../redux/api/userApi";

const Header = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  // console.log("accessToken: ", accessToken)

  const logoutHandler = async () => {
    try {
      await axios.post(
        `${server}/api/v1/users/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("selectedDate");
      toast.success("Logged Out Successfully")
      navigate("/");
    } catch (error) {
      toast.error("error loggin out");
    }
  };

  return (
    <header>
      <div className="heading">
        <h2>Attendance</h2>
      </div>
      <div className="features">
        <button onClick={logoutHandler}>
          <RiLogoutCircleRLine />
        </button>
      </div>
    </header>
  );
};

export default Header;
