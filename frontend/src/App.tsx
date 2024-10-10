import "./App.css";
import { useContext } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import Login from "./pages/User/Login/Login";
import Register from "./pages/User/Register/Register";
import Home from "./pages/User/Home/Home";
import Profile from "./pages/User/Profile/Profile";
import AdminLogin from "./pages/Admin/Login/AdminLogin";
import AdminDashboard from "./pages/Admin/Dashboard/AdminDashboard";
import {
  UserContextProvider,
  Context,
  UserContext,
} from "./context/UserContext";
import { AdminContextProvider, AdminContext } from "./context/AdminContext";
import store from "./redux/Store";
import { Provider } from "react-redux";

const UserRoutes = () => {
  const userContext: Context | null = useContext(UserContext);

  return (
    <Routes>
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="" element={<Navigate to="/login" />} />
      <Route
        path="login"
        element={userContext?.isAuth ? <Navigate to="/home" /> : <Login />}
      />
      <Route
        path="signup"
        element={userContext?.isAuth ? <Navigate to="/home" /> : <Register />}
      />
      <Route
        path="home"
        element={userContext?.isAuth ? <Home /> : <Navigate to="/login" />}
      />
      <Route
        path="profile"
        element={userContext?.isAuth ? <Profile /> : <Navigate to="/login" />}
      />
    </Routes>
  );
};

const AdminRoutes = () => {

  const adminContext = useContext(AdminContext);

  return (
    <Routes>
      <Route path="" element={<Navigate to={"/admin/login"} />} />
      <Route path='login' element={adminContext?.isAuth? <Navigate to={'/admin/dashboard'}/> : <AdminLogin />} />
      <Route path='dashboard' element={adminContext?.isAuth? <AdminDashboard/> : <Navigate to={'/admin/login'}/>}  />
    </Routes>
  );
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <Provider store={store}>
                <UserContextProvider>
                  <UserRoutes />
                </UserContextProvider>
              </Provider>
            }
          />

          <Route 
          path="/admin/*"
          element={
            <Provider store={store}>
              <AdminContextProvider>
                <AdminRoutes />
              </AdminContextProvider>
            </Provider>
          }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
