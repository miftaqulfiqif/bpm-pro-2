import { LucideIcon } from "lucide-react";
import React from "react";
interface NavbarProps {
  className?: string;
  title: string;
  url: string;
  isActive?: boolean;
  icon?: string | LucideIcon;
  iconActive?: string;
}

export const AppNavbar: React.FC<NavbarProps> = ({
  className,
  title,
  url,
  isActive,
  icon: Icon,
  iconActive: IconActive,
}: NavbarProps) => {
  return (
    <a
      className={
        isActive
          ? "flex gap-2 bg-[#0D00FF] text-white px-10 py-3 shadow-[4px_4px_15px_rgba(0,0,0,0.3)] shadow-inner-[inset_4px_4px_15px_rgba(1,1,1,0.3)] w-fit rounded-4xl items-center"
          : "flex gap-2 bg-white px-10 py-3 shadow-[4px_4px_15px_rgba(0,0,0,0.3)] w-fit rounded-4xl hover:underline items-center" +
            " " +
            className
      }
      href={url}
    >
      {typeof Icon === "string" ? (
        <img src={isActive ? IconActive : Icon} className="w-8 h-8" />
      ) : (
        <>{Icon && <Icon className="w-6 h-6" />}</>
      )}
      {title}
    </a>
  );
};
