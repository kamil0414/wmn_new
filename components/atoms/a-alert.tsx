import { ReactNode } from "react";
import alertIcon from "@/svg/alertIcon.svg";
import ASvg from "./a-svg";

type AAlertProps = {
  className?: string;
  title: string;
  color?: string;
  children: ReactNode;
};
export default function AAlert({
  className,
  title,
  color,
  children,
}: AAlertProps) {
  const backgroundColor =
    color?.toLocaleLowerCase() === "red"
      ? "bg-red-100"
      : color?.toLocaleLowerCase() === "yellow"
        ? "bg-amber-100"
        : "bg-blue-100";

  const borderColor =
    color?.toLocaleLowerCase() === "red"
      ? "border-red-100"
      : color?.toLocaleLowerCase() === "yellow"
        ? "border-amber-100"
        : "border-blue-100";

  const textColor =
    color?.toLocaleLowerCase() === "red"
      ? "text-red-600"
      : color?.toLocaleLowerCase() === "yellow"
        ? "text-amber-600"
        : "text-blue-600";

  return (
    <div
      className={`rounded-lg border ${borderColor} bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4 ${
        className ?? ""
      }`}
    >
      <div className="sm:flex sm:items-start">
        <div
          className={`mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${backgroundColor} sm:mx-0 sm:h-10 sm:w-10`}
        >
          <ASvg svg={alertIcon} className={`${textColor} h-6 w-6`} />
        </div>
        <div className="mt-3 flex-1 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <h3
            className="text-base font-semibold leading-6 text-gray-900"
            id="modal-title"
          >
            {title}
          </h3>
          <div className="mt-2">
            <div className="text-sm text-gray-500">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
