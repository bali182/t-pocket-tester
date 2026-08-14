import { Steps } from '@chakra-ui/react'
import { FC, useCallback } from 'react'
import { PiCheck, PiGear, PiHourglass } from 'react-icons/pi'
import { useTranslation } from '../../translations/translation'

export type MagicFixStep = 'settings' | 'fixing' | 'review'

export type MagicFixStepsProps = {
  step: MagicFixStep
  onStepChange: (step: MagicFixStep) => void
}

const StepToIndex: Record<MagicFixStep, number> = {
  settings: 0,
  fixing: 1,
  review: 2,
}

const IndexToStep: MagicFixStep[] = ['settings', 'fixing', 'review']

export const MagicFixSteps: FC<MagicFixStepsProps> = ({ onStepChange, step }) => {
  const t = useTranslation()
  const activeStep = StepToIndex[step]

  const handleStepChange = useCallback((e: Steps.ChangeDetails) => onStepChange(IndexToStep[e.step]), [onStepChange])

  return (
    <Steps.Root size="xs" count={3} step={activeStep} onStepChange={handleStepChange}>
      <Steps.List>
        <Steps.Item index={StepToIndex.settings}>
          <Steps.Indicator>
            <Steps.Status incomplete={<PiGear />} complete={<PiGear />} />
          </Steps.Indicator>
          <Steps.Title>{t.magicFix.dialog.steps.settings}</Steps.Title>
          <Steps.Separator />
        </Steps.Item>
        <Steps.Item index={StepToIndex.fixing}>
          <Steps.Indicator>
            <Steps.Status incomplete={<PiHourglass />} complete={<PiHourglass />} />
          </Steps.Indicator>
          <Steps.Title>{t.magicFix.dialog.steps.fixing}</Steps.Title>
          <Steps.Separator />
        </Steps.Item>
        <Steps.Item index={StepToIndex.review}>
          <Steps.Indicator>
            <Steps.Status incomplete={<PiCheck />} complete={<PiCheck />} />
          </Steps.Indicator>
          <Steps.Title>{t.magicFix.dialog.steps.review}</Steps.Title>
          <Steps.Separator />
        </Steps.Item>
      </Steps.List>
    </Steps.Root>
  )
}
