type Props = {
  label: string;
  onClick: () => void;
  variant?: "primary" | "danger" | "neutral";
};

export default function ActionButton({
  label,
  onClick,
  variant = "neutral",
}: Props) {
  const styles = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700",
    danger:
      "bg-red-600 text-white hover:bg-red-700",
    neutral:
      "bg-slate-200 text-slate-700 hover:bg-slate-300",
  };

  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-2 text-sm font-medium transition ${styles[variant]}`}
    >
      {label}
    </button>
  );
}