import React, { useState } from "react";
import axios from "axios";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { Avatar, AvatarImage } from "../ui/avatar";
import { LogOut, User2, Menu, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";
import { setSavedJobs, setSingleJob } from "@/redux/jobSlice";

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logOutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        dispatch(setSavedJobs([]));
        dispatch(setSingleJob(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  const user = useSelector((store) => store.auth.user);

  const navLinks =
    user && user.role === "recruiter" ? (
      <>
        <li>
          <Link to="/admin/companies" onClick={() => setMobileMenuOpen(false)}>
            Companies
          </Link>
        </li>
        <li>
          <Link to="/admin/jobs" onClick={() => setMobileMenuOpen(false)}>
            Jobs
          </Link>
        </li>
      </>
    ) : (
      <>
        <li>
          <Link to="/" onClick={() => setMobileMenuOpen(false)}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/jobs" onClick={() => setMobileMenuOpen(false)}>
            Jobs
          </Link>
        </li>
        <li>
          <Link to="/browse" onClick={() => setMobileMenuOpen(false)}>
            Browse
          </Link>
        </li>
      </>
    );

  return (
    <div className="bg-white">
      <div className="flex items-center justify-between mx-auto max-w-7xl h-16 px-4 md:px-6">
        <div>
          <h1
            className="text-2xl font-bold cursor-pointer flex items-center gap-1 "
            onClick={() => navigate("/")}
          >
            <img src="/favicon.svg" alt="" className="w-8 h-8" />
            Next<span className="text-[#F83002]">Hire</span>
          </h1>
        </div>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-3">
          <ul className="flex font-medium items-center gap-5">{navLinks}</ul>
          {!user ? (
            <div className="flex items-center">
              <Link to="/login">
                <Button variant="Outline" className="cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-[#6A38C2] hover:bg-[#5b30a6] cursor-pointer">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={
                      user?.profile?.profilePhoto ||
                      "https://github.com/shadcn.png"
                    }
                    alt="@shadcn"
                  />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-80 mx-2">
                <div className="flex items-center gap-2">
                  <Avatar className="cursor-pointer">
                    <AvatarImage
                      src={
                        user?.profile?.profilePhoto ||
                        "https://github.com/shadcn.png"
                      }
                      alt="@shadcn"
                    />
                  </Avatar>

                  <div>
                    <h4 className="font-medium">{user?.fullname}</h4>
                    <p className="text-sm text-muted-foreground">
                      {user?.profile?.bio}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col text-gray-600 my-2">
                  {user && user.role === "student" && (
                    <div className="flex w-fit items-center gap-2 ">
                      <User2 />
                      <Button variant="link" className="cursor-pointer">
                        <Link to="/profile">View Profile</Link>
                      </Button>
                    </div>
                  )}

                  <div className="flex w-fit items-center gap-2 cursor-pointer">
                    <LogOut />
                    <Button
                      variant="link"
                      onClick={logOutHandler}
                      className="cursor-pointer"
                    >
                      Logout
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>

        {/* Mobile: hamburger only */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1 rounded-md hover:bg-gray-100 cursor-pointer"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white px-4 pb-4 pt-2">
          {user && (
            <div className="flex items-center gap-3 pb-3 mb-3 border-b border-gray-100">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={
                    user?.profile?.profilePhoto ||
                    "https://github.com/shadcn.png"
                  }
                  alt="@shadcn"
                />
              </Avatar>
              <div>
                <h4 className="font-medium text-sm">{user?.fullname}</h4>
                <p className="text-xs text-muted-foreground">
                  {user?.profile?.bio}
                </p>
              </div>
            </div>
          )}
          <ul className="flex flex-col font-medium gap-3">
            {navLinks}
            {user && user.role === "student" && (
              <li>
                <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                  View Profile
                </Link>
              </li>
            )}
          </ul>
          {!user ? (
            <div className="flex flex-col gap-2 mt-4">
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="Outline" className="w-full cursor-pointer">
                  Login
                </Button>
              </Link>
              <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full bg-[#6A38C2] hover:bg-[#5b30a6] cursor-pointer">
                  Signup
                </Button>
              </Link>
            </div>
          ) : (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logOutHandler();
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 cursor-pointer w-full"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Navbar;
