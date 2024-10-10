import { useContext } from "react";
import { useSelector } from "react-redux";
import { AdminContext } from "../../context/AdminContext";
import { AdminAuth } from "../../auth/adminAuth";
import { CardProps } from "../../types";

const UserCard = (props: CardProps) => {

    const handleEdit = () => {
        props.setUser({name: props.name, email: props.email, imageURL: props.imageURL, _id: props._id})
        props.setEditing(true)
        props.setShowModal(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const accessToken = useSelector((state: any) => state.adminToken);
    const adminContext = useContext(AdminContext);

    const handleDelete = async () => {
        const newAccessToken = await AdminAuth(accessToken)
        if(newAccessToken) {
            const response = await fetch(`http://localhost:3000/admin/delete-user/${props._id}`, {
                headers: {
                    "Authorization": `Bearer ${newAccessToken}`
                },
                method: "DELETE",
            });

            const data = await response.json()

            if(!response.ok) {
                props.errorToast(data.message)
            } else {
                props.dependency([])
            }
        } else {
            adminContext?.logout()
        }
    }

  return (
    <div className="card bg-dark col-lg-3 col-md-6 col-sm-10 m-3">
      <div className="card-body">
        <div className="d-flex justify-content-center my-3">
          <img
            style={{ width: "70px", height: "70px" }}
            src={
              props.imageURL === "none"
                ? "/src/assets/unknown.jpg"
                : props.imageURL
            }
            alt="image"
            className="img-fluid"
          />
        </div>
        <div className="row">
          <span className="col card-text text-light">Name:</span>
          <span className="col card-text text-light">{props.name}</span>
        </div>
        <div className="row">
          <span className="col card-text text-light">Email:</span>
          <span className="col card-text text-light">{props.email}</span>
        </div>
        <div className="row">
          <button onClick={handleEdit} className="btn btn-outline-light mt-2">Edit User</button>
          <button className="btn btn-outline-danger mt-2" onClick={handleDelete}>Delete User</button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
