import Link from '@/components/Link'

export default function NotFound() {
  return (
    <div className="mb-16 flex flex-col items-start justify-start md:mt-24 md:mb-24 md:flex-row md:items-center md:justify-center md:space-x-6">
      <div className="space-x-2 pt-6 pb-8 md:space-y-5">
        <h1 className="text-6xl leading-9 font-extrabold tracking-tight text-gray-900 md:border-r-2 md:px-6 md:text-8xl md:leading-14">404</h1>
      </div>
      <div className="max-w-md">
        <p className="mb-4 text-xl leading-normal font-bold md:text-2xl">Sorry, we couldn't find this page.</p>
        <p className="mb-8">But don't worry, you can find plenty of other things on our homepage.</p>
        <Link href="/" className="btn-primary">
          Back to homepage
        </Link>
      </div>
    </div>
  )
}
