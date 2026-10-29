import { Link } from 'react-router-dom'

export default function Button({
  variant = 'primary', size = 'md', to, block = false, className = '', children, ...rest
}) {
  const cls = ['btn', `btn--${variant}`, size !== 'md' && `btn--${size}`, block && 'btn--block', className]
    .filter(Boolean).join(' ')

  if (to) return <Link to={to} className={cls} {...rest}>{children}</Link>
  return <button type="button" className={cls} {...rest}>{children}</button>
}