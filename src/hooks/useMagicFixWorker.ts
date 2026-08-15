import { proxy, wrap } from 'comlink'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { MagicFixConfigSchema } from '../schemas/magicFixConfig'
import type { MagicFixApi, MagicFixProgressSchema, MagicFixResultSchema } from '../schemas/magicFixOperation'
import type { ProjectSchema } from '../schemas/project'
import MagicFixWorker from '../workers/magicFix.worker?worker'

export type UseMagicFixRunResult = {
  cancel: () => void
  progress: number
  result: MagicFixResultSchema | undefined
  start: (project: ProjectSchema, subProjectId: string, config: MagicFixConfigSchema) => void
}

export const useMagicFixWorker = (): UseMagicFixRunResult => {
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState<MagicFixResultSchema>()
  const workerRef = useRef<Worker | undefined>(undefined)
  const runIdRef = useRef(0)

  const cancel = useCallback((): void => {
    workerRef.current?.terminate()
    workerRef.current = undefined
    runIdRef.current += 1
    setProgress(0)
    setResult(undefined)
  }, [])

  const start = useCallback(
    (project: ProjectSchema, subProjectId: string, config: MagicFixConfigSchema): void => {
      cancel()

      const runId = runIdRef.current
      const worker = new MagicFixWorker()
      const runMagicFix = wrap<MagicFixApi>(worker)

      workerRef.current = worker

      const handleProgress = proxy((progress: MagicFixProgressSchema): void => {
        if (runId !== runIdRef.current) {
          return
        }
        setProgress((progress.progress / progress.max) * 100)
      })

      const handleResult = (result: MagicFixResultSchema): void => {
        if (runId !== runIdRef.current) {
          return
        }

        worker.terminate()
        workerRef.current = undefined
        runIdRef.current += 1
        setProgress(100)
        setResult(result)
      }

      const handleError = (e: unknown): void => {
        if (runId !== runIdRef.current) {
          return
        }

        worker.terminate()
        workerRef.current = undefined
        runIdRef.current += 1
        setProgress(100)
        setResult({
          type: 'error',
          issues: [{ severity: 'error', message: `Unexpected error: ${e}` }],
        })
      }

      const run = async (): Promise<void> => {
        try {
          const result = await runMagicFix(project, subProjectId, config, handleProgress)
          handleResult(result)
        } catch (e) {
          handleError(e)
        }
      }

      run()
    },
    [cancel],
  )

  useEffect(() => cancel, [cancel])

  return {
    cancel,
    progress,
    result,
    start,
  }
}
