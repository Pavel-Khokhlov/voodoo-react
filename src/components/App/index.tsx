import { useCallback, useState, useEffect } from "react";
import Header from "@/components/Base/Header";
import Footer from "@/components/Base/Footer";
import Selector from "@/components/Base/Selector";
import { NYT_DATA } from "@/data/newYorkTimes";

import { useStore } from "@/store";
import { List } from "@/store/books";
import { Category } from "@/store/globalUI";

import BooksList from "../Section/Books";
import NewsList from "../Section/NewsList";
import TopStories from "../Section/TopStories";
import MostPopular from "../Section/MostPopular";

import "./app.scss";

const App = () => {
  const {
    booksStore,
    globalUIStore,
    newsStore,
    topStoriesStore,
    mostPopularStore,
  } = useStore();
  const [selected, setSelected] = useState<Category>("");

  const handleCategory = async (value: string) => {
    setSelected(value as Category);
  };

  const getData = useCallback(() => {
    if (selected === "") {
      return;
    }
    globalUIStore.setCategory(selected);
    switch (selected) {
      case "books":
        booksStore.getLists();
        topStoriesStore.reset();
        newsStore.reset();
        mostPopularStore.reset();
        break;
      case "news":
        newsStore.getNewsData();
        topStoriesStore.reset();
        booksStore.reset();
        mostPopularStore.reset();
        break;
      case "topstories":
        newsStore.reset();
        booksStore.reset();
        mostPopularStore.reset();
        break;
      /* case "search":
        console.log("search");
        break; */
      case "mostpopular":
        topStoriesStore.reset();
        newsStore.reset();
        booksStore.reset();
        break;
      default:
        break;
    }
  }, [selected]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <section className="app">
      <Header />
      <Selector
        optionsData={NYT_DATA}
        placeholder="Select the news section"
        onSelect={handleCategory}
      />
      <section className="main">
        {globalUIStore.category === "books" && <BooksList />}
        {globalUIStore.category === "news" && <NewsList />}
        {globalUIStore.category === "topstories" && <TopStories />}
        {globalUIStore.category === "mostpopular" && <MostPopular />}
      </section>
      <Footer />
    </section>
  );
};

export default App;
