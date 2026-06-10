import Link from "next/link";
import { TraceDashboard } from "@/components/TraceDashboard";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-6 py-4">
          <Link href="/" className="text-sm font-medium text-indigo-600 hover:text-indigo-700">
            ← All Projects
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <TraceDashboard projectId={id} />
      </div>
    </main>
  );
}
