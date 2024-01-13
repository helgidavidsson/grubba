import React, { useState } from 'react';
import styles from './SignIn.module.css';
import { Link } from 'react-router-dom';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSignIn = (e) => {
        e.preventDefault();
        console.log('Signing in with:', email, password);
    };

    const navigateToSignUp = () => {
        console.log('Navigating to Sign Up');
    };

    return (
        <div className={styles.container}>
            <h2>Innskráning</h2>
            <form onSubmit={handleSignIn}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Netfang:</label>
                    <input
                        type="email"
                        className={styles.input}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Lykilorð:</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.button}>Skrá inn</button>
            </form>
            <Link className={styles.link} to="/nyskraning">
            <button onClick={navigateToSignUp} className={`${styles.button} ${styles.signUpButton}`}>Búa til aðgang</button>

            </Link>
        </div>
    );
}
