import { color } from '@/theme'
import { BlockTypes } from '@/utils/types'
import { ReactNode } from 'react'
import styled from 'styled-components'

export default function Decorator({
  type,
  indent,
  onClick,
}: {
  type: BlockTypes
  indent: number
  onClick: () => void
}): ReactNode {
  const Component = view[type]
  return <Component $indent={indent} onClick={onClick} />
}

const Base = styled.div<{ $indent: number }>`
  margin-inline-start: ${({ $indent }) =>
    $indent ? `${$indent * 16}px` : '0'};
  margin-inline-end: 8px;
  display: block;
  width: 16px;
  position: relative;
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
    border-radius: 50%;
  }
`
const Check = styled(Base)`
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 12px;
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
