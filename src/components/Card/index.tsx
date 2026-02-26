import { Book, BuyLink } from "@/store/books";
import "./card.scss";

import IconAmazon from "@/assets/logo/amazon.webp";
import IconApple from "@/assets/logo/apple.webp";
import IconBn from "@/assets/logo/b&n.webp";
import IconBam from "@/assets/logo/bam.webp";
import IconBs from "@/assets/logo/bookshop.webp";

export const ICON_PATH = {
  Amazon: IconAmazon,
  "Apple Books": IconApple,
  "Barnes & Noble": IconBn,
  "Barnes and Noble": IconBn,
  "Books-A-Million": IconBam,
  "Bookshop.org": IconBs,
} as const;

const Card = ({ book }: { book: Book }) => {
  return (
    <div className="book__wrapper">
      <img src={book.book_image} alt="cover book" className="book__cover" />
      <h5 className="book__text book__title">{book.title}</h5>
      <p className="book__text book__author">
        Author: <strong>{book.author}</strong>
      </p>
      {book.description && (
        <p className="book__description">{book.description}</p>
      )}
      <p className="book__text book__weeks">Weeks on list: <strong>{book.weeks_on_list}</strong></p>
      <p className="book__text book__buy">Where to buy:</p>
      <div className="book__icons">
        {book.buy_links.map((link: BuyLink) => {
          const iconSrc = ICON_PATH[link.name as keyof typeof ICON_PATH];

          if (!iconSrc) {
            console.warn(`Icon not found for: ${link.name}`);
            return null;
          }
          return (
            <a key={link.name} href={link.url} target="_blank">
              <img src={iconSrc} alt={link.name} className="book__icon" />
            </a>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
