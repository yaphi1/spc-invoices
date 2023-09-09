import styles from './page.module.css'
import Uploader from './_components/Uploader'

export default function Home() {
  return (
    <main className={styles.main}>
      Hello
      <Uploader />
    </main>
  )
}
