export default function SectionLabel({
  number,
  title,
  className = "",
}: {
  number: string;
  title: string;
  className?: string;
}) {
  return (
    <p className={`label flex items-center gap-3 ${className}`}>
      <span className="text-lime">{number}</span>
      <span className="text-offwhite/50">{title}</span>
    </p>
  );
}
