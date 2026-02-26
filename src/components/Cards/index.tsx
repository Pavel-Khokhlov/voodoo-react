import { useSelector } from "react-redux";
import Card from "@/components/Card";
import NoPosts from "@/components/NoPosts";
import "./Cards.scss";
import { useAppSelector } from "@/store/hook";

const Cards = () => {
  const { filteredBooks } = useAppSelector((state) => state.book);


  if(filteredBooks.length === 0) {
    return <NoPosts />;
  }
  return (
    <section className="cards">
      {filteredBooks.map((book, index) => {
        return <Card key={index} card={book} />;
      })}
    </section>
  );
};

export default Cards;
