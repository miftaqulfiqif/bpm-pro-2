type ItemsResultProps = {
  title: string;
  value: number;
  unit: string;
};

export const ItemsResult = (props: ItemsResultProps) => {
  const { title, value, unit } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1">
        <svg
          fill="#000000"
          width="34px"
          height="34px"
          viewBox="0 0 24 24"
          id="blood-drop"
          data-name="Flat Color"
          xmlns="http://www.w3.org/2000/svg"
          className="icon flat-color"
        >
          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
          <g
            id="SVGRepo_tracerCarrier"
            strokeLinecap="round"
            strokeLinejoin="round"
          ></g>
          <g id="SVGRepo_iconCarrier">
            <path
              id="primary"
              d="M14.17,7.78c-.89-1.33-2-3-3.3-5.28a1,1,0,0,0-1.74,0c-1.31,2.31-2.41,4-3.3,5.28C4,10.52,3,12,3,15a7,7,0,0,0,14,0C17,12,16,10.52,14.17,7.78Z"
              fill="black"
            ></path>
            <path
              id="secondary"
              d="M19.05,11c-.58-.88-1.31-2-2.18-3.5a1,1,0,0,0-1.74,0C14.26,9,13.53,10.12,13,11,11.73,12.82,11,13.92,11,16a5,5,0,0,0,10,0C21,13.92,20.27,12.82,19.05,11Z"
              fill="blue"
            ></path>
          </g>
        </svg>{" "}
        <p className="font-bold">{title}</p>
      </div>
      <div className="flex items-end w-fit mx-auto gap-1">
        <p className="text-4xl">{value === 0 ? "--" : `${value}`}</p>
        <p className="text-xs pb-1">{value === 0 ? "" : `${unit}`}</p>
      </div>
    </div>
  );
};
