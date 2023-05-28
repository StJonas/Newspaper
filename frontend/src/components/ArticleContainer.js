const ArticleContainer = ({ children, classes, key }) => {
    return (
        <div className={`flex flex-1 flex-col pt-5 gap-2 ${classes}`} key={key}>{children}</div>
    );
};

export default ArticleContainer;
