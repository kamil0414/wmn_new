import Link from "next/link";
import Layout from "../components/Layout";

function Expenses() {
  return (
    <Layout>
      <div className="container mx-auto mt-10">
        <Link href="/api/financialReport">Sprawozdanie finansowe</Link>
      </div>
    </Layout>
  );
}

export default Expenses;
