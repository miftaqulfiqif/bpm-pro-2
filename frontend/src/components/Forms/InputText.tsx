type InputTextProps = {
  label: string;
  placeholder: string;
};

export const InputText = (prop: InputTextProps) => {
  const { label, placeholder } = prop;
  return (
    <label htmlFor="" className="w-full">
      <p className="text-lg ml-1">{label}</p>
      <input
        type="text"
        className="bg-white shadow-[inset_0_1px_2px_rgba(0,0,0,0.4)] text-xl px-4 py-2 rounded-sm w-full"
        placeholder={placeholder}
      />
    </label>
  );
};
