import {Button} from "flowbite-react";

const AppButton = ({children, onClick, disabled}) => {
    return (
        <Button onClick={onClick} disabled={disabled}>{children}</Button>
    );
};

export default AppButton;
