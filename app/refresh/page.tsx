import { revalidatePath } from "next/cache";

export default async function Refresh() {
  revalidatePath("/", "layout");
  return <span>ok</span>;
}
