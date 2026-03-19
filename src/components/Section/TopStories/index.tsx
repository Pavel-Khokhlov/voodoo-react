import { useStore } from "@/store";

import { useEffect, useState } from "react";

import { NewsProps, Section } from "@/store/news";
import Loader from "@/components/Base/Loader";
import NewsItem from "@/components/NewsItem";
import SectionItem from "@/components/SectionItem";
import Error from "@/components/Base/Error";
import { TopSections } from "@/store/top-stories";

import "./newslist.scss";

const TopStories = () => {
  const { topStoriesStore } = useStore();

  // const [mainStory, setMainStory] = useState<NewsProps | null>(null);
  const [sections, setSections] = useState<Section[] | []>([]);

  const mainStory = topStoriesStore.topStories?.[0];

  const handleSection = (value: string) => {
    topStoriesStore.setSection(value);
  };

  const formateName = (value: string) => {
    if (!value) return value;
    if (value === "us") return "U.S.";
    if (value === "nyregion") return "New York region";
    if (value === "sundayreview") return "Sunday review";
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  // Загружаем новости при изменении выбранной секции
  useEffect(() => {
    if (!topStoriesStore.selected_section) {
      return;
    }

    const loadNews = async () => {
      await topStoriesStore.getTopStoriesData(topStoriesStore.selected_section);
    };

    loadNews();
  }, [topStoriesStore.selected_section]);

  useEffect(() => {
    const formattedArr = TopSections.map((item: string) => {
      return { section: item, display_name: formateName(item) };
    });
    setSections(formattedArr);
  }, []);

  return (
    <section className="news__wrapper">
      <div className="news__section">
        {sections.map((section: Section) => {
          return (
            <SectionItem
              key={section.section}
              section={section}
              value={topStoriesStore.selected_section}
              onHandle={handleSection}
            />
          );
        })}
      </div>
      {/* Отображаем состояние загрузки */}
      {topStoriesStore.topStoriesStatus === "loading" && <Loader />}

      {/* Отображаем ошибку */}
      {topStoriesStore.topStoriesStatus === "rejected" && (
        <Error error={topStoriesStore.topStoriesError} />
      )}

      {/* Отображаем новости */}
      {topStoriesStore.topStoriesStatus === "resolved" && (
        <div className="news__section news__section_list">
          {mainStory && <NewsItem key={mainStory.uri} item={mainStory} isMain={true} />}
          <div className="news__section news__section_list">
            {topStoriesStore.topStories?.map(
              (item: NewsProps, index: number) => {
                if (index === 0) {
                  return;
                }
                return <NewsItem key={item.uri} item={item} />;
              },
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default TopStories;
