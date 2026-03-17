import NoData from "@/components/NoData";
import { useStore } from "@/store";

import { useEffect, useState } from "react";
import { Book, List } from "@/store/books";
import BookItem from "@/components/Book";

import "./books.scss";

const BooksList = () => {
  const { booksStore } = useStore();

  const [books, setBooks] = useState<Book[] | []>([]);

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

  if (booksStore.lists.length === 0) {
    return <NoData />;
  }
  return (
    <section className="books">
      {books?.map((book: Book) => {
        return <BookItem key={book.book_uri} book={book} />;
      })}
    </section>
  );
};

export default BooksList;
