import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxTrigger,
} from "@/shared/components/ui/combobox";
const languages = [
  {
    value: "javascript",
    label: "JavaScript",
  },
  {
    value: "python",
    label: "Python",
  },
  {
    value: "go",
    label: "Go",
  },
  {
    value: "ruby",
    label: "Ruby",
  },
];

type LanguageSelectorProps = {
  value: string;
  onValueChange: (value: string) => void;
};
const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => (
  <Combobox
    data={languages}
    value={value}
    onValueChange={onValueChange}
    type="language"
  >
    <ComboboxTrigger className="w-48" />
    <ComboboxContent className="w-20">
      <ComboboxInput />
      <ComboboxEmpty />
      <ComboboxList>
        <ComboboxGroup>
          {languages.map((language) => (
            <ComboboxItem key={language.value} value={language.value}>
              {language.label}
            </ComboboxItem>
          ))}
        </ComboboxGroup>
      </ComboboxList>
    </ComboboxContent>
  </Combobox>
);
export default LanguageSelector;
