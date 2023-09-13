import { color } from '@/theme'
import { BlockTypes } from '@/utils/types'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css, keyframes } from 'styled-components'

export default function Decorator({
  type,
  indent,
  onClick,
  loading,
}: {
  type: BlockTypes
  indent: number
  onClick: () => void
  loading: boolean
}): ReactNode {
  const [animationInterval, setAnimationInterval] = useState(false)
  const loadingRef = useRef<boolean>()
  useEffect(() => {
    loadingRef.current = loading
  }, [loading])

  useEffect(() => {
    if (loading && !animationInterval) {
      setAnimationInterval(true)
      const interval = setInterval(() => {
        if (!loadingRef.current) {
          setAnimationInterval(false)
          clearInterval(interval)
        }
      }, 250)
    }
  }, [loading, animationInterval])

  const Component = view[type]
  return (
    <DecoratorWrapper $indent={indent}>
      <Component onClick={onClick} $loading={animationInterval} />
    </DecoratorWrapper>
  )
}

const Spin = keyframes`
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg)
  }
`

const DecoratorWrapper = styled.div<{ $indent: number }>`
  display: block;
  width: 16px;
  padding-top: 3px;
  margin-inline-end: 8px;
  margin-inline-start: ${({ $indent }) =>
    $indent ? `${$indent * 32}px` : '0'};
`

const Base = styled.div<{ $loading: boolean }>`
  display: block;
  width: 16px;
  aspect-ratio: 1;
  position: relative;
  border-radius: 50%;
  flex-shrink: 0;
  ${({ $loading }) =>
    $loading &&
    css`
      animation: ${Spin} 1s linear infinite;
    `}
`

const Bullet = styled(Base)`
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    aspect-ratio: 1;
    background-color: ${color.pink.warm};
    border-radius: 2px;
  }
`
const Check = styled(Base)`
  cursor: pointer;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 11px;
    aspect-ratio: 1;
    border: 1px solid ${color.pink.warm};
    border-radius: 4px;
  }
`
const Checked = styled(Check)`
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 8px;
    aspect-ratio: 1;
    border-radius: 2px;
    background-color: ${color.pink.warm};
  }
`
const Paragraph = styled(Base)``

const view: Record<BlockTypes, typeof Bullet> = {
  bullet: Bullet,
  check: Check,
  checked: Checked,
  paragraph: Paragraph,
}
