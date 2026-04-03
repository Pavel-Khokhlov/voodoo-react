import NoData from "@/components/NoData";
import { useStore } from "@/store";

import { useEffect, useState } from "react";
import { Book, List } from "@/store/books";
import BookItem from "@/components/BookItem";
import Selector from "@/components/Base/Selector";
import Loader from "@/components/Base/Loader";
import Error from "@/components/Base/Error";

import "./books.scss";

const BooksList = () => {
  const { booksStore } = useStore();

  const [books, setBooks] = useState<Book[] | []>([]);

  const handleList = async (value: string) => {
    booksStore.setList(value);
  };

  useEffect(() => {
    if (booksStore.selected_list === "") {
      setBooks([]);
      return;
    }
    const currentBooks = booksStore.lists
      .filter((list: List) => {
        return list.list_name_encoded === booksStore.selected_list;
      })[0]
      .books.sort((a, b) => b.weeks_on_list - a.weeks_on_list);
    setBooks(currentBooks);
  }, [booksStore.selected_list]);

  const getListsOptions = () => {
    const options = booksStore.lists.map((list: List) => {
      return {
        value: list.list_name_encoded,
        label: list.display_name,
      };
    });
    return options;
  };

  if (booksStore.lists.length === 0) {
    return <NoData />;
  }
  return (
    <section className="books__wrapper">
      <Selector
        optionsData={getListsOptions()}
        placeholder="Select the books section"
        onSelect={handleList}
      />
      {/* Отображаем состояние загрузки */}
      {booksStore.booksStatus === "loading" && <Loader />}

      {/* Отображаем ошибку */}
      {booksStore.booksStatus === "rejected" && (
        <Error error={booksStore.booksError} />
      )}

      {/* Отображаем cписок книг */}
      {booksStore.booksStatus === "resolved" && (
        <div className="books">
          {books?.map((book: Book) => {
            return <BookItem key={book.book_uri} book={book} />;
          })}
        </div>
      )}
    </section>
  );
};

export default BooksList;
