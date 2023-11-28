import Link from "next/link";

function Documents() {
  return (
    <div className="container mx-auto mt-10">
      <Link href="/api/financialReport">Sprawozdanie finansowe</Link>
    </div>
  );
}

export default Documents;
