'use client'
import type { FocusEvent, KeyboardEvent, MouseEvent } from 'react'
import { useState } from 'react'
import styles from './block.module.css'
import { persistBlockData } from '@/requests'
import { Block, useGlobalState } from '@/state'
import classes from '@/utils/classes'
import sleep from '@/utils/sleep'

export default function Block({ block }: { block: Block }) {
  const newBlock = block.content === ''
  const { dispatch } = useGlobalState();
  const [text, setText] = useState(block.content)
  const empty = text === ''
  const [editMode, setEditMode] = useState(block.content === '')
  const [loading, setLoading] = useState(false);

  const deleteItem = async (e: MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (empty) return;
    setLoading(true);
    await sleep(150)
    dispatch({
      type: 'delete',
      payload: { id: block.id }
    })
    setLoading(false);
  }

  const handleSave = async () => {
    setLoading(true);
    setEditMode(false)
    const updatedBlock = await persistBlockData({ ...block, content: text });
    dispatch({
      type: newBlock ? 'create' : 'update',
      payload: updatedBlock,
    })
    setLoading(false);
  }

  const handleInput = async (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) => {
    if (text === '') return;
    if (isKeyBoardEvent(e)) {
      if (e.key === 'Enter') {
        handleSave();
      }
    } else if (e.type === 'blur' && text !== '') {
      handleSave();
    }
  }

  return (
    <>
      <div
        className={
          classes(
            styles.block,
            newBlock && styles.newBlock,
            loading && (newBlock
              ? styles.animateCreate
              : styles.animateUpdate),
          )
        }
        onClick={() => setEditMode(true)}
      >
        {editMode ?
          <input
            autoFocus
            className={classes(styles.input)}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyUp={handleInput}
            onBlur={handleInput}
          /> :
          <>
            <div
              className={classes(styles.content)}
            >
              {text}
            </div>
          </>
        }
        {!empty &&
          <div
            onClick={(e) => deleteItem(e)}
            className={classes(styles.delete)}
          >
            X
          </div>
        }
      </div>
    </>
  )
}

const isKeyBoardEvent = (x: any): x is KeyboardEvent => (
  (x as KeyboardEvent).key !== undefined
)
