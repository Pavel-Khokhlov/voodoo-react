// import { useEffect } from "react";
// import { getBooks } from "@/store/booksSlice";
// import { getUsers } from "@/store/userSlice";
import Header from "@/components/Header";
import Form from "@/components/Form";
import Cards from "@/components/Cards";
import Footer from "@/components/Footer";
import Selector from "@/components/Base/Selector";
// import { useAppDispatch, useAppSelector } from "@/store/hook";
import { NYT_DATA } from "@/data/newYorkTimes";

import "./app.scss";

const App = () => {
  // const dispatch = useAppDispatch();
  // const { booksStatus } = useAppSelector((state) => state.book);
  // const { users, usersStatus } = useSelector((state) => state.user);

  /* useEffect(() => {
    dispatch(getBooks());
    dispatch(getUsers());
  }, []); */

  /* useEffect(() => {
    if(booksStatus === `resolved`) {
      dispatch(concatArr(users));
      dispatch(initialPosts());
    }
  }, [booksStatus]) */

  return (
    <section className="app">
      <Header />
      <Selector optionsData={NYT_DATA}/>
      <Form />
      <Cards />
      <Footer />
    </section>
  );
};

export default App;
