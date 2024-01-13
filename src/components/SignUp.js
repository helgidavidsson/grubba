import React, { useState } from 'react';
import styles from './SignIn.module.css'; // Reusing styles from SignIn

export default function SignUp() {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');

    const handleSignUp = async (e) => {
        e.preventDefault();
    
        // Basic Frontend Validation
        if (!email || !password || !fullName) {
            alert("Vinsamlegast fylltu út alla reiti");
            return;
        }
        if (password !== verifyPassword) {
            alert("Lykilorð passa ekki");
            return;
        }
    
        // Construct user data
        const userData = {
            fullName,
            email,
            phone, // Phone is optional
            password
        };
        try {
            const response = await fetch('http://localhost:3001/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
        
            const text = await response.text(); // Read the response as text first
            console.log("Raw response:", text);
        
            try {
                const data = JSON.parse(text); // Try to parse it as JSON
                // Rest of your logic...
            } catch (err) {
                console.error('Error parsing JSON:', err);
            }
        
        } catch (error) {
            console.error('Network error:', error);
        }
    }        

    return (
        <div className={styles.container}>
            <h2>Nýskráning</h2>
            <form onSubmit={handleSignUp}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Fullt nafn:</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                    />
                </div>
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
                    <label className={styles.label}>Sími (valkvætt):</label>
                    <input
                        type="tel"
                        className={styles.input}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
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
                <div className={styles.formGroup}>
                    <label className={styles.label}>Staðfesta lykilorð:</label>
                    <input
                        type="password"
                        className={styles.input}
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                </div>
                <button type="submit" className={styles.button}>Búa til aðgang</button>
            </form>
        </div>
    );
}
