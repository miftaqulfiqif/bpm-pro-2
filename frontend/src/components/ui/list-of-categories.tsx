import arrowDownIcon from "@/assets/icons/arrow-down-sign-to-navigate 2.svg";
import { useState } from "react";

type ListOfCategoriesProps = {
  id: number;
  title: string;
  values: {
    minSystolic: number;
    maxSystolic: number;
    minDiastolic: number;
    maxDiastolic: number;
  };
  deleteCategory: (id: number) => void;
  categoryOpen: (id: number) => void;
  isOpen?: boolean;
};

export const ListOfCategories = ({
  id,
  title,
  values,
  deleteCategory,
  categoryOpen,
  isOpen,
}: ListOfCategoriesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <a
        href="#"
        className="flex flex-row justify-between"
        onClick={() => {
          categoryOpen(isOpen ? 0 : id);
        }}
      >
        <p className="font-semibold">{title}</p>
        <button>
          <img src={arrowDownIcon} alt="" className="w-4 h-4 rotate-[-90deg]" />
        </button>
      </a>
      <div className={isOpen ? "" : "hidden" + " flex-col mx-5"}>
        <div className="rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-4">
          <div className="flex flex-row justify-between">
            <p>Min Systolic</p>
            <div className="flex flex-row gap-8">
              <p>{values.minSystolic}</p>
              <p>mmHg</p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p>Max Systolic</p>
            <div className="flex flex-row gap-8">
              <p>{values.maxSystolic}</p>
              <p>mmHg</p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p>Min Diastolic</p>
            <div className="flex flex-row gap-8">
              <p>{values.minDiastolic}</p>
              <p>mmHg</p>
            </div>
          </div>
          <div className="flex flex-row justify-between">
            <p>Max Diastolic</p>
            <div className="flex flex-row gap-8">
              <p>{values.maxDiastolic}</p>
              <p>mmHg</p>
            </div>
          </div>
        </div>

        {/* Button delete category */}
        <button
          className="border-2 border-red-500 text-red-500 rounded-xl px-6 py-1 mt-6 w-full"
          onClick={() => {
            deleteCategory(id);
          }}
        >
          Delete category
        </button>
      </div>
    </div>
  );
};
