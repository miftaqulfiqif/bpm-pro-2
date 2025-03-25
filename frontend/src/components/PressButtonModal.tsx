type PressButtonModalProps = {
  start: boolean;
  message: string;
};

export const PressButtonModal = (props: PressButtonModalProps) => {
  const { start, message } = props;
  return (
    <div
      className={`fixed top-0 left-0 w-full h-full bg-transparent bg-opacity-50 z-40 ${
        start ? "" : "hidden"
      }`}
      style={{ backdropFilter: "blur(5px)" }}
    >
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl p-10 z-50">
        <div className="flex flex-col gap-4">
          <p className="text-2xl font-semibold">
            Press Start Button at BPM PRO 2
          </p>
          <p className="text-center">{message}</p>
        </div>
      </div>
    </div>
  );
};
