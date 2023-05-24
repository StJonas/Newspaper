export const H1 = ({children}) => {
    return (
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl">{children}</h1>
    );
};

export const H2 = ({children}) => {
    return (
        <h2 className="text-4xl font-extrabold">{children}</h2>
    );
};

export const H3 = ({children}) => {
    return (
        <h3 className="mb-2 mt-0 text-3xl font-medium leading-tight text-primary">{children}</h3>
    );
};
