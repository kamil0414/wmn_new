import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export async function GET(req: any, res: any) {
  const secret: string = req.nextUrl.searchParams.get("secret");
  if (secret?.toLocaleLowerCase() !== process.env.REVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    revalidatePath("/", "layout");
    return NextResponse.json({ revalidated: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
