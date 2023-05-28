import {Button} from "flowbite-react";

const DeleteButton = ({children, onClick}) => {
    return (<Button color="failure" onClick={onClick}>{children}</Button>);
};

export default DeleteButton;
