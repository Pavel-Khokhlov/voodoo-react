import { useStore } from "@/store";

import { useEffect, useState } from "react";

import "./newslist.scss";
import { NewsProps, Section } from "@/store/news";
import Loader from "../Loader";
import NewsItem from "../NewsItem";
import { formatDate } from "@/helpers/date";
import { LinkOutlined } from "@ant-design/icons";

const NewsList = () => {
  const { newsStore } = useStore();

  const [mainNews, setMainNews] = useState<NewsProps | null>(null);

  const handleSection = (value: string) => {
    newsStore.setSection(value);
  };

  // Загружаем данные при монтировании компонента для получения списка секций
  useEffect(() => {
    const loadSections = async () => {
      // Загружаем список всех секций, если его нет
      if (!newsStore.sections || newsStore.sections.length === 0) {
        await newsStore.getNewsData();
      }
    };

    loadSections();
  }, []);

  // Загружаем новости при изменении выбранной секции
  useEffect(() => {
    if (!newsStore.selected_section) {
      return;
    }

    const loadNews = async () => {
      await newsStore.getNewsData(newsStore.selected_section);
      setMainNews(newsStore.current_news[0]);
    };

    loadNews();
  }, [newsStore.selected_section]);

  return (
    <section className="news__wrapper">
      <div className="news__section">
        {/* Отображаем состояние загрузки для новостей */}
        {newsStore.sectionsStatus === "loading" && <Loader />}
        {newsStore.sections?.map((section: Section) => {
          return (
            <button
              key={section.section}
              type="button"
              className="news__button"
              onClick={() => handleSection(section.section)}
            >
              {section.display_name}
            </button>
          );
        })}
      </div>
      {/* Отображаем состояние загрузки для новостей */}
      {newsStore.currentNewsStatus === "loading" && <Loader />}

      {/* Отображаем ошибку для новостей */}
      {newsStore.currentNewsStatus === "rejected" && (
        <div>Ошибка загрузки новостей: {newsStore.currentNewsError}</div>
      )}

      {/* Отображаем новости */}
      {newsStore.currentNewsStatus === "resolved" && (
        <div className="news__section news__section_list">
          {mainNews && <NewsItem key={mainNews.uri} item={mainNews} />}
          <div className="news__section news__section_list">
            {newsStore.current_news?.map((item: NewsProps, index: number) => {
              if (index === 0) {
                return;
              }
              return <NewsItem key={item.uri} item={item} isSmall={true} />;
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsList;
