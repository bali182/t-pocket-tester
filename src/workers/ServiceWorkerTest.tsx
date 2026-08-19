import { Button, Spinner } from '@chakra-ui/react'
import { wrap } from 'comlink'
import { useCallback, useState } from 'react'
import CpuTestWorker from './cpuTest.worker?worker'

const runCpuTest = wrap<(iterations: number) => number>(new CpuTestWorker())

export const ServiceWorkerTest = () => {
  const [isCpuTestRunning, setCpuTestRunning] = useState(false)

  const handleRunCpuTest = useCallback(async () => {
    setCpuTestRunning(true)
    const result = await runCpuTest(500_000_000)
    console.log(result)
    setCpuTestRunning(false)
  }, [])

  return (
    <Button onClick={handleRunCpuTest} disabled={isCpuTestRunning}>
      {isCpuTestRunning && <Spinner />}
      {isCpuTestRunning ? 'Worker is working' : 'Test worker'}
    </Button>
  )
}
