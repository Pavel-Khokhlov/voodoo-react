import "./error.scss";

interface ErrorProps {
  error: string | null;
}

const ErrorItem = ({ error }: ErrorProps) => {
  return <div className="error">News loading error: {error}</div>;
};

export default ErrorItem;
