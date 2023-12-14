import { revalidatePath } from "next/cache";

export default function Refresh() {
  revalidatePath("/", "layout");
  return <span>ok</span>;
}
