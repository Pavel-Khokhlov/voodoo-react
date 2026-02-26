import React, { useCallback, useEffect, useState } from "react";
import { Select } from "antd";
import "./selector.scss";
import { useAppDispatch } from "@/store/hook";
import { getBooks } from "@/store/booksSlice";

interface SelectorProps {
  optionsData: Array<{ value: string; label: string }>;
}

const CustomSelect: React.FC<SelectorProps> = ({ optionsData }) => {
  const dispatch = useAppDispatch();
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
        dispatch(getBooks());
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
