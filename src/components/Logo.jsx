export default function Logo({ size = 'md' }) {
  const sizeClass = size === 'sm' ? 'logo-sm' : size === 'lg' ? 'logo-lg' : 'logo-md';

  return (
    <div className={`logo ${sizeClass}`}>
      <span>BF</span>
    </div>
  );
}
