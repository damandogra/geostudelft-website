import NextImage, { ImageProps } from 'next/image'

const basePath = process.env.BASE_PATH

interface MDXImageProps {
  src: string
  alt?: string
}

type CustomImageProps = Omit<ImageProps, 'src'> & {
  src: string | MDXImageProps
}

const Image = ({ src, width = 400, height = 300, alt, ...rest }: CustomImageProps) => {
  // Handle case where src is an object from MDX processing
  if (typeof src === 'object' && src !== null && 'src' in src) {
    const { src: imageSrc, alt: mdxAlt } = src
    return <NextImage src={`${basePath || ''}${imageSrc}`} alt={mdxAlt || alt || ''} width={width} height={height} {...rest} />
  }

  // Handle normal string src
  return <NextImage src={`${basePath || ''}${src}`} alt={alt || ''} width={width} height={height} {...rest} />
}

export default Image
