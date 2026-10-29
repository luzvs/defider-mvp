export default function Card({ interactive = false, flat = false, className = '', children, ...rest }) {
  const cls = ['card', flat && 'card--flat', interactive && 'card--interactive', className]
    .filter(Boolean).join(' ')
  return <div className={cls} {...rest}>{children}</div>
}