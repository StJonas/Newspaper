import {Button} from "flowbite-react";

const UpdateButton = ({children, onClick}) => {
    return (<Button className={"m-1 w-24"} color="gray" onClick={onClick}>{children}</Button>);
};

export default UpdateButton;
