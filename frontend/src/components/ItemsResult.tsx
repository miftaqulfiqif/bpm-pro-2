type ItemsResultProps = {
  icon: string;
  title: string;
  value: number;
  unit: string;
};

export const ItemsResult = (props: ItemsResultProps) => {
  const { icon, title, value, unit } = props;
  return (
    <div className="flex flex-row gap-3 bg-[#ECECEC] p-4 rounded-3xl shadow-[0px_4px_4px_rgba(0,0,0,0.3)] items-center">
      <div className="flex items-center gap-2 w-1/2">
        <img src={icon} className="w-18 h-18" alt="" />
      </div>
      <div className="flex flex-col w-full gap-1">
        <p className="text-lg">{title}</p>
        <div className="flex flex-row ">
          <p className="text-4xl w-22">{value === 0 ? "--" : `${value}`}</p>
          <p className="text-xs justify-self-end self-end pb-1">
            {value === 0 ? "" : `${unit}`}
          </p>
        </div>
      </div>
    </div>
  );
};
