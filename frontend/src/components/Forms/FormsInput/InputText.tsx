type InputTextProps = {
  label?: string;
  disabled?: boolean;
  type?: string;
  placeholder: string;
  name: string;
  value: string | number;
  onTouch: any;
  onError?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export const InputText = (props: InputTextProps) => {
  const {
    label,
    type,
    disabled,
    placeholder,
    name,
    onChange,
    value,
    onTouch,
    onError,
  } = props;
  return (
    <div className="w-full">
      <label htmlFor={name} className="w-full">
        <p className="text-lg ml-1">{label}</p>
        <input
          type={type || "text"}
          name={name}
          disabled={disabled}
          placeholder={placeholder}
          onChange={onChange}
          value={value}
          className="bg-[#ECECEC] text-sm px-4 py-2 rounded-sm w-full disabled:bg-slate-200"
        />
        {onError && onTouch && (
          <p className="text-sm text-red-500">{onError}</p>
        )}
      </label>
    </div>
  );
};
