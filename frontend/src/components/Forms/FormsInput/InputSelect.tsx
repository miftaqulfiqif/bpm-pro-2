type InputSelectProps = {
  label: string;
  name: string;
  placeholder: string;
  disabled?: boolean;
  option: string[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  onTouch: any;
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
      <p className="text-lg ml-1">{label}</p>
      <select
        className="bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] text-xl px-4 py-2 rounded-sm w-full"
        disabled={disabled}
        name={name}
        onChange={onChange}
        value={value}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {option.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {onTouch && onError && <p className="text-sm text-red-500">{onError}</p>}
    </label>
  );
};
