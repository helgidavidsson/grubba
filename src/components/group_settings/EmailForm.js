import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useState, useEffect } from 'react';
import styles from './EmailForm.module.css'
export default function EmailForm({
    onSave,
    initialEmailTemplate
}) {



   
    const [emailContent, setEmailContent] = useState(initialEmailTemplate); // State for email content

    const handleSave = () => {
        onSave(emailContent);
    };

    useEffect(() => {
        setEmailContent(initialEmailTemplate);
        console.log(initialEmailTemplate)
    }, [initialEmailTemplate]);
    

    return(
        <div>
        <h3>Sjálfvirkur tölvupóstur</h3>
        <ReactQuill className={styles.form} value={emailContent} onChange={setEmailContent}/>
        <button onClick={handleSave}>Vista umfang</button>
        </div>
    )
}