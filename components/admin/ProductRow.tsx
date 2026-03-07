import Image from "next/image";
import InputField from "./InputField";
import NumberField from "./NumberField";
import StatusBadge from "./StatusBadge";
import ActionButton from "./ActionButton";

type Product = {
  id: string;
  code: string;
  description: string;
  image: string;
  visible: boolean;
  displayOrder: number;
  inventory: number;
  prices: {
    public: number;
    vip: number;
    wholesale: number;
  };
};

type Props = {
  product: Product;
  threshold: number;
  onUpdate: (field: string, value: any) => void;
  onSave: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
};

export default function ProductRow({
  product,
  threshold,
  onUpdate,
  onSave,
  onDelete,
  onMoveUp,
  onMoveDown,
}: Props) {
  const imageSrc =
    product.image && product.image.startsWith("/")
      ? product.image
      : null;

  return (
    <div className="grid grid-cols-[80px_140px_1fr_100px_100px_100px_100px_120px_160px] items-center gap-4 border-b border-slate-100 py-4 hover:bg-slate-50">
      <div className="relative h-[60px] w-[60px] overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={product.code}
            fill
            sizes="60px"
            className="object-contain"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
            No Image
          </div>
        )}
      </div>

      <InputField
        value={product.code}
        onChange={(val) => onUpdate("code", val)}
        onBlur={onSave}
      />

      <InputField
        value={product.description}
        onChange={(val) => onUpdate("description", val)}
        onBlur={onSave}
      />

      <NumberField
        value={product.inventory}
        highlight={product.inventory < threshold}
        onChange={(val) => onUpdate("inventory", val)}
        onBlur={onSave}
      />

      <StatusBadge inventory={product.inventory} threshold={threshold} />

      <NumberField
        value={product.prices.public}
        onChange={(val) => onUpdate("prices.public", val)}
        onBlur={onSave}
      />

      <NumberField
        value={product.prices.vip}
        onChange={(val) => onUpdate("prices.vip", val)}
        onBlur={onSave}
      />

      <NumberField
        value={product.prices.wholesale}
        onChange={(val) => onUpdate("prices.wholesale", val)}
        onBlur={onSave}
      />

      <div className="flex gap-2">
        <ActionButton label="↑" onClick={onMoveUp} />
        <ActionButton label="↓" onClick={onMoveDown} />
        <ActionButton label="Delete" onClick={onDelete} variant="danger" />
      </div>
    </div>
  );
}