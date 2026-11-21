export default function Loading({ label = 'Loading watches...' }) {
  return <div className="loading-state" role="status"><span className="spinner-border spinner-border-sm" /> {label}</div>;
}
