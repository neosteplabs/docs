type Props = {
  inventory: number;
  threshold: number;
};

export default function StatusBadge({ inventory, threshold }: Props) {
  if (inventory <= 0) {
    return (
      <span className="rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-700">
        Out
      </span>
    );
  }

  if (inventory < threshold) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
        Low
      </span>
    );
  }

  return (
    <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
      In Stock
    </span>
  );
}