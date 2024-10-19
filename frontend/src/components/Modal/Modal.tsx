import { useRef, useState, useEffect, useContext } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { AdminAuth } from "../../auth/adminAuth";
import { AdminContext } from "../../context/AdminContext";
import { UserBody } from "../../types";
import { ToastContainer } from "react-toastify";
import { ModalProps } from "../../types";

const ModalForm = (props: ModalProps) => {
  const handleClose = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfPassword("");
    setImageURL("");
    props.setShowModal(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const accessToken = useSelector((state: any) => state.adminToken);
  const adminContext = useContext(AdminContext);

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confPassword, setConfPassword] = useState<string>("");
  const [imageURL, setImageURL] = useState<string>("none");

  useEffect(() => {
    if (props.user && props.editing) setName(props.user.name);
    else setName("");
    if (props.user && props.editing) setEmail(props.user.email);
    else setEmail("");
    if (props.user && props.editing) setImageURL(props.user.imageURL);
    else setImageURL("");
  }, [props.showModal, props.editing]);

  const toastError = props.toastError;

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

  const handleSubmit = async () => {
    const nameRegex = /^[a-zA-Z]{3,}(?: [a-zA-Z]{3,})*$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const minLengthRegex = /^.{8,}$/;
    
    if (!nameRegex.test(name))
      return toastError("Please enter a valid name (A - Z)");
    if (!emailRegex.test(email))
      return toastError("Please enter a valid email");


    if (!props.editing && !minLengthRegex.test(password))
      return toastError("Password must have 8 characters");
    if (!props.editing && password !== confPassword)
      return toastError("Passwords do not match");

    const newAccessToken = await AdminAuth(accessToken);

    if (newAccessToken) {
      const body: UserBody = { name, email, imageURL };
      if (!props.editing) body.password = password;
      const url = `https://crud-app-api-tau.vercel.app/admin/${
        props.editing ? "edit-user/" + props.user?._id : "add-user"
      }`;
      const response = await fetch(url, {
        method: props.editing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${newAccessToken}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        toastError(data.message);
      } else {
        props.dependency([]);
        handleClose();
      }
    } else {
      adminContext?.logout();
    }
  };

  const inputRef = useRef(null);

  return (
    <>
      <ToastContainer />
      <Modal show={props.showModal} onHide={handleClose} centered>
        <Modal.Header closeButton className="bg-dark text-white">
          <Modal.Title>{props.editing ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-dark text-white">
          <Form>
            {/* Profile Picture Uploader */}
            {props.editing ? (
              <>
                <div className="d-flex justify-content-center">
                  <img
                    src={
                      imageURL !== "none" ? imageURL : "/src/assets/unknown.jpg"
                    }
                    alt=""
                    className="img-fluid w-25"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    //@ts-expect-error
                    onClick={() => inputRef.current.click()}
                  />
                  {imageURL !== "none" ? (
                    <button
                      className="btn btn-light"
                      onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
                        event.preventDefault();
                        setImageURL("none");
                      }}
                    >
                      Remove photo
                    </button>
                  ) : (
                    <></>
                  )}
                </div>
                <input
                  ref={inputRef}
                  type="file"
                  accept="image/*"
                  className="d-none"
                  onChange={handleFileChange}
                />
              </>
            ) : (
              <></>
            )}

            {/* Name Field */}
            <Form.Group className="mb-3" controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your name"
                autoFocus
                value={name}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setName(event.target.value)
                }
              />
            </Form.Group>

            {/* Email Field */}
            <Form.Group className="mb-3" controlId="formEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setEmail(event.target.value)
                }
              />
            </Form.Group>

            {!props.editing ? (
              <>
                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setPassword(event.target.value)
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formConfirmPassword">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm password"
                    value={confPassword}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      setConfPassword(event.target.value)
                    }
                  />
                </Form.Group>
              </>
            ) : (
              <></>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="bg-dark text-white">
          <Button variant="danger" onClick={handleClose}>
            Close
          </Button>
          <Button variant="outline-light" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalForm;
