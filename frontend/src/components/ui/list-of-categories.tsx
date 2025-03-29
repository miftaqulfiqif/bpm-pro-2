import arrowDownIcon from "@/assets/icons/arrow-down-sign-to-navigate 2.svg";

type ListOfCategoriesProps = {
  title: string;
  values: {
    minSystolic: number;
    maxSystolic: number;
    minDiastolic: number;
    maxDiastolic: number;
  };
};

export const ListOfCategories = ({ title, values }: ListOfCategoriesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-row justify-between">
        <p className="font-semibold">{title}</p>
        <button onClick={() => {}}>
          <img src={arrowDownIcon} alt="" className="w-4 h-4 rotate-[-90deg]" />
        </button>
      </div>
      <div className="flex flex-col mx-10">
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
          <p>Min Diastolic</p>
          <div className="flex flex-row gap-8">
            <p>{values.maxDiastolic}</p>
            <p>mmHg</p>
          </div>
        </div>

        {/* Button delete category */}
        <button className="border-2 border-red-500 text-red-500 rounded-xl px-6 py-1 mt-6">
          Delete category
        </button>
      </div>
    </div>
  );
};
