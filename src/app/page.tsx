import Block from '@/components/block/Block'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>
        Journal It
      </h1>
      <Block />
      <Block />
    </main>
  )
}
