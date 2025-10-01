import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
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
import { useState } from "react";
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

const LanguageSelector = ({ value, onValueChange }: LanguageSelectorProps) => {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [pendingLanguage, setPendingLanguage] = useState<string | null>(null);

  const handleLanguageChange = (newValue: string) => {
    // If language is different from current, show warning
    if (newValue !== value) {
      setPendingLanguage(newValue);
      setIsAlertOpen(true);
    }
  };

  const handleConfirmChange = () => {
    if (pendingLanguage) {
      onValueChange(pendingLanguage);
      setPendingLanguage(null);
    }
    setIsAlertOpen(false);
  };

  const handleCancelChange = () => {
    setPendingLanguage(null);
    setIsAlertOpen(false);
  };

  return (
    <>
      <Combobox
        data={languages}
        value={value}
        onValueChange={handleLanguageChange}
        type="language"
      >
        <ComboboxTrigger className="w-full my-2" />
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

    <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Change Language?</AlertDialogTitle>
          <AlertDialogDescription>
            Changing the language will replace your current code with a template for{" "}
            {languages.find((lang) => lang.value === pendingLanguage)?.label}.
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancelChange}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmChange}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
};

export default LanguageSelector;
