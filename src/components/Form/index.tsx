import { SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { searchAuthor } from "@/store/booksSlice";
import "./Form.scss";

const Form = () => {
  const dispatch = useDispatch();
  const [value, setValue] = useState("");

  const handleChange = (e: { target: { value: SetStateAction<string>; }; }) => {
    setValue(e.target.value);
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    dispatch(searchAuthor(value));
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <button type="submit" className="input-group-text" id="basic-addon1">
            <svg
              width="1em"
              height="1em"
              viewBox="0 0 16 16"
              className="bi bi-search"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.442 10.442a1 1 0 0 1 1.415 0l3.85 3.85a1 1 0 0 1-1.414 1.415l-3.85-3.85a1 1 0 0 1 0-1.415z"
              />
              <path
                fillRule="evenodd"
                d="M6.5 12a5.5 5.5 0 1 0 0-11 5.5 5.5 0 0 0 0 11zM13 6.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z"
              />
            </svg>
          </button>
        </div>
        <input
          type="text"
          name="search"
          value={value}
          onChange={handleChange}
          className="form-control"
          placeholder="Поиск автора"
          aria-label="Поиск автора"
          aria-describedby="basic-addon1"
        />
      </div>
    </form>
  );
};

export default Form;
