import { Button, Flex, HStack, Heading } from '@chakra-ui/react'
import { useSetAtom } from 'jotai'
import type { FC } from 'react'
import { NavLink } from 'react-router-dom'

import { isInputDrawerOpenAtom } from '../state'

const links = [
  { label: 'Kártyatartó', to: '/card-holder' },
  { label: 'T-zseb', to: '/t-pocket' },
  { label: 'Elülső zseb', to: '/front-pocket' },
  { label: 'Hátlap', to: '/back-panel' },
]

export const Header: FC = () => {
  const setIsInputDrawerOpen = useSetAtom(isInputDrawerOpenAtom)

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      gap="6"
      px="6"
      py="3"
      bg="bg.panel"
      borderBottomWidth="1px"
      borderColor="border"
    >
      <HStack gap="8">
        <Heading size="md">Kártyatartó Generátor</Heading>

        <HStack gap="2">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to}>
              {({ isActive }) => (
                <Button colorPalette={isActive ? 'blue' : 'gray'} variant={isActive ? 'subtle' : 'ghost'}>
                  {link.label}
                </Button>
              )}
            </NavLink>
          ))}
        </HStack>
      </HStack>

      <Button colorPalette="blue" onClick={() => setIsInputDrawerOpen(true)}>
        Beállítások
      </Button>
    </Flex>
  )
}
