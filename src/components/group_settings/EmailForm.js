import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState } from 'react';
import styles from './EmailForm.module.css'
export default function EmailForm({

}) {



    const defaultEmailTemplate = `
    <p>Hæ [memberName],</p>
    <p>[AdminName] hefur boðið þér í eftirfarandi viðburð:</p>
    <p>[EventName]</p>
    <p>Þú getur skráð mætingu gegnum þennan hlekk:</p>
    <p>[Hlekkur]</p>
    <p>Bestu kveðjur,<br>grubba.is</p>
    `;

    const [emailContent, setEmailContent] = useState(defaultEmailTemplate); // State for email content

    return(
        <div>
        <h3>Sjálfvirkur tölvupóstur</h3>
        <ReactQuill className={styles.form} value={emailContent} onChange={setEmailContent}/>

        </div>
    )
}