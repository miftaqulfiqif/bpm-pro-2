type ItemsResultProps = {
  icon: string;
  title: string;
  value: number;
  unit: string;
};

export const ItemsResult = (props: ItemsResultProps) => {
  const { icon, title, value, unit } = props;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <img src={icon} className="w-6 h-6" alt="" />
        <p className="font-semibold">{title}</p>
      </div>
      <div className="flex items-end w-fit mx-auto gap-1">
        <p className="text-5xl">{value === 0 ? "--" : `${value}`}</p>
        <p className="text-xs pb-1">{value === 0 ? "" : `${unit}`}</p>
      </div>
    </div>
  );
};
