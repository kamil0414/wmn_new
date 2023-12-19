"use client";

import { deleteIncome } from "./actions";

const deleteConfirm = async (id: number) => {
  if (confirm("Usunąć wpłatę?")) {
    const response = await deleteIncome(id);

    if (response?.message) {
      alert(response?.message);
    }
  }
};

export const ActionButtons = ({
  id,
  className,
}: {
  id: number;
  className?: string;
}) => (
  <div className={className ?? ""}>
    <form action={() => deleteConfirm(id)}>
      <button type="submit" className="font-medium text-red-600">
        Usuń
      </button>
    </form>
  </div>
);
