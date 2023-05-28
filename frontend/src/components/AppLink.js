import {Link} from "react-router-dom";

const AppLink = ({children, to}) => {
    return (
        <Link className={'text-indigo-600 no-underline'} to={to}>{children}</Link>
    );
};

export default AppLink;
