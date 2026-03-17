import { Section } from "@/store/news";

interface SectionItemProps {
  section: Section;
  value: string;
  onHandle: (value: string) => void;
}

const SectionItem = ({ section, value, onHandle }: SectionItemProps) => {
  const handleClick = (v: string) => {
    onHandle(v);
  };

  return (
    <button
      key={section.section}
      type="button"
      className={`news__button ${section.section === value ? '_active' : ''}`}
      onClick={() => handleClick(section.section)}
    >
      {section.display_name}
    </button>
  );
};

export default SectionItem;
