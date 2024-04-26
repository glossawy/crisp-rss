import { useDocumentTitle } from '@mantine/hooks'

export default function useAppTitle(title?: string | null) {
  const docTitle = title == null ? 'CrispRSS' : `CrispRSS - ${title}`

  useDocumentTitle(docTitle)
}
