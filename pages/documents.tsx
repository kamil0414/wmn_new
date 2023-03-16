import React from "react";
import Layout from "../components/Layout";
import Link from "next/link";

const Expenses: React.FC<any> = (props) => {


  return (
    <Layout>
      <div className="container mx-auto mt-10">
        <Link href="/api/financialReport">Sprawozdanie finansowe</Link>
      </div>
    </Layout>
  );
};

export default Expenses;
