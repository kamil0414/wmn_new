type ASvgProps = {
  className?: string;
  svg: any;
  ariaLabel?: string;
  ariaHidden?: boolean;
};

export default function ASvg({
  className,
  svg,
  ariaLabel,
  ariaHidden,
}: ASvgProps) {
  const Svg = svg;
  return (
    <span className={`a-svg ${className ?? ""}`}>
      <Svg aria-label={ariaLabel} aria-hidden={ariaHidden} />
    </span>
  );
}
