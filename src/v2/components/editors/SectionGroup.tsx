import { Grid, Text, chakra } from '@chakra-ui/react'
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
  return <Grid gridTemplateColumns="max-content minmax(0, 1fr)" pb="3">{children}</Grid>
}

const SectionGroupSection: FC<SectionGroupSectionProps> = ({ children }) => {
  return (
    <Grid columnGap="4" gridColumn="1 / -1" gridTemplateColumns="subgrid" rowGap="2">
      {children}
    </Grid>
  )
}

const SectionGroupSectionHeader: FC<SectionGroupSectionHeaderProps> = ({ children }) => {
  return (
    <chakra.div gridColumn="1 / -1" pt="3">
      <chakra.div position="relative">
        <chakra.hr
          borderColor="border"
          borderTopWidth="1px"
          left="0"
          m="0"
          position="absolute"
          right="0"
          top="50%"
          transform="translateY(-50%)"
        />
        <Text bg="bg.panel" display="inline-block" fontWeight="bold" ml="3.5" position="relative" px="0.5" textStyle="sm">
          {children}
        </Text>
      </chakra.div>
    </chakra.div>
  )
}

const SectionGroupSectionRowTitle: FC<SectionGroupSectionRowTitleProps> = ({ children }) => {
  return <Text alignSelf="center" color="fg.muted" pl="4" textStyle="sm">{children}</Text>
}

const SectionGroupSectionRowEditor: FC<SectionGroupSectionRowEditorProps> = ({ children }) => {
  return <chakra.div minWidth="0" pr="4">{children}</chakra.div>
}

export const SectionGroup = {
  Root: SectionGroupRoot,
  Section: SectionGroupSection,
  SectionHeader: SectionGroupSectionHeader,
  SectionRowTitle: SectionGroupSectionRowTitle,
  SectionRowEditor: SectionGroupSectionRowEditor,
}
