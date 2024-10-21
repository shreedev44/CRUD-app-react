import { useContext, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserContext } from "../../../context/UserContext";
import './Home.css'
import { useNavigate } from "react-router-dom";
import background from "../../../assets/7.jpg"
import pic from "../../../assets/unknown.jpg"
import Loader from "../../../components/Loader/Loader";

const Home = () => {
  const userContext = useContext(UserContext);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const user = useSelector((state: any) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.background = `url(${background}) no-repeat center fixed`
    document.body.style.backgroundSize = 'cover'
  }, [])

  return (

    <>
      <nav className="navbar navbar-dark bg-transparent">
        <form className="container-fluid justify-content-end">
          <a className="btn btn-outline-light mx-2" onClick={() => navigate('/profile')}>Edit Profile</a>
          <a className="btn btn-outline-danger mx-2" onClick={userContext?.logout}>
            Logout
          </a>
        </form>
      </nav>
      <div className="text-center text-light center-div py-3 Home">
        <div className="container border-2  border-light w-50 py-5 pt-5">
          <h4 className="wel">Welcome</h4>
          <h1 className="user d-flex justify-content-center">{user?.name ? user?.name : (
            <div className="loader">
            <div className="loader-inner">
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
              <div className="loader-block"></div>
            </div>
          </div>
          )}</h1>
          <h3 className="">{user?.email}</h3>
        </div>
      </div>
      <div className="container-fluid py-3 justify-content-center text-center brand-div w-75">
        {
          user?.imageURL ? (
            <img src={user?.imageURL === 'none' ? pic : user?.imageURL} className="w-25 rounded border border-light border-3" alt="" />
          ) : (
            <Loader />
          )
        }
      </div>
    </>
  );
};

export default Home;
