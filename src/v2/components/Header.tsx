import { Button, Flex, HStack, Heading } from '@chakra-ui/react'
import type { FC } from 'react'
import { NavLink } from 'react-router-dom'
import { routes } from '../routes'

export const Header: FC = () => {
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
          {routes.map((link) => (
            <NavLink key={link.path} to={link.path}>
              {({ isActive }) => (
                <Button colorPalette={isActive ? 'blue' : 'gray'} variant={isActive ? 'subtle' : 'ghost'}>
                  {link.label}
                </Button>
              )}
            </NavLink>
          ))}
        </HStack>
      </HStack>
    </Flex>
  )
}
