type Props = {
  value: string;
  onChange: (val: string) => void;
  onBlur?: () => void;
  placeholder?: string;
};

export default function InputField({
  value,
  onChange,
  onBlur,
  placeholder,
}: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      placeholder={placeholder}
      className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
  );
}