import { useStore } from "@/store";

import { useEffect, useState } from "react";

import "./newslist.scss";
import { Section } from "@/store/news";

const NewsList = () => {
  const { newsStore } = useStore();

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
      <div className="news__list">
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
      {newsStore.currentNewsStatus === "loading" && (
        <div>Загрузка новостей...</div>
      )}

      {/* Отображаем ошибку для новостей */}
      {newsStore.currentNewsStatus === "rejected" && (
        <div>Ошибка загрузки новостей: {newsStore.currentNewsError}</div>
      )}

      {/* Отображаем новости */}
      {newsStore.currentNewsStatus === "resolved" && (
        <div className="news__items">
          {newsStore.current_news?.map((item: any) => {
            return <p key={item.uri}>{item.title}</p>;
          })}
        </div>
      )}
    </section>
  );
};

export default NewsList;
