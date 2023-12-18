import { Link } from "react-router-dom"

import styles from "./Header.module.css"

export default function Header() {
    return(
        <header className={styles.header}>
            <h1 className={styles.logo}>Hópurinn</h1>
            <nav>
                <Link className={styles.link} to="/">Listi</Link>
                <Link className={styles.link} to="/stillingar">Stillingar</Link>
            </nav>
        </header>
    )
}