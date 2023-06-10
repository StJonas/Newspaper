import {Button} from "flowbite-react";

const AppButton = ({children, onClick, disabled, classes}) => {
    return (
        <Button onClick={onClick} disabled={disabled} className={classes}>{children}</Button>
    );
};

export default AppButton;
