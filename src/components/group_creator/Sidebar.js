import styles from './Sidebar.module.css'
import { Link } from 'react-router-dom'
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
            <Link className={styles.link} to="/">Grunnupplýsingar</Link>
            <Link className={styles.link} to="/">Meðlimir</Link>
            <Link className={styles.link} to="/">Viðburðir</Link>
            </nav>
            
        </div>
    )
}