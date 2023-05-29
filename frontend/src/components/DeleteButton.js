import {Button} from "flowbite-react";

const DeleteButton = ({children, onClick}) => {
    return (<Button className={"m-1 w-24"} color="failure" onClick={onClick}>{children}</Button>);
};

export default DeleteButton;
