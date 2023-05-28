import {Button} from "flowbite-react";

const UpdateButton = ({children, onClick}) => {
    return (<Button color="gray" onClick={onClick}>{children}</Button>);
};

export default UpdateButton;
