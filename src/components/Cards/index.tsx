import Card from "@/components/Card";
import NoPosts from "@/components/NoPosts";
import { useStore } from "@/store";

import "./cards.scss";

const Cards = () => {
  const { booksStore } = useStore();

  if (booksStore.lists.length === 0) {
    return <NoPosts />;
  }
  return (
    <section className="cards">
      {booksStore.lists.map((book, index) => {
        return <Card key={index} card={book} />;
      })}
    </section>
  );
};

export default Cards;
