// <1> The formatting of H1, H2 and H3 is taken from: https://flowbite.com/docs/typography/headings/
// <2> The formatting of Text is taken from: https://flowbite.com/docs/typography/text/

export const H1 = ({children}) => {
    // <1> Start
    return (
        <h1 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">{children}</h1>
    );
    // <1> End
};

export const H2 = ({children}) => {
    // <1> Start
    return (
        <h2 className="text-4xl font-bold dark:text-white">{children}</h2>
    );
    // <1> End
};

export const H3 = ({children}) => {
    // <1> Start
    return (
        <h3 className="text-3xl font-bold dark:text-white">{children}</h3>
    );
    // <1> End
};

export const Text = ({children, classes}) => {
    // <2> Start
    return (
        <p className={`text-sm text-gray-900 dark:text-white ${classes}`}>{children}</p>
    );
    // <2> End
};