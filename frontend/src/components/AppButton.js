import {Button} from "flowbite-react";

const AppButton = ({children, onClick}) => {
    return (
        <Button onClick={onClick}>{children}</Button>
    );
};

export default AppButton;
