import { color } from '@/theme'
import { BlockTypes } from '@/utils/types'
import styled, { css, keyframes } from 'styled-components'

export const DeleteIcon = styled.div`
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  width: 1.5rem;
  top: 0;
  bottom: 0;
  border-radius: 1rem;
  font-weight: 700;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: opacity 500ms ease;
  @media (hover: none) {
    opacity: 1;
  }

  &::before,
  &::after {
    content: '';
    display: block;
    position: absolute;
    width: 1rem;
    top: 0.7rem;
    height: 0.2rem;
    background-color: ${color.grey.dark};
    border-radius: 0.1rem;
    transition: all 300ms ease;
  }
  &::before {
    transform: rotate(45deg);
  }
  &::after {
    transform: rotate(-45deg);
  }
  &:hover::before {
    transform: rotate(135deg);
    background-color: ${color.red};
  }
  &:hover::after {
    transform: rotate(45deg);
    background-color: ${color.red};
  }
`

export const BlockWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  margin: 6px 0;
  line-height: 1.5rem;
  background-color: inherit;
  color: inherit;
  font-size: 1rem;
  cursor: default;

  &:hover ${DeleteIcon} {
    opacity: 1;
  }

  &:last-child {
    border-radius: 1.5rem;
    padding-inline: 1.5rem;
    margin-inline: -1.5rem;
    margin-top: 12px;
    padding-block: 0.7rem;
    border-top: 1px solid ${color.grey.dark};
    border-right: 1px solid ${color.grey.dark};
    border-bottom: 1px solid ${color.grey.dark};
    border-left: 1px solid ${color.grey.dark};

    ${DeleteIcon} {
      display: none;
    }
  }
`

export const Content = styled.div<{ $type: BlockTypes }>`
  margin-right: 12px;
  flex-shrink: 1;
  flex-grow: 1;
  min-width: 0px;
  &:focus-visible {
    outline: none;
  }
  ${({ $type }) =>
    $type === 'checked' &&
    css`
      color: ${color.cream.dark};
      text-decoration: line-through;
    `}
`
