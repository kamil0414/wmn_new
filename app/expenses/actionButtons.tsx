"use client";

import deleteExpense from "./actions";

const deleteConfirm = (id: number) => {
  if (confirm("Usunąć wydatek?")) {
    deleteExpense(id);
  }
};

export const ActionButtons = ({ id }: { id: number }) => (
  <div className="mb-1">
    <form action={() => deleteConfirm(id)}>
      <button type="submit" className="font-medium text-sky-600">
        Usuń
      </button>
    </form>
  </div>
);
