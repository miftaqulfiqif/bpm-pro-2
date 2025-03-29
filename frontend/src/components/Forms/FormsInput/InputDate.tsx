type InputDateProps = {
  label: string;
  disabled?: boolean;
  name: string;
  value: string;
  onError?: string;
  onTouch: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

export function InputDate(props: InputDateProps) {
  const { label, disabled, name, onChange, value, onTouch, onError } = props;
  return (
    <label htmlFor="" className="w-fit">
      <p className="text-lg ml-1">{label}</p>
      <input
        type="date"
        disabled={disabled}
        name={name}
        onChange={onChange}
        value={value}
        className="bg-[#ECECEC] text-sm px-4 py-2 rounded-sm w-fit disabled:bg-slate-200"
      />
      {onTouch && onError && <p className="text-sm text-red-500">{onError}</p>}
    </label>
  );
}
