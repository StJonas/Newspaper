import {Link} from "react-router-dom";
import React from "react";

const AppLink = ({children, to}) => {
    return (
        <Link className={'text-indigo-600 no-underline'} to={to}>{children}</Link>
    );
};

export default AppLink;
