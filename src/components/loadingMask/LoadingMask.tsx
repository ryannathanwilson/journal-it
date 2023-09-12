import { color } from '@/theme'
import { useState } from 'react'
import styled, { css } from 'styled-components'

export default function LoadingMask({ loading }: { loading: boolean }) {
  const [showLoader, setShowLoader] = useState(true)
  return showLoader ? (
    <Loader $loading={loading} onTransitionEnd={() => setShowLoader(false)} />
  ) : null
}

const Loader = styled.div<{ $loading: boolean }>`
  position: absolute;
  opacity: 0;
  background-color: ${color.navy};
  z-index: 1;
  inset: 0;
  transition: opacity 300ms ease-in-out 600ms;
  ${({ $loading }) =>
    $loading &&
    css`
      opacity: 1;
    `}
`
