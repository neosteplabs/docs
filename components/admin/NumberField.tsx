type Props = {
  value: number;
  onChange: (val: number) => void;
  onBlur?: () => void;
  highlight?: boolean;
};

export default function NumberField({
  value,
  onChange,
  onBlur,
  highlight,
}: Props) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onBlur={onBlur}
      className={`w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none transition focus:ring-2 ${
        highlight
          ? "border-red-500 focus:ring-red-100"
          : "border-slate-200 focus:border-blue-500 focus:ring-blue-100"
      }`}
    />
  );
}