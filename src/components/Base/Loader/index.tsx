import "./loader.scss";

const Loader = () => {
  return (
    <>
      <div className="spinner">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
      <p className="spinner__text">Loading...</p>
    </>
  );
};

export default Loader;
