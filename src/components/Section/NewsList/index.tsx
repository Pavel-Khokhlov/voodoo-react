import { useStore } from "@/store";

import { useEffect } from "react";

import { NewsProps, Section } from "@/store/news";
import Loader from "@/components/Base/Loader";
import NewsItem from "@/components/NewsItem";

import SectionItem from "@/components/SectionItem";
import Error from "@/components/Base/Error";

import "./newslist.scss";

const NewsList = () => {
  const { newsStore } = useStore();

  const mainNews = newsStore.current_news?.[0];

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
            <SectionItem
              key={section.section}
              section={section}
              value={newsStore.selected_section}
              onHandle={handleSection}
            />
          );
        })}
      </div>
      {/* Отображаем состояние загрузки */}
      {newsStore.currentNewsStatus === "loading" && <Loader />}

      {/* Отображаем ошибку */}
      {newsStore.currentNewsStatus === "rejected" && (
        <Error error={newsStore.currentNewsError} />
      )}

      {/* Отображаем новости */}
      {newsStore.currentNewsStatus === "resolved" && (
        <div className="news__section news__section_list">
          {mainNews && (
            <NewsItem key={mainNews.uri} item={mainNews} isMain={true} />
          )}
          <div className="news__section news__section_list">
            {newsStore.current_news?.map((item: NewsProps, index: number) => {
              if (index === 0) {
                return;
              }
              return <NewsItem key={item.uri} item={item} />;
            })}
          </div>
        </div>
      )}
    </section>
  );
};

export default NewsList;
