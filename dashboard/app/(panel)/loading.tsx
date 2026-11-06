export default function AdminPanelLoading() {
  return (
    <div aria-busy="true" aria-label="Loading" className="animate-pulse">
      <div className="h-9 w-56 rounded-lg bg-cream-dark" />
      <div className="mt-4 h-4 w-96 max-w-full rounded bg-cream-dark" />
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="h-28 rounded-xl bg-cream-dark/70" />
        ))}
      </div>
    </div>
  );
}
