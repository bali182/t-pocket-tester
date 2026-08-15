import { Flex, Progress, Text } from '@chakra-ui/react'
import { proxy, wrap } from 'comlink'
import { FC, useEffect, useState } from 'react'
import { MagicFixConfigSchema } from '../../schemas/magicFixConfig'
import { MagicFixApi, MagicFixProgressSchema } from '../../schemas/magicFixOperation'
import { ProjectSchema } from '../../schemas/project'
import { SubProjectSchema } from '../../schemas/subProject'
import { useTranslation } from '../../translations/translation'
import MagicFixWorker from '../../workers/magicFix.worker?worker'

type MagicFixProgressPageProps = {
  project: ProjectSchema
  subProject: SubProjectSchema
  config: MagicFixConfigSchema
}

export const MagicFixProgressPage: FC<MagicFixProgressPageProps> = ({ project, subProject, config }) => {
  const t = useTranslation()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const worker = new MagicFixWorker()
    const runMagicFix = wrap<MagicFixApi>(worker)
    const handleProgress = proxy((progress: MagicFixProgressSchema): void => {
      setProgress((progress.progress / progress.max) * 100)
    })

    runMagicFix(project, subProject.id, config, handleProgress)

    return () => worker.terminate()
  }, [config, project, subProject.id])

  return (
    <Flex flexDirection="column" height="full" p="6">
      <Text>{t.magicFix.dialog.progress.message}</Text>
      <Flex alignItems="center" gap="3" marginTop="auto">
        <Progress.Root flex="1" value={progress}>
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
        <Text fontVariantNumeric="tabular-nums" minWidth="10" textAlign="right">
          {Math.round(progress)}%
        </Text>
      </Flex>
    </Flex>
  )
}
