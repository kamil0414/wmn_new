import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// eslint-disable-next-line import/prefer-default-export
export async function GET(req: any) {
  const secret: string = req.nextUrl.searchParams.get("secret");
  if (secret?.toLocaleLowerCase() !== process.env.REVALIDATION_SECRET_TOKEN) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    revalidateTag("operationSums");
    return NextResponse.json({ revalidated: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
