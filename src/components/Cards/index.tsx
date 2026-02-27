import Card from "@/components/Card";
import NoData from "@/components/NoData";
import { useStore } from "@/store";

import { useEffect, useState } from "react";
import { Book, List } from "@/store/books";

import "./cards.scss";

const Cards = () => {
  const { booksStore } = useStore();

  const [books, setBooks] = useState<Book[] | []>([]);

  useEffect(() => {
    if (booksStore.selected_list === "") {
      return;
    }
    const currentBooks = booksStore.lists.filter((list: List) => {
      return list.list_name_encoded === booksStore.selected_list;
    });
    console.log("useEffect", currentBooks[0]?.books);
    setBooks(currentBooks[0].books);
  }, [booksStore.selected_list]);

  if (booksStore.lists.length === 0) {
    return <NoData />;
  }
  return (
    <section className="cards">
      {books?.map((book: Book) => {
        return <Card key={book.book_uri} book={book} />;
      })}
    </section>
  );
};

export default Cards;
