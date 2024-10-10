import { createContext, ReactNode, useLayoutEffect, useState } from "react";
import { UserAuth } from "../auth/userAuth";
import { useDispatch, useSelector } from "react-redux";
import { SetToken, UpdateUser } from "../redux/Store";
import Cookies from "js-cookie";

export interface Context {
  isAuth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  logout: () => void;
}

const UserContext = createContext<Context | null>(null);

const UserContextProvider = ({ children }: { children: ReactNode }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = useSelector((state: any) => state.userToken);
  const dispatchFun = useDispatch();

  const [isAuth, setAuth] = useState<boolean>(accessToken ? true : false);

  useLayoutEffect(() => {
    const checkAuth = async () => {
      const newAccessToken = await UserAuth(accessToken);

      if (newAccessToken) {
        dispatchFun(SetToken(await newAccessToken));
        Cookies.set("accessToken", await newAccessToken, {
          path: "/",
          sameSite: "None",
          secure: true,
        });
        try {
          const response = await fetch("http://localhost:3000/fetch-user", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          });

          if (response.status === 401) {
            checkAuth();
          } else if (response.status === 404) {
            logout();
          } else {
            const data = await response.json();
            dispatchFun(UpdateUser(data.userData));
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        logout();
      }
    };

    checkAuth();
  }, [isAuth]);

  const logout = () => {
    dispatchFun(SetToken(null));
    dispatchFun(UpdateUser(null));
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setAuth(false);
  };

  return (
    <UserContext.Provider value={{ isAuth, setAuth, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserContextProvider };
