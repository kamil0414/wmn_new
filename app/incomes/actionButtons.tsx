"use client";

import deleteIncome from "./actions";

const deleteConfirm = async (id: number) => {
  if (confirm("Usunąć wpłatę?")) {
    const response = await deleteIncome(id);

    if (response?.message) {
      alert(response?.message);
    }
  }
};

export default function ActionButtons({
  id,
  className,
}: {
  id: number;
  className?: string;
}) {
  return (
    <div className={`${className ?? ""} print:hidden`}>
      <form action={() => deleteConfirm(id)}>
        <button type="submit" className="font-medium text-red-600">
          Usuń
        </button>
      </form>
    </div>
  );
}
