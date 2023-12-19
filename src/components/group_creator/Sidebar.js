import styles from './Sidebar.module.css'
import { Link } from 'react-router-dom'
export default function Sidebar() {
    return(
        <div className={styles.sidebar}>
            <nav className={styles.nav}>
            <Link className={styles.link} to="/stillingar/upplysingar">Grunnupplýsingar</Link>
            <Link className={styles.link} to="/stillingar/medlimir">Meðlimir</Link>
            <Link className={styles.link} to="/stillingar/vidburdir">Viðburðir</Link>
            </nav>
            
        </div>
    )
}