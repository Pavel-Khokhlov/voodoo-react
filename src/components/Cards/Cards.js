import { useSelector } from "react-redux";
import Card from "../Card/Card";
import "./Cards.scss";

const Cards = () => {
  const { posts, fullPosts } = useSelector((state) => state.post);

  console.log(fullPosts);

  return (
    <section className="cards">
      {fullPosts.map((card) => {
        return <Card key={card.id} {...card} />;
      })}
    </section>
  );
};

export default Cards;
