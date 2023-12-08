import Link from "next/link";

export default function Loading() {
  return (
    <div className="container mx-auto mt-10">
      <Link href="/api/download/financialReport">Sprawozdanie finansowe</Link>
    </div>
  );
}
