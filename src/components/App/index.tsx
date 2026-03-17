import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Selector from "@/components/Base/Selector";
import { NYT_DATA } from "@/data/newYorkTimes";

import { useStore } from "@/store";
import { List } from "@/store/books";
import { useCallback, useState, useEffect } from "react";
import { Category } from "@/store/globalUI";

import BooksList from "../Books";
import NewsList from "../NewsList";
import TopStories from "../TopStories";

import "./app.scss";

const App = () => {
  const { booksStore, globalUIStore, newsStore, topStoriesStore } = useStore();
  const [selected, setSelected] = useState<Category>("");

  const handleCategory = async (value: string) => {
    setSelected(value as Category);
  };

  const handleList = async (value: string) => {
    booksStore.setList(value);
  };

  const getData = useCallback(() => {
    if (selected === "") {
      return;
    }
    globalUIStore.setCategory(selected);
    switch (selected) {
      case "books":
        booksStore.getLists();
        break;
      case "news":
        newsStore.getNewsData();
        topStoriesStore.reset();
        break;
      case "topstories":
        newsStore.reset();
        break;
      case "search":
        console.log("search");
        break;
      case "mostpopular":
        console.log("mostpopular");
        break;
      default:
        break;
    }
  }, [selected]);

  useEffect(() => {
    getData();
  }, [getData]);

  const getListsOptions = () => {
    const options = booksStore.lists.map((list: List) => {
      return {
        value: list.list_name_encoded,
        label: list.display_name,
      };
    });
    return options;
  };
  return (
    <section className="app">
      <Header />
      <Selector optionsData={NYT_DATA} onSelect={handleCategory} />
      <section className="main">
        {globalUIStore.category === "books" && (
          <>
            <Selector optionsData={getListsOptions()} onSelect={handleList} />
            <BooksList />
          </>
        )}
        {globalUIStore.category === "news" && <NewsList />}
        {globalUIStore.category === "topstories" && <TopStories />}
        {/* <Form /> */}
      </section>
      <Footer />
    </section>
  );
};

export default App;
