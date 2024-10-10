export interface UserBody{
    name: string;
    email: string;
    password?: string;
    confPassword?: string;
    imageURL:string
    _id?: string
}


export interface ModalProps{
    showModal: boolean;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    editing: boolean;
    user: UserBody | null;
    toastError: (message: string) => void;
    dependency: React.Dispatch<React.SetStateAction<Array<[]>>>
}


export interface CardProps {
    name: string;
    email: string;
    key: number;
    imageURL: string;
    _id: string;
    setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<React.SetStateAction<UserBody | null>>;
    setEditing: React.Dispatch<React.SetStateAction<boolean>>;
    user: UserBody | null;
    errorToast: (message: string) => void;
    dependency: React.Dispatch<React.SetStateAction<Array<[]>>>
}