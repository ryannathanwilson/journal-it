'use client'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { useState } from 'react'
import styles from './block.module.css'
import classes from '@/utils/classes'
import usePersistBlock from '@/hooks/usePersistBlock'
import { Block } from '@/utils/types'

export default function Block({ block }: { block: Block }) {
  const newBlock = block.content === ''
  const [text, setText] = useState(block.content)
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
            <div className={classes(styles.content)}>{text}</div>
            <div
              onClick={(e) => deleteItem(e)}
              className={classes(styles.delete)}
            >
              X
            </div>
          </>
        )}
      </div>
    </>
  )
}

const isKeyBoardEvent = (x: any): x is KeyboardEvent =>
  (x as KeyboardEvent).key !== undefined
