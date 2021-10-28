import "./Card.scss";

const Card = (card) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title card__title">{card.title}</h5>
        <p className="card-text">{card.body}</p>
        <p className="card-text">{card.name}</p>
      </div>
    </div>
  );
};

export default Card;
