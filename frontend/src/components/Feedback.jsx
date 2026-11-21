export function ErrorMessage({ children }) {
  if (!children) return null;
  return <div className="alert alert-danger" role="alert">{children}</div>;
}

export function EmptyState({ title, children, action }) {
  return <div className="empty-state"><span className="empty-watch">◷</span><h2>{title}</h2><p>{children}</p>{action}</div>;
}
