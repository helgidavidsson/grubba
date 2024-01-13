import styles from './SubHeader.module.css'
import { Link } from 'react-router-dom'
export default function SubHeader() {
    return(
        <div className={styles.layout}>
             <nav>
                <Link className={styles.link} to="/grubba">Listi</Link>
                <Link className={styles.link} to="/stillingar">Stillingar</Link>
            </nav>
        </div>
    )
}