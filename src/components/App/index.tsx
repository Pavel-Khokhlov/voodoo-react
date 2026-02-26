import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Selector from "@/components/Base/Selector";
import Cards from "../Cards";
import { NYT_DATA } from "@/data/newYorkTimes";

import { useStore } from "@/store";
import { List } from "@/store/books";
import { useCallback, useState, useEffect } from "react";
import { Category } from "@/store/globalUI";

import "./app.scss";

const App = () => {
  const { booksStore, globalUIStore } = useStore();
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
    switch (selected) {
      case "books":
        globalUIStore.setCategory(selected);
        booksStore.getLists();
        break;
      case "news":
        globalUIStore.setCategory(selected);
        break;
      default:
        globalUIStore.setCategory(selected);
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
      {globalUIStore.category === "books" && (
        <Selector optionsData={getListsOptions()} onSelect={handleList} />
      )}
      {/* <Form /> */}
      <Cards />
      <Footer />
    </section>
  );
};

export default App;
