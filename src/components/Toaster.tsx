import { Toaster as ChakraToaster, createToaster, Portal, Stack, Toast } from '@chakra-ui/react'
import type { FC } from 'react'

import { portalRef } from '../portalRef'
import { isDefined } from '../utils/isDefined'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

export const Toaster: FC = () => {
  return (
    <Portal container={portalRef}>
      <ChakraToaster insetInline={{ mdDown: '4' }} toaster={toaster}>
        {(toast): React.JSX.Element => (
          <Toast.Root width={{ md: 'sm' }}>
            <Toast.Indicator />
            <Stack flex="1" gap="1">
              {isDefined(toast.title) ? <Toast.Title>{toast.title}</Toast.Title> : undefined}
              {isDefined(toast.description) ? <Toast.Description>{toast.description}</Toast.Description> : undefined}
            </Stack>
            {toast.closable ? <Toast.CloseTrigger /> : undefined}
          </Toast.Root>
        )}
      </ChakraToaster>
    </Portal>
  )
}
