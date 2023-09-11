'use client'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { useEffect, useRef, useState } from 'react'
import usePersistBlock from '@/hooks/usePersistBlock'
import type { Block, BlockTypes } from '@/utils/types'
import Decorator from './Decorator'
import { BlockWrapper, Content, DeleteIcon } from './Block.styled'
import { keysToBlock } from '@/utils/constants'

export default function Block({ block }: { block: Block }) {
  const newBlock = block.content === ''
  const [text, setText] = useState(block.content)
  const [indent, setIndent] = useState(block.indent)
  const [type, setType] = useState<BlockTypes>(block.type)
  const blockRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (blockRef.current) {
      blockRef.current.innerText = text
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const { loading, saveBlock, deleteBlock } = usePersistBlock({
    block,
    text,
    type,
    indent,
  })

  const deleteItem = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation() // otherwise it activates editing the parent
    await deleteBlock()
  }
  const handleBlur = async (e: FocusEvent<HTMLDivElement>) => {
    if (text !== '') {
      handleSave()
    }
  }

  const handleSave = async () => {
    await saveBlock()
    // TODO: create a new block at end if needed, and go to that!
  }

  const blockSpecialCharacters = (e: KeyboardEvent<HTMLDivElement>) => {
    if (keysToBlock.includes(e.key)) e.preventDefault()
  }

  const handleInput = async (e: KeyboardEvent<HTMLDivElement>) => {
    console.log(e)
    const newValue = e.currentTarget.innerText.toString() || ''
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Backspace') {
      if (newValue === text) {
        if (indent > 0) {
          setIndent((i) => i - 1)
        } else {
          console.log('delete')
          // delete self and move focus up
        }
      }
    } else if (e.key === 'Tab') {
      if (type === 'paragraph') {
        console.log('type', type)
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
      console.log('starts!')
      const choppedValue = newValue.slice(1) || ''
      setText(choppedValue) // but this doesn't update the value of the node
      if (blockRef.current) {
        console.log(choppedValue)
        blockRef.current.innerText = choppedValue
      }
      setType('bullet')
    } else {
      console.log('else')
      setText(newValue || '')
    }
  }

  return (
    <BlockWrapper $loading={loading} $newBlock={newBlock}>
      <Decorator
        type={type}
        indent={indent}
        onClick={() => {
          console.log('TYPE:', type)
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
        // defaultValue={text}
        contentEditable
        ref={blockRef}
        $type={type}
        // onInput={handleInput}
      ></Content>
      <DeleteIcon
        className="delete"
        onClick={(e) => deleteItem(e)}
      ></DeleteIcon>
    </BlockWrapper>
  )
}
