import { Mail, Linkedin, Instagram } from './icons'

const components = {
  mail: Mail,
  linkedin: Linkedin,
  instagram: Instagram,
}

const labels: Record<keyof typeof components, string> = {
  mail: 'Email',
  linkedin: 'LinkedIn',
  instagram: 'Instagram',
}

// Full class names, so Tailwind can find them when it scans this file
const sizes = {
  5: 'h-5 w-5',
  6: 'h-6 w-6',
  8: 'h-8 w-8',
}

type SocialIconProps = {
  kind: keyof typeof components
  href: string | undefined
  size?: keyof typeof sizes
}

const SocialIcon = ({ kind, href, size = 8 }: SocialIconProps) => {
  if (!href || (kind === 'mail' && !/^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(href))) return null

  const SocialSvg = components[kind]

  return (
    <a className="group text-sm text-gray-700 transition" target="_blank" rel="noopener noreferrer" href={href}>
      <span className="sr-only">{labels[kind]}</span>
      <SocialSvg aria-hidden="true" className={`group-hover:text-primary-700 fill-current ${sizes[size]}`} />
    </a>
  )
}

export default SocialIcon
