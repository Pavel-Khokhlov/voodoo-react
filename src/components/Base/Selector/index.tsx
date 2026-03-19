import React from "react";
import { Select } from "antd";

import "./selector.scss";
interface SelectorProps {
  optionsData: Array<{ value: string; label: string }>;
  placeholder?: string;
  defaultValue?: string;
  onSelect: (value: string) => Promise<void>;
}

const CustomSelect: React.FC<SelectorProps> = ({
  optionsData,
  placeholder,
  defaultValue,
  onSelect,
}) => {
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
        onSelect={onSelect}
        style={{ width: 500 }}
        size="large"
        placeholder={placeholder || "Search to select"}
        options={optionsData}
        defaultValue={defaultValue}
      />
    </div>
  );
};

export default CustomSelect;
