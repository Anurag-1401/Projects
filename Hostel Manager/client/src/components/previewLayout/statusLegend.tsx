const items = [
  { label: "Available", color: "bg-status-available" },
  { label: "Partially Filled", color: "bg-status-partial" },
  { label: "Full", color: "bg-status-full" },
];

const StatusLegend = () => (
  <div className="flex items-center gap-4">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-1.5">
        <span className={`w-3 h-3 rounded-full ${item.color}`} />
        <span className="text-xs text-muted-foreground">{item.label}</span>
      </div>
    ))}
  </div>
);

export default StatusLegend;
