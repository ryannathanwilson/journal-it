import { color } from '@/theme'
import { ReactNode, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

export default function Header({ loading }: { loading: boolean }): ReactNode {
  const [initialHidden, setInitialHidden] = useState(true)
  useEffect(() => {
    setInitialHidden(false)
  }, [])
  return (
    <HeaderWrapper $loading={loading} $initialHidden={initialHidden}>
      <Loader $initialHidden={initialHidden} />
      <Heading>Journal It</Heading>
    </HeaderWrapper>
  )
}

const Loader = styled.div<{ $initialHidden: boolean }>`
  width: 200%;
  height: 2px;
  background-color: ${color.pink.warm};
  position: absolute;
  top: 35%;
  transform: translateX(0%);
  transition: all 1.5s linear;
  ${({ $initialHidden }) =>
    $initialHidden &&
    css`
      transform: translateX(-200%);
    `}
  z-index: 1;
`

const Heading = styled.h1`
  display: inline-block;
  padding-inline: 1rem;
  margin-left: -1rem;
  background-color: ${color.navy};
  position: relative;
  z-index: 2;
`

const HeaderWrapper = styled.div<{
  $loading: boolean
  $initialHidden: boolean
}>`
  position: relative;
  transform: translateX(0);
  opacity: 1;
  transition: all 300ms ease-in-out;
  z-index: 2;
  ${({ $initialHidden }) =>
    $initialHidden &&
    css`
      opacity: 0;
      transform: translateX(-5%);
    `}
  ${({ $loading }) => $loading && css``}
`
