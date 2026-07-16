import { Box, Grid, Text, chakra } from '@chakra-ui/react'
import type { FC, ReactNode } from 'react'

type SectionGroupRootProps = {
  children: ReactNode
}

type SectionGroupSectionProps = {
  children: ReactNode
}

type SectionGroupSectionHeaderProps = {
  children: ReactNode
}

type SectionGroupSectionRowTitleProps = {
  children?: ReactNode
}

type SectionGroupSectionRowEditorProps = {
  children: ReactNode
}

const SectionGroupRoot: FC<SectionGroupRootProps> = ({ children }) => {
  return (
    <Grid gridTemplateColumns="max-content minmax(0, 1fr)" pb="3" rowGap="3">
      {children}
    </Grid>
  )
}

const SectionGroupSection: FC<SectionGroupSectionProps> = ({ children }) => {
  return (
    <Grid columnGap="4" gridColumn="1 / -1" gridTemplateColumns="subgrid" rowGap="3">
      {children}
    </Grid>
  )
}

const SectionGroupSectionHeader: FC<SectionGroupSectionHeaderProps> = ({ children }) => {
  return (
    <Box bg="bg.muted" gridColumn="1 / -1" m="0" pl="4" py="1">
      <Text color="fg.muted" fontWeight="bold" textStyle="sm">
        {children}
      </Text>
    </Box>
  )
}

const SectionGroupSectionRowTitle: FC<SectionGroupSectionRowTitleProps> = ({ children }) => {
  return (
    <Text alignSelf="center" color="fg.muted" pl="4" textStyle="sm">
      {children}
    </Text>
  )
}

const SectionGroupSectionRowEditor: FC<SectionGroupSectionRowEditorProps> = ({ children }) => {
  return (
    <chakra.div minWidth="0" pr="4">
      {children}
    </chakra.div>
  )
}

export const SectionGroup = {
  Root: SectionGroupRoot,
  Section: SectionGroupSection,
  SectionHeader: SectionGroupSectionHeader,
  SectionRowTitle: SectionGroupSectionRowTitle,
  SectionRowEditor: SectionGroupSectionRowEditor,
}
