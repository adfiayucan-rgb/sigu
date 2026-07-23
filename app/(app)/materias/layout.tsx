import { MateriaHeader } from "./_components/materia-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex flex-col gap-6">
        <MateriaHeader />
        {children}
      </div>
    </>
  );
}
