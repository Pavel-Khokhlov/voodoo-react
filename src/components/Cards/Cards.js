import { useSelector } from "react-redux";
import Card from "../Card/Card";
import NoPosts from "../NoPosts/NoPosts";
import "./Cards.scss";

const Cards = () => {
  const { filteredPosts } = useSelector((state) => state.post);


  if(filteredPosts.length === 0) {
    return <NoPosts />;
  }
  return (
    <section className="cards">
      {filteredPosts.map((card, index) => {
        return <Card key={index} card={card} />;
      })}
    </section>
  );
};

export default Cards;
