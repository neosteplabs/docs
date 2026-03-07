export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
  <main className="pt-[100px] pb-[100px]">
    {children}
  </main>
  <footer className="footer">
    © 2026 NeoStep. Research use only.
  </footer>
</>
  );
}