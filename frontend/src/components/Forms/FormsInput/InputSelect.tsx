import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type InputSelectProps = {
  label: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  option: { value: string; label: string }[];
  onChange: (value: string) => void;
  value: string;
  onTouch?: boolean;
  onError?: string;
};

export const InputSelect = (props: InputSelectProps) => {
  const {
    label,
    name,
    placeholder,
    disabled,
    option,
    onChange,
    value,
    onTouch,
    onError,
  } = props;

  return (
    <label htmlFor={name} className="w-full">
      <p className="text-lg ml-1 mb-2">{label}</p>
      <Select onValueChange={onChange} disabled={disabled} value={value}>
        <SelectTrigger className="h-full w-full rounded-lg bg-gray-100 border-0">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="border-0">
          {option.map((item) => (
            <SelectItem
              key={item.value}
              value={item.value}
              className="hover:bg-[#ECECEC]"
            >
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {onTouch && onError && <p className="text-sm text-red-500">{onError}</p>}
    </label>
  );
};
