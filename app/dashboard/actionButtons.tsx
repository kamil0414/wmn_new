"use client";

import markRemindAsCompleted from "./actions";

export default function ActionButtons({
  id,
  className,
}: {
  id: number;
  className?: string;
}) {
  const handleAction = async (reminderId: number) => {
    const response = await markRemindAsCompleted(reminderId);

    if (response?.message) {
      alert(response?.message);
    }
  };

  return (
    <div className={`${className ?? ""}`}>
      <form action={() => handleAction(id)}>
        <button
          type="submit"
          className="pointer-events-auto mb-2 cursor-pointer rounded-md border border-sky-600 px-3 py-2 text-[0.8125rem] font-semibold leading-5 text-sky-600"
        >
          Oznacz jako ukończone
        </button>
      </form>
    </div>
  );
}
