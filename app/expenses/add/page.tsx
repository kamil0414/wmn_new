import ExpenseForm from "../form";
import { categories } from "./query";

async function AddExpense() {
  return (
    <div className="container mx-auto px-4">
      <ExpenseForm className="mt-6" categories={categories} />
    </div>
  );
}
export default AddExpense;
