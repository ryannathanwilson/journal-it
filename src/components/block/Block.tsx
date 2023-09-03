'use client'
import type { FocusEvent, KeyboardEvent } from 'react'
import { useState } from 'react'
import styles from './block.module.css'
import { persistBlockData } from '@/requests'

export default function Block() {
  const [text, setText] = useState('')
  const [editMode, setEditMode] = useState(true)
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    setEditMode(false)
    await persistBlockData();
    setLoading(false);
  }

  const handleInput = async (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) => {
    if (isKeyBoardEvent(e)) {
      if (e.key === 'Enter') {
        handleSave();
      }
    } else if (e.type === 'blur') {
      handleSave();
    }
  }

  return (
    <>
      {editMode ? (
        <input
          autoFocus
          className={`${styles.block} ${styles.editing}`}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={handleInput}
          onBlur={handleInput}
        />
      ) : (
        <div
          className={`${styles.block} ${loading ? styles.animate : ''}`}
          onClick={() => setEditMode(true)}
        >
          {text}
        </div>
      )}
    </>
  )
}

const isKeyBoardEvent = (x: any): x is KeyboardEvent => (
  (x as KeyboardEvent).key !== undefined
)
