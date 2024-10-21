import React, { useState, useEffect, useRef, useContext } from "react";
import "./Profile.css";
import { useSelector, useDispatch } from "react-redux";
import { UpdateUser } from "../../../redux/Store";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { UserAuth } from "../../../auth/userAuth";
import { UserContext } from "../../../context/UserContext";
import background from "../../../assets/7.jpg"
import pic from "../../../assets/unknown.jpg"
import Loader from "../../../components/Loader/Loader";

const Profile = () => {
  useEffect(() => {
    document.body.style.background =
      `url(${background}) no-repeat center fixed`;
    document.body.style.backgroundSize = "cover";
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);
  const userContext = useContext(UserContext)

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [imageURL, setImageURL] = useState<string>('');
  const [isLoading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    setName(user?.name)
    setEmail(user?.email)
    setImageURL(user?.imageURL)
  },[user])

  const fileInputRef = useRef(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let accessToken = useSelector((state: any) => state.userToken);
  const dispatchFun = useDispatch();

  const navigate = useNavigate();

  const handleImage = () => {
    if (fileInputRef && isEditing) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-expect-error
      fileInputRef?.current?.click();
    }
  };
  

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = () => {
        setImageURL(reader.result as string);
      };
      reader.onerror = (err) => console.log(err);
    }
  };

  const handleEdit = async (event: React.FormEvent) => {
    event.preventDefault();

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

    if (isEditing) {
      const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!nameRegex.test(user?.name)) {
        return errorToast("Please enter a valid name (A - Z)");
      }
      if (!emailRegex.test(user?.email)) {
        return errorToast("Please enter a valid email");
      }

      if (
        name === user?.name &&
        email === user?.email &&
        imageURL === user?.imageURL
      ) {
        return errorToast("Cannot update without changes");
      }

      setLoading(true)
      accessToken = await UserAuth(accessToken);
      const response = await fetch("https://crud-app-api-tau.vercel.app/update-profile", {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({name, email, imageURL}),
      });

      const data = await response.json();

      if (response.ok) {
        setLoading(false)
        toast.success(data.message, {
          position: "top-center",
          autoClose: 2000,
        });
        dispatchFun(UpdateUser({name, email, imageURL}))
      } else {
        setLoading(false)
        return errorToast(data.message);
      }
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
      <ToastContainer />
      <header className="container-fluid d-flex mt-2 justify-content-between">
        <a
          className="btn btn-outline-light mx-2"
          onClick={() => navigate("/home")}
        >
          Back to Home
        </a>
        <a className="btn btn-outline-danger mx-2" onClick={userContext?.logout}>
            Logout
        </a>
      </header>
      <div className="mt-2 pt-1 Profile">
        <div className="row container-fluid m-auto">
          <div className="col-12 col-sm-8 col-md-8 col-lg-4 m-auto container-fluid pt-5 mt-5">
            <div id="card" className="card rounded-5 mt-5">
              <div className="card-body">
                <h2 className="text-center mb-4 text-light">
                  {isEditing ? "Edit Profile" : "Profile"}
                </h2>
                <div className="d-flex justify-content-center">
                  {imageURL ? (
                    <img
                      className={`img-fluid w-25 rounded ${
                        imageURL === "none" ? "opacity-75" : ""
                      }`}
                      src={
                        imageURL === "none" ? pic : imageURL
                      }
                      alt="image"
                      onClick={handleImage}
                    />
                  ) : (
                    <div className="mt-5 pt-5">
                      <div className="m-5 pt-5">
                        <Loader />
                      </div>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                  {isEditing && imageURL !== "none" ? (
                    <button
                      className="btn btn-dark"
                      onClick={() => {
                        setImageURL('none')
                      }}
                    >
                      Remove photo
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                {name ? (
                <form>
                  <div className="form-control rounded-1 d-grid my-2">
                    <input
                      type="text"
                      className="my-2 user"
                      placeholder="Name"
                      disabled={!isEditing}
                      value={name}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setName(event.target.value)
                      }
                    />
                  </div>
                  <div className="">
                    <p></p>
                  </div>

                  <div className="">
                    <p></p>
                  </div>

                  <div className="form-control rounded-1 d-grid mb-2">
                    <input
                      type="text"
                      className="my-2 border-0"
                      placeholder="Email"
                      disabled={!isEditing}
                      value={email}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                        setEmail(event.target.value)
                      }
                    />
                  </div>
                  <div className="">
                    <p></p>
                  </div>

                  <div className="">
                    <p></p>
                  </div>

                  <div className="text-center d-grid">
                    <button
                      type="submit"
                      className={"btn btn-lg btn-dark mt-4 mb-2 mx-5 py-2 rounded-pill login-button d-flex justify-content-center"}
                      disabled={isLoading}
                      onClick={handleEdit}
                    >
                      {isEditing && !isLoading ? "Update" : (isLoading ? (
                        <div className="loader">
                          <span className="bar"></span>
                          <span className="bar"></span>
                          <span className="bar"></span>
                      </div>
                      ) : "Edit Profile")}
                    </button>
                  </div>
                  <div className="text-center d-grid">
                    {isEditing ? (
                      <button 
                      className="btn btn-outline-danger mt-4 mb-2 mx-5 py-2"
                      onClick={() => setIsEditing(false)}
                      >Cancel</button>
                    ): <></>}
                  </div>
                </form>
                ) : (<></>)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
