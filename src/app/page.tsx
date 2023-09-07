import HomePage from './HomePage'
import styles from './page.module.css'

export default function Home() {
  return (
    <main className={styles.main}>
      <h1 className={styles.header}>Journal It</h1>
      <HomePage />
    </main>
  )
}
