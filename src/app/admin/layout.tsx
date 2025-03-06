import Navbar from "@/components/global/Navbar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware logic can be applied here or in a separate middleware file
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
