import "./footer.scss";

const Footer = () => {
  return (
    <div className="footer">
      <p className="footer__text">@NY Times Developers by Pavel Khokhlov</p>
      <p className="footer__text">Version: {import.meta.env.APP_VERSION}</p>
    </div>
  );
};

export default Footer;
