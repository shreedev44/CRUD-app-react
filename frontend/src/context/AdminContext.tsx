import { createContext, ReactNode, useLayoutEffect, useState } from "react";
import { AdminAuth } from "../auth/adminAuth";
import { useDispatch, useSelector } from "react-redux";
import { SetAdminToken, UpdateAdmin } from "../redux/Store";
import Cookies from "js-cookie";

export interface Context {
  isAuth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const AdminContext = createContext<Context | null>(null);

const AdminContextProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = useSelector((state: any) => state.adminToken);
  const dispatchFun = useDispatch();

  const [isAuth, setAuth] = useState<boolean>(accessToken ? true : false);

  useLayoutEffect(() => {
    const checkAdminAuth = async () => {
      const newAccessToken = await AdminAuth(accessToken);
      if (newAccessToken) {
        dispatchFun(SetAdminToken(await newAccessToken));
        Cookies.set("adminAccessToken", await newAccessToken, {
            path: "/",
            sameSite: "None",
            secure: true,
        });

        try {
          const response = await fetch("http://localhost:3000/admin/fetch-admin", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          const data = await response.json();
          if (response.status === 401) {
            checkAdminAuth();
          } else if (response.status === 404) {
            logout();
          } else if (response.ok) {
            dispatchFun(UpdateAdmin(data.adminData));
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        logout();
      }
    };
    checkAdminAuth();
  }, [isAuth]);

  const logout = () => {
    dispatchFun(SetAdminToken(null));
    dispatchFun(UpdateAdmin(null));
    Cookies.remove("adminAccessToken");
    Cookies.remove("adminRefreshToken");
    setAuth(false);
  };

  return (
    <AdminContext.Provider value={{isAuth, setAuth, logout}}>
        {children}
    </AdminContext.Provider>
  )
};


export {
    AdminContext,
    AdminContextProvider,
}