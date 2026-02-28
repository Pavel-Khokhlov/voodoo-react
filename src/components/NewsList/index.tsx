import NoData from "@/components/NoData";
import { useStore } from "@/store";

import { useEffect, useState } from "react";
import { Book, List } from "@/store/books";

import "./newslist.scss";
import { Section } from "@/store/news";

const NewsList = () => {
  const { newsStore } = useStore();

  const [news, setNews] = useState<any[] | []>([]);

  const handleSection = (value: string) => {
    newsStore.setSection(value);
  };

  useEffect(() => {
    if (newsStore.selected_section === "") {
      return;
    }
    const loadNews = async () => {
      await newsStore.getNewsData(newsStore.selected_section);
      setNews(newsStore.current_news || []);
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
      {news?.map((item: any) => {
        return <p key={item.uri}>{item.title}</p>;
      })}
    </section>
  );
};

export default NewsList;
