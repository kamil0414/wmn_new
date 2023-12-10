import Link from "next/link";

function Documents() {
  return (
    <div className="container mx-auto px-4">
      <div className="mt-6">
        <Link href="/api/download/financialReport">Sprawozdanie finansowe</Link>
      </div>
    </div>
  );
}

export default Documents;
