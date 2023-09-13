'use client'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import usePersistBlock from '@/hooks/usePersistBlock'
import type { Block, BlockTypes } from '@/types/types'
import Decorator from './Decorator'
import { BlockWrapper, Content, DeleteIcon } from './Block.styled'
import { keysToBlock } from '@/utils/constants'
import { useGlobalState } from '@/state'

export default function Block({
  block,
  isLastBlock = false,
}: {
  block?: Block
  isLastBlock?: boolean
}) {
  const { dispatch } = useGlobalState()
  const [text, setText] = useState(block?.content || '')
  const [indent, setIndent] = useState(block?.indent || 0)
  const [type, setType] = useState<BlockTypes>(block?.type || 'paragraph')
  const blockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isLastBlock && blockRef.current) {
      dispatch({
        type: 'reference-last-block',
        payload: { blockRef: blockRef.current },
      })
    }
  }, [isLastBlock, blockRef]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.innerText = text
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (type !== block?.type && text !== '') {
      handleSave()
    }
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  const { loading, saveBlock, deleteBlock } = usePersistBlock({
    block,
    text,
    type,
    indent,
  })

  const deleteItem = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // otherwise it activates editing the parent
    await deleteBlock()
    dispatch({ type: 'focus-last-block' })
  }
  const handleBlur = async (e: FocusEvent<HTMLDivElement>) => {
    if (text !== '') {
      await handleSave()
      dispatch({ type: 'focus-last-block' })
    }
  }

  const handleSave = async () => {
    await saveBlock()
    if (isLastBlock && text) {
      setText('')
      setType('paragraph')
      setIndent(0)
      if (blockRef.current) {
        blockRef.current.innerText = ''
      }
    }
  }

  const blockSpecialCharacters = (e: KeyboardEvent<HTMLDivElement>) => {
    if (keysToBlock.includes(e.key)) e.preventDefault()
  }

  const handleInput = async (e: KeyboardEvent<HTMLDivElement>) => {
    const newValue = e.currentTarget.innerText.toString() || ''
    if (e.key === 'Enter') {
      console.log('ENTER SAVE', text)
      await handleSave()
      dispatch({ type: 'focus-last-block' })
    } else if (e.key === 'Backspace') {
      if (newValue === text) {
        if (indent > 0) {
          setIndent((i) => i - 1)
        } else {
          console.log('delete')
          await deleteBlock()
          dispatch({ type: 'focus-last-block' })
        }
      } else {
        setText(newValue || '')
      }
    } else if (e.key === 'Tab') {
      if (type === 'paragraph') {
        setType('check')
      } else if (e.shiftKey) {
        if (indent > 0) {
          setIndent((i) => i - 1)
        }
      } else {
        if (indent < 8) {
          setIndent((i) => i + 1)
        }
      }
    } else if (newValue.startsWith('-')) {
      const choppedValue = newValue.slice(1) || ''
      setText(choppedValue) // but this doesn't update the value of the node
      if (blockRef.current) {
        blockRef.current.innerText = choppedValue
      }
      setType('bullet')
    } else {
      setText(newValue || '')
    }
  }

  return (
    <BlockWrapper>
      <Decorator
        loading={loading}
        type={type}
        indent={indent}
        onClick={() => {
          if (type === 'check') {
            setType('checked')
          } else if (type === 'checked') {
            setType('check')
          }
        }}
      />
      <Content
        onKeyUp={(e) => handleInput(e)}
        onKeyDown={(e) => blockSpecialCharacters(e)}
        onBlur={handleBlur}
        contentEditable
        ref={blockRef}
        $type={type}
      ></Content>
      <DeleteIcon
        className="delete"
        onClick={(e) => deleteItem(e)}
      ></DeleteIcon>
    </BlockWrapper>
  )
}
