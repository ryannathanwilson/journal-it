'use client'
import type { FocusEvent, KeyboardEvent, MouseEvent, ReactNode } from 'react'
import { useState } from 'react'
import styles from './block.module.css'
import classes from '@/utils/classes'
import usePersistBlock from '@/hooks/usePersistBlock'
import type { Block, BlockTypes } from '@/utils/types'

const getBlockType = (text: string): BlockTypes => {
  switch (text.slice(0, 2)) {
    case '- ':
      return 'bullet'
    case 'o ':
      return 'check'
    case 'x ':
      return 'checked'
    default:
      return 'paragraph'
  }
}

export default function Block({ block }: { block: Block }) {
  const newBlock = block.content === ''
  const [text, setText] = useState(block.content)
  const type = getBlockType(text)
  const empty = text === ''
  const [editMode, setEditMode] = useState(block.content === '')

  const { loading, saveBlock, deleteBlock } = usePersistBlock({ block, text })

  const deleteItem = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (empty) return
    await deleteBlock()
  }

  const handleSave = async () => {
    setEditMode(false)
    await saveBlock()
  }

  const handleInput = async (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) => {
    if (text === '') return
    if (isKeyBoardEvent(e)) {
      if (e.key === 'Enter') {
        handleSave()
      }
    } else if (e.type === 'blur' && text !== '') {
      console.log(e)
      handleSave()
    }
  }
  const view: Record<BlockTypes, typeof Paragraph> = {
    paragraph: Paragraph,
    check: Paragraph,
    checked: Paragraph,
    bullet: Bullet,
  }
  const Component = view[type]

  return (
    <>
      <div
        className={classes(
          styles.block,
          newBlock && styles.newBlock,
          loading && (newBlock ? styles.animateCreate : styles.animateUpdate)
        )}
        onClick={() => setEditMode(true)}
      >
        {editMode ? (
          <input
            autoFocus
            className={classes(styles.input)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleInput}
            onBlur={handleInput}
          />
        ) : (
          <>
            <Component className={classes(styles.content)} text={text} />
            <div
              onClick={(e) => deleteItem(e)}
              className={classes(styles.delete)}
            ></div>
          </>
        )}
      </div>
    </>
  )
}

const Paragraph = ({
  className,
  text,
}: {
  className: string
  text: string
}): ReactNode => {
  return <div className={className}>{text}</div>
}

const Bullet = ({
  className,
  text,
}: {
  className: string
  text: string
}): ReactNode => {
  const textToRender = text.slice(2)
  return (
    <ul className={classes(className, styles.bullet)}>
      <li>{textToRender}</li>
    </ul>
  )
}

const isKeyBoardEvent = (x: any): x is KeyboardEvent =>
  (x as KeyboardEvent).key !== undefined
