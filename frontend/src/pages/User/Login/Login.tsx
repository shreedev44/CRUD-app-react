import React, { useState, useContext, useRef, useEffect } from "react";
import "./Login.css";
import { UserContext } from "../../../context/UserContext";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { SetToken } from "../../../redux/Store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import background from "../../../assets/6.jpg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inputType, setInputType] = useState("password");
  const [iconClass, setIconClass] = useState("bi bi-eye-slash");
  const [isLoading, setLoading] = useState(false);

  const iconRef = useRef(null);

  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as string);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value as string);
  };

  useEffect(() => {
    document.body.style.background = `url(${background}) no-repeat center fixed`;
    document.body.style.backgroundSize = "cover";
  }, []);

  const dispatchFun = useDispatch();
  const userContext = useContext(UserContext);
  const navigate = useNavigate();

  const changePasswordVisibility = () => {
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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLengthRegex = /^.{8,}$/;

    if (!email || !password) {
      toast.error(
        `Please provide ${
          !email && !password ? "credentials" : !email ? "email" : "password"
        }`,
        {
          position: "bottom-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      return;
    }

    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    if (!minLengthRegex.test(password)) {
      toast.error("Please enter a valid password", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    setLoading(true)
    const response = await fetch("https://crud-app-api-tau.vercel.app/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      setLoading(false)
      const accessToken: string = data.jwtToken;
      Cookies.set("accessToken", accessToken, {
        path: "/",
        sameSite: "None",
        secure: true,
      });
      if (accessToken) {
        setEmail("");
        setPassword("");
        dispatchFun(SetToken(accessToken));
        userContext?.setAuth(true);
      }
    } else {
      setLoading(false)
      toast.error(data.message, {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <div className="mt-5 pt-5 Login">
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
              <h2 className="text-center mt-3 mb-4 text-light">Sign In</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-control rounded-1 d-grid my-2">
                  <input
                    value={email}
                    onChange={onChangeEmail}
                    type="text"
                    className="user"
                    placeholder="Email"
                  />
                </div>
                <div className="">
                  <p></p>
                </div>
                <div className="form-control rounded-1 d-grid pass">
                  <input
                    type={inputType}
                    value={password}
                    onChange={onChangePassword}
                    className="border-0"
                    placeholder="Password"
                  />
                  <i
                    onClick={changePasswordVisibility}
                    ref={iconRef}
                    className={iconClass}
                  ></i>
                </div>
                <div className="text-center d-grid">
                  <button
                    type="submit"
                    className={"btn btn-lg btn-dark mt-4 mb-2 mx-5 py-2 rounded-pill login-button d-flex justify-content-center"}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="loader">
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                      </div>
                    ) : (
                      "Sign In"
                    )}
                  </button>
                </div>
                <div className="text-center">
                  <span>Don't have an account? </span>
                  <a
                    style={{ cursor: "pointer" }}
                    className="link-danger "
                    onClick={() => navigate("/signup")}
                  >
                    Sign Up
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
