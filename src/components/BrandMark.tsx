type BrandMarkProps = {
  inverse?: boolean;
  compact?: boolean;
};

export function BrandMark({ inverse = false, compact = false }: BrandMarkProps) {
  return (
    <a className={`brand-mark ${inverse ? "brand-mark--inverse" : ""}`} href="#top" aria-label="熊奇首页">
      <img src="/assets/xiongqi-mark.png" alt="" aria-hidden="true" />
      <span className="brand-word">
        <strong>熊奇</strong>
        {!compact && <small>XIONGQI</small>}
      </span>
    </a>
  );
}
