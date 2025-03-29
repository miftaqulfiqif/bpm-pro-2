type MenuSettingsProps = {
  title: string;
  icon: string;
  isActive?: boolean;
  onClick: () => void;
  className?: string;
};

export const MenuSettings = ({
  title,
  icon,
  isActive,
  onClick,
  className,
}: MenuSettingsProps) => {
  return (
    <div
      onClick={onClick}
      className={
        `${
          isActive ? "border-1 border-[#0D00FF] " : ""
        } flex flex-row gap-4 items-center w-xs rounded-4xl px-6 py-2 hover:underline font-normal cursor-pointer` +
        " " +
        className
      }
    >
      <img src={icon} className="w-8 h-8" alt="" />
      <p className="text-lg font-semibold">{title}</p>
    </div>
  );
};
