import React from "react";
import { Select } from "antd";

import "./selector.scss";
interface SelectorProps {
  optionsData: Array<{ value: string; label: string }>;
  onSelect: (value: string) => Promise<void>;
}

const CustomSelect: React.FC<SelectorProps> = ({ optionsData, onSelect }) => {
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
        placeholder="Search to Select"
        options={optionsData}
      />
    </div>
  );
};

export default CustomSelect;
