interface Props {
  title: string
  description: string
}

// The title block at the top of each section page (Events, About, Gallery, Careers, Partners)
export default function PageHeader({ title, description }: Props) {
  return (
    <div className="space-y-2 pt-6 pb-8 md:space-y-5">
      <h1 className="text-3xl leading-9 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10 md:text-6xl md:leading-14">{title}</h1>
      <p className="text-lg leading-7 text-gray-600">{description}</p>
    </div>
  )
}
