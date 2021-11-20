import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { concatArr, getPosts, initialPosts } from "../../store/postSlice";
import { getUsers } from "../../store/userSlice";
import Form from "../Form/Form";
import Cards from "../Cards/Cards";
import Footer from "../Footer/Footer";
import "./App.scss";

const App = () => {
  const dispatch = useDispatch();
  const { postsStatus } = useSelector((state) => state.post);
  const { users, usersStatus } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(getPosts());
    dispatch(getUsers());
  }, []);

  useEffect(() => {
    if(postsStatus === `resolved` && usersStatus === `resolved`) {
      dispatch(concatArr(users));
      dispatch(initialPosts());
    }
  }, [postsStatus, usersStatus])

  return (
    <section className="app">
      <Form />
      <Cards />
      <Footer />
    </section>
  );
};

export default App;
