'use client'
import type { FocusEvent, KeyboardEvent } from 'react'
import { useState } from 'react'
import styles from './block.module.css'

export default function Block() {
  const [text, setText] = useState('')
  const [editMode, setEditMode] = useState(true)


  const handleSubmitField = (
    e: KeyboardEvent<HTMLInputElement> | FocusEvent<HTMLInputElement>
  ) => {
    if (isKeyBoardEvent(e)) {
      if (e.key === 'Enter') {
        setEditMode(false)
      }
    } else if (e.type === 'blur') {
      setEditMode(false)
    }
  }

  return (
    <>
      {editMode ? (
        <input
          autoFocus
          className={styles.block}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyUp={handleSubmitField}
          onBlur={handleSubmitField}
        />
      ) : (
        <div
          className={styles.block}
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
