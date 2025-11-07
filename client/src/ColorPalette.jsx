const PALETTE = [
  { name: 'tanager-primary', className: 'bg-tanager-primary' },
  { name: 'tanager-primary-light', className: 'bg-tanager-primary-light' },
  { name: 'tanager-primary-bg', className: 'bg-tanager-primary-bg' },
  { name: 'tanager-accent', className: 'bg-tanager-accent' },
  { name: 'tanager-info', className: 'bg-tanager-info' },
  { name: 'tanager-success', className: 'bg-tanager-success' },
  { name: 'tanager-warning', className: 'bg-tanager-warning' },
  { name: 'tanager-danger', className: 'bg-tanager-danger' },
  { name: 'tanager-bg', className: 'bg-tanager-bg' },
  { name: 'tanager-bg-alt', className: 'bg-tanager-bg-alt' },
  { name: 'tanager-border', className: 'bg-tanager-border' },
  { name: 'tanager-text', className: 'bg-tanager-text' },
  { name: 'tanager-text-muted', className: 'bg-tanager-text-muted' },
];

export default function ColorPalette() {
  return (
    <div className="p-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mt-24">
      {PALETTE.map((c) => (
        <div
          key={c.name}
          className={`${c.className} border rounded-lg h-28 shadow flex flex-col items-center justify-center gap-1`}
        >
          <span className="bg-white/70 px-2 rounded text-xs font-mono">
            {c.name}
          </span>
          <span className="text-xs opacity-80">.{c.className}</span>
        </div>
      ))}
    </div>
  );
}
