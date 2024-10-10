import React, { useContext, useEffect, useState } from "react";
import "./AdminLogin.css";
import { ToastContainer, toast } from "react-toastify";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { SetAdminToken } from "../../../redux/Store";
import { AdminContext } from "../../../context/AdminContext";

const AdminLogin = () => {
  useEffect(() => {
    document.body.style.background =
      "url('/src/assets/10.jpg') no-repeat center fixed";
    document.body.style.backgroundSize = "cover";
  }, []);

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [inputType, setInputType] = useState<string>("password");
  const [iconClass, setIconClass] = useState<string>("bi bi-eye-slash");

  const onEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as string);
  };
  const onPasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value as string);
  };

  const dispatchFun = useDispatch();
  const adminContext = useContext(AdminContext);

  const handlePasswordVisibility = () => {
    if (inputType === "password") {
      setInputType("text");
      setIconClass("bi bi-eye");
    } else {
      setInputType("password");
      setIconClass("bi bi-eye-slash");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const toastError = (message: string) => {
      toast.error(message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLengthRegex = /^.{8,}$/;

    if (!email) return toastError("Please provide an email");
    if (!password) return toastError("Please provide your password");
    if (!emailRegex.test(email))
      return toastError("Please enter a valid email");
    if (!minLengthRegex.test(password)) return toastError("Password must be min 8 Characters");

    const response = await fetch("http://localhost:3000/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      const accessToken: string = data.jwtToken;
      Cookies.set("adminAccessToken", accessToken, {
        path: "/",
        sameSite: "None",
        secure: true,
      });
      if (accessToken) {
        setEmail("");
        setPassword("");
        dispatchFun(SetAdminToken(accessToken));
        adminContext?.setAuth(true);
      }
    } else {
      toastError(data.message);
    }
  };

  return (
    <div className="mt-5 pt-5 Admin-login">
      <ToastContainer />
      <div className="row container-fluid m-auto">
        <div className="col-12 col-sm-8 col-md-8 col-lg-4 m-auto container-fluid pt-5">
          <div id="card" className="card rounded-5 mt-5">
            <div className="card-body">
              <div className="d-flex justify-content-center mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="50"
                  height="50"
                  fill="white"
                  className="bi bi-person-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path
                    fill-rule="evenodd"
                    d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"
                  />
                </svg>
              </div>
              <div className="h2 text-center mt-3 mb-4 text-light">
                Admin Login
              </div>
              <form onSubmit={handleSubmit}>
                <div className="form-control rounded-1 d-grid my-2">
                  <input
                    type="text"
                    className="my-2 user"
                    placeholder="Email"
                    value={email}
                    onChange={onEmailChange}
                  />
                </div>
                <div className="">
                  <p></p>
                </div>
                <div className="form-control rounded-1 d-grid pass">
                  <input
                    type={inputType}
                    className="my-2 border-0"
                    placeholder="Password"
                    value={password}
                    onChange={onPasswordChange}
                  />
                  <i
                    className={iconClass}
                    onClick={handlePasswordVisibility}
                  ></i>
                </div>
                <div className="text-center d-grid">
                  <button
                    type="submit"
                    className="btn btn-lg btn-dark mt-4 mb-2 mx-5 py-2 rounded-pill login-button"
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
