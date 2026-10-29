export default function Badge({ tone = 'primary', children }) {
  return <span className={`badge badge--${tone}`}>{children}</span>
}