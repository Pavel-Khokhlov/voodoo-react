import { useState } from "react";
import { useStore } from "@/store";

import { Button } from "antd";
import * as icons from "@ant-design/icons";

import Selector from "@/components/Base/Selector";
import { Popular_Period, Popular_Type } from "@/store/most_popular";
import Loader from "@/components/Base/Loader";

import { NewsProps } from "@/store/news";
import NewsItem from "@/components/NewsItem";
import Error from "@/components/Base/Error";

import "./mostpopular.scss";

const MostPopular = () => {
  const { mostPopularStore } = useStore();
  const [typeSelected, setTypeSelected] = useState<string>("viewed");
  const [periodSelected, setPeriodSelected] = useState<string>("1");

  const { ArrowDownOutlined } = icons;

  const mainStory = mostPopularStore.mostPopular?.[0];

  const handleType = async (value: string) => {
    setTypeSelected(value);
  };

  const handlePeriod = async (value: string) => {
    setPeriodSelected(value);
  };

  const handleGetNews = () => {
    // console.log("handleGetNews", typeSelected, periodSelected);
    mostPopularStore.getMostPopularData(typeSelected, periodSelected);
  };

  return (
    <section className="news__wrapper">
      <Selector
        optionsData={Popular_Type}
        defaultValue={typeSelected}
        onSelect={handleType}
      />
      <Selector
        optionsData={Popular_Period}
        defaultValue={periodSelected}
        onSelect={handlePeriod}
      />
      <div className="button__wrapper">
        <Button
          type="primary"
          size="large"
          icon={<ArrowDownOutlined />}
          onClick={handleGetNews}
          className="button__get-news"
        >
          Get the news
        </Button>
      </div>
      {/* Отображаем состояние загрузки */}
      {mostPopularStore.mostPopularStatus === "loading" && <Loader />}

      {/* Отображаем ошибку */}
      {mostPopularStore.mostPopularStatus === "rejected" && (
        <Error error={mostPopularStore.mostPopularError} />
      )}
      {/* Отображаем новости */}
      {mostPopularStore.mostPopularStatus === "resolved" && (
        <div className="news__section news__section_list">
          {mainStory && <NewsItem key={mainStory.uri} item={mainStory} isMain={true} />}
          <div className="news__section news__section_list">
            {mostPopularStore.mostPopular?.map(
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

export default MostPopular;
