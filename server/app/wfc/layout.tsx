export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10" style={{width: '100vw', height: '100vh'}}>
      <div className="inline-block max-w-lg text-center justify-center items-center ">
        {children}
      </div>
    </section>
  );
}
