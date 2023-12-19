"use client";

import Link from "next/link";
import { deleteExpense } from "./actions";

const deleteConfirm = async (id: number) => {
  if (confirm("Usunąć wydatek?")) {
    const response = await deleteExpense(id);

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
  <div className={`${className ?? ""} print:hidden`}>
    <Link href={`/expenses/edit/${id}`}>
      <button type="button" className="font-medium text-sky-600">
        Edytuj
      </button>
    </Link>
    <form action={() => deleteConfirm(id)}>
      <button type="submit" className="font-medium text-red-600">
        Usuń
      </button>
    </form>
  </div>
);
