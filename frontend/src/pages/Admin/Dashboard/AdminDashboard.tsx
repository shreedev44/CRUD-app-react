import React, { useLayoutEffect, useContext, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AdminContext } from "../../../context/AdminContext";
import UserCard from "../../../components/UserCard/UserCard";
import { AdminAuth } from "../../../auth/adminAuth";
import { SetAdminToken } from "../../../redux/Store";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import ModalForm from "../../../components/Modal/Modal";
import { UserBody } from "../../../types";

const AdminDashboard = () => {
  const [users, setUsers] = useState<object[] | null>([]);
  const [filteredUsers, setFilteredUser] = useState<object[] | null>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<UserBody | null>(null);
  const [dependency, setDependency] = useState<Array<[]>>([])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = useSelector((state: any) => state.adminToken);
  const dispatchFun = useDispatch();

  const adminContext = useContext(AdminContext);

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

  useLayoutEffect(() => {
    document.body.style.background =
      "url('/src/assets/10.jpg') no-repeat center fixed";
    document.body.style.backgroundSize = "cover";

    const getUsers = async () => {
      const newAccessToken = await AdminAuth(accessToken);
      if (newAccessToken) {
        dispatchFun(SetAdminToken(newAccessToken));
        Cookies.set("adminAccessToken", newAccessToken);

        const response = await fetch(
          "https://crud-app-api-tau.vercel.app/admin/fetch-users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${newAccessToken}`,
            },
          }
        );

        const data = await response.json();

        if (!response.ok) {
          errorToast(data.message);
          getUsers();
        } else {
          setUsers(data.users);
          setFilteredUser(data.users);
        }
      } else {
        adminContext?.logout();
      }
    };
    getUsers();
  }, [dependency]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newUsers = users?.filter((user: any) => {
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
    setFilteredUser(newUsers ?? []);
  }, [searchQuery]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const admin = useSelector((state: any) => state.admin);

  return (
    <>
      <ModalForm
        showModal={showModal}
        setShowModal={setShowModal}
        editing={editing}
        user={editingUser}
        toastError={errorToast}
        dependency={setDependency}
      />
      <ToastContainer />
      <nav
        className="navbar navbar-light bg-dark position-fixed w-100 top-0"
        style={{ zIndex: "2" }}
      >
        <div className="container-fluid">
          <div>
            <a
              className="btn btn-danger me-3"
              onClick={() => adminContext?.logout()}
            >
              Logout
            </a>
            <a
              className="btn btn-light"
              onClick={() => {
                setEditing(false);
                setShowModal(true);
              }}
            >
              Add Users
            </a>
          </div>
          <div className="d-flex">
            <input
              className="form-control me-2"
              type="text"
              placeholder="Search User"
              value={searchQuery}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(event.target.value);
              }}
            />
          </div>
        </div>
      </nav>

      <div className="text-center mt-5 pt-3 text-light">
        <h3>Hello {admin?.email}</h3>
      </div>

      <div className="row container-fluid mt-5 pt-5 justify-content-lg-center justify-content-md-center justify-content-sm-center">
        {filteredUsers?.length ? (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          filteredUsers?.map((user: any, index: number) => {
            return (
              <UserCard
                name={user.name}
                email={user.email}
                key={index}
                imageURL={user.imageURL}
                _id={user._id}
                setShowModal={setShowModal}
                setUser={setEditingUser}
                setEditing={setEditing}
                user={editingUser}
                errorToast={errorToast}
                dependency={setDependency}
              />
            );
          })
        ) : (
          <></>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
