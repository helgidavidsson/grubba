import { Link } from "react-router-dom"

import styles from "./Header.module.css"

export default function Header() {
    return(
        <header className={styles.header}>
            <h1>Hópurinn</h1>
            <nav>
                <Link className={styles.link} to="/">Listi</Link>
                <Link className={styles.link} to="/new-group">Breyta hópi</Link>
            </nav>
        </header>
    )
}