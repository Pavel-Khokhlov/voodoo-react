import React, { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import { useBookActions } from "@/store/books";

import "./selector.scss";
import { useStore } from "@/store";

interface SelectorProps {
  optionsData: Array<{ value: string; label: string }>;
}

const CustomSelect: React.FC<SelectorProps> = ({ optionsData }) => {
  const { booksStore } = useStore();
  const [selected, setSelected] = useState<string>("");
  const handleSelect = async (value: string) => {
    setSelected(value);
  };

  const getData = useCallback(() => {
    if (selected === "") {
      return;
    }
    switch (selected) {
      case "books":
        console.log("SELECTED", selected);
        booksStore.getBooks();
        break;
      default:
        break;
    }
  }, [selected]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div className="selector">
      <Select
        showSearch={{
          optionFilterProp: "label",
          filterSort: (optionA, optionB) =>
            (optionA?.label ?? "")
              .toLowerCase()
              .localeCompare((optionB?.label ?? "").toLowerCase()),
        }}
        onSelect={handleSelect}
        style={{ width: 300 }}
        size="large"
        placeholder="Search to Select"
        options={optionsData}
      />
    </div>
  );
};

export default CustomSelect;
