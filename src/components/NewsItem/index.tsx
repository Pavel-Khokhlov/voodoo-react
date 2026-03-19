import "./newsitem.scss";
import { NewsProps } from "@/store/news";
import { formatDate } from "@/helpers/date";
import { LinkOutlined } from "@ant-design/icons";

interface ItemProps {
  item: NewsProps;
  isMain?: boolean;
}

const NewsItem = ({ item, isMain = false }: ItemProps) => {
  return (
    <div className={`news__main ${isMain ? '' : '_small'}`}>
      <div className="news__image-container">
        <img
          src={!isMain ? item.multimedia.url2 : item.multimedia.url3}
          className="news__image"
          alt={item.title}
        />
        <div className="news__image-overlay">
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Redirect to news"
            className="news__redirect-btn"
          >
            Redirect
          </a>
        </div>
      </div>
      <div className={`news__main-info ${!isMain ? '_small' : ''}`}>
        <h3 className="news__text news__title">{item.title}</h3>
        <p className="news__text news__abstract">{item.abstract}</p>
        {isMain && <p className="news__text news__byline">{item.byline}</p>}
        <div className="news__footer">
          <p className="news__text news__descrip">
            {formatDate(item.updated)}
          </p>
          {isMain && (
            <p className="news__text news__descrip">{item.source}</p>
          )}
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Redirect to news"
            className="news__link"
          >
            <LinkOutlined />
          </a>
        </div>
      </div>
    </div>
  );
};

export default NewsItem;
