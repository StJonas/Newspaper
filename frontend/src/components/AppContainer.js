const AppContainer = ({ children, classes }) => {
  return (
      <div className={`p-4 ${classes}`}>{children}</div>
  );
};

export default AppContainer;
