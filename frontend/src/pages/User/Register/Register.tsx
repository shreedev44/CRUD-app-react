import React, { useState, useReducer, useEffect } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import background from "../../../assets/6.jpg"

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confPassword, setConfPassword] = useState("");
  const [iconClass, setIconClass] = useState({password: 'bi bi-eye-slash', confPassword: 'bi bi-eye-slash'})
  const [inputType, setInputType] = useReducer((prevState: {password: string, confPassword: string}, action: string) => {
    if(action === 'password') {
      if(prevState.password === 'password') {
        setIconClass({...iconClass, password: 'bi bi-eye'})
        return {
          ...prevState, password: 'text'
        }
      } else {
        setIconClass({...iconClass, password: 'bi bi-eye-slash'})
        return {
          ...prevState, password: 'password'
        }
      }
    } else {
      if(prevState.confPassword === 'password') {
        setIconClass({...iconClass, confPassword: 'bi bi-eye'})
        return {
          ...prevState, confPassword: 'text',
        }
      } else {
        setIconClass({...iconClass, confPassword: 'bi bi-eye-slash'})
        return {
          ...prevState, confPassword: 'password'
        }
      }
    }
  }, {password: "password", confPassword: "password"})

  const onChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value as string);
  };
  const onChangeEmail = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value as string);
  };
  const onChangePassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value as string);
  };
  const onChangeConfPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfPassword(event.target.value as string);
  };

  useEffect(() => {
    document.body.style.background = `url(${background}) no-repeat center fixed`
    document.body.style.backgroundSize = 'cover'
  }, [])

  const navigate = useNavigate();

  const errorToast = (message: string) => {
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

  const changePasswordVisibility = (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    event: any
  ) => {
    event.preventDefault()
    if (event.target.id === 'password') {
      setInputType('password');
      
    } else {
      setInputType("confPassword");
    }

    
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLengthRegex = /^.{8,}$/;

    if (!name) return errorToast("Please provide your name");
    if (!email) return errorToast("Please provide your email");
    if (!password) return errorToast("Please provide password");
    if (!confPassword) return errorToast("Please re-enter your password");

    if (!nameRegex.test(name))
      return errorToast("Please enter a valid name (A - Z)");
    if (!emailRegex.test(email))
      return errorToast("Please enter a valid email");
    if (!minLengthRegex.test(password))
      return errorToast("Password must contain atleast 8 characters");
    if (password !== confPassword)
      return errorToast("Passwords does not match");

    const response = await fetch("https://crud-app-api-tau.vercel.app/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message, {
        position: "top-center",
        autoClose: 2000,
        onClose: () => navigate("/login"),
      });
    } else {
      errorToast(data.message);
    }
  };

  return (
    <div className="mt-2 pt-1 Register">
      <ToastContainer />
      <div className="row container-fluid m-auto">
        <div className="col-12 col-sm-8 col-md-8 col-lg-4 m-auto container-fluid pt-5">
          <div id="card" className="card rounded-5 mt-5">
            <div className="card-body">
              <div className="d-flex justify-content-center">
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
              <div className="h2 text-center mb-4 text-light">Sign Up</div>
              <form onSubmit={handleSubmit}>
                <div className="form-control rounded-1 d-grid mb-2">
                  <input
                    value={name}
                    onChange={onChangeName}
                    type="text"
                    className="border-0"
                    placeholder="Name"
                  />
                </div>
                <div className="">
                  <p></p>
                </div>
                <div className="form-control rounded-1 d-grid mb-2">
                  <input
                    value={email}
                    onChange={onChangeEmail}
                    type="text"
                    className="border-0"
                    placeholder="Email"
                  />
                </div>
                <div className="">
                  <p></p>
                </div>
                <div className="form-control rounded-1 d-grid pass mb-2">
                  <input
                    value={password}
                    onChange={onChangePassword}
                    type={inputType.password}
                    className="border-0"
                    placeholder="Password"
                  />
                  <i onClick={changePasswordVisibility} id="password" className={iconClass.password}></i>
                </div>
                <div className="form-control rounded-1 d-grid pass">
                  <input
                    value={confPassword}
                    onChange={onChangeConfPassword}
                    type={inputType.confPassword}
                    className="border-0"
                    placeholder="Confirm Password"
                  />
                  <i onClick={changePasswordVisibility} id="conf-password" className={iconClass.confPassword}></i>
                </div>
                <div className="">
                  <p></p>
                </div>
                <div className="text-center d-grid">
                  <button
                    type="submit"
                    className="btn btn-lg btn-dark mt-4 mb-2 mx-5 py-2 rounded-pill login-button"
                  >
                    Sign Up
                  </button>
                </div>
                
                
                <div className="text-center">
                  <span className="">Already a user? </span>
                  <a style={{cursor: 'pointer'}} className="link-danger" onClick={() => navigate('/login')}>
                    Login
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

export default Register;
