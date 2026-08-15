import { Flex, Text } from '@chakra-ui/react'
import { FC } from 'react'
import { MagicFixResultSchema } from '../../schemas/magicFixOperation'
import { useTranslation } from '../../translations/translation'

type MagicFixReviewPageProps = {
  result: MagicFixResultSchema
}

export const MagicFixReviewPage: FC<MagicFixReviewPageProps> = ({ result }) => {
  const t = useTranslation()

  return (
    <Flex height="full" p="6">
      {result.type === 'success' && <Text>{t.magicFix.dialog.review.success}</Text>}
      {result.type === 'error' && <Text>{t.magicFix.dialog.review.error}</Text>}
      {result.type === 'no-result' && <Text>{t.magicFix.dialog.review.noResult}</Text>}
    </Flex>
  )
}
