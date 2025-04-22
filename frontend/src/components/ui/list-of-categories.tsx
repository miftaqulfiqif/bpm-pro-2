import arrowDownIcon from "@/assets/icons/arrow-down-sign-to-navigate 2.svg";

type ListOfCategoriesProps = {
  id: number;
  title: string;
  values: {
    minSystolic: number;
    maxSystolic: number;
    minDiastolic: number;
    maxDiastolic: number;
    minAge: number;
    maxAge: number;
    color: string;
    gender: string;
  };
  deleteCategory: (id: number) => void;
  categoryOpen: (id: number) => void;
  isOpen?: boolean;
  isDefaultCategory: boolean;
};

export const ListOfCategories = ({
  id,
  title,
  values,
  deleteCategory,
  categoryOpen,
  isOpen,
  isDefaultCategory,
}: ListOfCategoriesProps) => {
  return (
    <div className="flex flex-col gap-2">
      <a
        className="flex flex-row items-center justify-between cursor-pointer "
        onClick={() => {
          categoryOpen(id);
        }}
      >
        <div className="flex flex-row gap-4 items-center">
          <p
            className={`font-semibold bg-[${values.color}]  px-4 py-1 rounded-full`}
          >
            {title}
          </p>
          <p className="bg-blue-200 px-2 py-1 rounded-lg">{values.gender}</p>
        </div>
        <button>
          <img
            src={arrowDownIcon}
            alt=""
            className={`w-4 h-4 transition-transform duration-300 ${
              isOpen ? "rotate-0" : "rotate-[-90deg]"
            }`}
          />
        </button>
      </a>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen
            ? "opacity-100 max-h-[1000px] scale-100"
            : "opacity-0 max-h-0 scale-95 pointer-events-none"
        } flex flex-col mx-5`}
      >
        <div className="rounded-lg shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] p-4 flex flex-row gap-3 justify-between">
          <div className="flex flex-col gap-2 w-full border-gray-300 border rounded-xl p-2">
            <p className="font-semibold">Systolic</p>
            <div className="flex flex-row justify-between bg-blue-200 px-4 rounded-xl">
              <p>− Min</p>
              <div className="flex flex-row gap-4">
                <p>{values.minSystolic}</p>
                <p>mmHg</p>
              </div>
            </div>
            <div className="flex flex-row justify-between bg-red-200 px-4 rounded-xl">
              <p>+ Max</p>
              <div className="flex flex-row gap-4">
                <p>{values.maxSystolic}</p>
                <p>mmHg</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full border-gray-300 border rounded-xl p-2">
            <p className="font-semibold">Diastolic</p>
            <div className="flex flex-row justify-between bg-blue-200 px-4 rounded-xl">
              <p>− Min</p>
              <div className="flex flex-row gap-4">
                <p>{values.minDiastolic}</p>
                <p>mmHg</p>
              </div>
            </div>
            <div className="flex flex-row justify-between bg-red-200 px-4 rounded-xl">
              <p>+ Max</p>
              <div className="flex flex-row gap-4">
                <p>{values.maxDiastolic}</p>
                <p>mmHg</p>
              </div>
            </div>
          </div>
          {values.minAge !== 0 && values.maxAge !== 0 && (
            <div className="flex flex-col gap-2 w-full border-gray-300 border rounded-xl p-2">
              <p className="font-semibold">Age</p>
              <div className="flex flex-row justify-between bg-blue-200 px-4 rounded-xl">
                <p>− Min</p>
                <div className="flex flex-row gap-4">
                  <p>{values.minAge}</p>
                  <p>Years</p>
                </div>
              </div>
              <div className="flex flex-row justify-between bg-red-200 px-4 rounded-xl">
                <p>+ Max</p>
                <div className="flex flex-row gap-4">
                  <p>{values.maxAge}</p>
                  <p>Years</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Button delete category */}
        {!isDefaultCategory && (
          <button
            className="border-2 border-red-500 text-red-500 rounded-xl px-6 py-1 mt-6 w-full"
            onClick={() => {
              deleteCategory(id);
            }}
          >
            Delete category
          </button>
        )}
      </div>
    </div>
  );
};
