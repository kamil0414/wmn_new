import ASvg from "@/atoms/a-svg";
import spinnerIcon from "@/svg/spinnerIcon.svg";

export default function OSpinner() {
  return (
    <div className="flex h-[calc(100vh-64px)] items-center justify-center">
      <div className="inline-flex items-center rounded-md px-4 py-2 text-sm font-semibold leading-6 text-sky-500 transition duration-150 ease-in-out">
        <ASvg
          className="-ml-1 mr-3 h-5 w-5 animate-spin text-sky-500"
          svg={spinnerIcon}
        ></ASvg>
        Ładowanie...
      </div>
    </div>
  );
}
