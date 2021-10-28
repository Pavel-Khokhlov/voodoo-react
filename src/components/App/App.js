import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { concatArr, getPosts } from "../../store/postSlice";
import { getUsers } from "../../store/userSlice";
import Cards from "../Cards/Cards";
import Form from "../Form/Form";
import "./App.scss";

const App = () => {
  const dispatch = useDispatch();
  const { posts, postsStatus } = useSelector((state) => state.post);
  const { users, usersStatus } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if(postsStatus === `resolved` && usersStatus === `resolved`) {
      dispatch(concatArr(users));
    }
  }, [postsStatus, usersStatus])

  return (
    <section className="app">
      <Form />
      <Cards />
    </section>
  );
};

export default App;
