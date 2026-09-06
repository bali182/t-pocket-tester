type KnownContentTypes = 'image/svg+xml' | 'application/json'
type KnownCharsets = 'charset=utf-8'

type DownloadFileParams = {
  content: string
  fileName: string
  contentType: KnownContentTypes
  charSet?: KnownCharsets
}

export const downloadFile = ({
  charSet = 'charset=utf-8',
  content,
  contentType,
  fileName,
}: DownloadFileParams): void => {
  const blob = new Blob([content], { type: `${contentType};${charSet}` })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}
