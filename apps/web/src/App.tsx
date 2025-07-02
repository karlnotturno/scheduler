import {useState} from 'react';

import './reset.css';
import './App.css';

const baseUrl = import.meta.env.VITE_API_URL;


function App() {

  const [email, setEmail] = useState<string>('')
  const [code, setCode] = useState<string>('');
  const [emailSendAttempted, setEmailSendAttempted] = useState<boolean>(false)
  const [emailSent, setEmailSent] = useState<boolean>(false)

  const placeholderCode = '******';

  const validateHouseEmail = (email: string): boolean =>
    /^[^\s@]+@mail\.house\.gov$/.test(email);

  const validateEmail = (email: string): boolean =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const emailDivergesFromHouse = (email: string): boolean => {
    const target = 'mail.house.gov';
    const atIndex = email.indexOf('@');
  
    if (atIndex === -1) return false; // no domain typed yet
  
    const typedDomain = email.slice(atIndex + 1).toLowerCase();
    return !target.startsWith(typedDomain);
  }

  const validateSmart = (email: string): boolean => {
    return (validateEmail(email) && emailDivergesFromHouse(email)) || validateHouseEmail(email)
  }

  const sendEmail = async () => {
    setEmailSendAttempted(true)
    try {
      const response = await fetch(`${baseUrl}/api/verify/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Email sent:', result);
        setEmailSent(true)
      } else {
        const error = await response.json();
        console.error('Email error:', error);
        alert('Failed to send email');
        setEmailSendAttempted(false)
      }
    } catch (err) {
      console.error('Request error:', err);
      alert('Network error');
    }
  }

  const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const input = e.target.value;
    const isDigit = /^\d$/.test(input);
    if (!isDigit && input !== '') return;
    const newCode = code.split('');
    newCode[index] = input;
    setCode(newCode.join(''));

    if (isDigit && index < 5) {
      const nextInput = document.querySelectorAll('.code-box')[index + 1] as HTMLInputElement;
      nextInput?.focus();
    }
  }

  const handleCodeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.querySelectorAll('.code-box')[index - 1] as HTMLInputElement;
      prevInput?.focus();
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (!paste) return;

    const newCode = paste.padEnd(6).split('');
    setCode(newCode.join(''));

    const inputs = document.querySelectorAll('.code-box');
    const nextIndex = Math.min(paste.length, 5);
    (inputs[nextIndex] as HTMLInputElement)?.focus();
  }

  const verify = async () => {
    try {
      const response = await fetch(`${baseUrl}/api/verify/check-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code
        })
      })
      if (response.ok) {
        const result = await response.json();
        console.log('Verified succesfully:', result);
        alert('Verified!');
      } else {
        const error = await response.json();
        console.error('Verification failed:', error);
        alert('Not verified.');
      }
    } catch (err) {
      console.error('Request error:', err);
    }
  }


  return (
    <>
      <div className='left-panel'>
        <div className={`email-input-wrapper ${!emailSendAttempted ? 'show' : ''}`}>
          <div className={`email-input coffee ${emailSendAttempted ? 'exit' : ''}`}>
            <h1>Coffee?</h1>
            <input type='email' className={email === '' ? '' : validateHouseEmail(email) ? 'valid' : 'invalid'} placeholder='mike.johnson@mail.house.gov' onChange={(e) => setEmail(e.target.value)} value={email} />
            <div className={`email-warning-container ${emailDivergesFromHouse(email) ? 'show' : ''}`}>
              {emailDivergesFromHouse(email) && 
                <h2 className='fade-in'>
                  We currently only support House staff with <code>mail.house.gov</code> email addresses.
                  <br/><br/>Feel free to join our mailing list to be notified when we expand access.
                </h2>}
            </div>
            <div className={`button-container ${validateSmart(email) ? 'show' : ''}`}>
                {validateSmart(email) && 
                  <button className='fade-in'>{validateHouseEmail(email) ? 'Continue' : 'Notify Me'}</button>
                }
            </div>
            <div className={`button-container ${!validateHouseEmail(email) && validateSmart(email) ? 'show' : ''}`}>
              {validateSmart(email) && !validateHouseEmail(email) && <button className='fade-in' onClick={sendEmail}>Continue for Testing</button>}
            </div>
          </div>
        </div>
        <div className={`email-star-loader ${(emailSendAttempted && !emailSent) ? 'show' : ''}`}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} className={`star ${emailSent ? 'exit' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>★</span>
          ))}        
        </div>
        <div className={`verify-code-container ${emailSent ? 'show' : ''}`}>
          <h1>Emailed Code</h1>
          <div className="code-input-container">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                maxLength={1}
                className="code-box"
                value={code[idx] || ''}
                onChange={(e) => handleCodeInputChange(e, idx)}
                onKeyDown={(e) => handleCodeKeyDown(e, idx)}
                onPaste={handleCodePaste}
                placeholder={placeholderCode[idx]}
              />
            ))}
          </div>
          <div className={`button-container show`}>
            <button onClick={verify}>Verify</button>
          </div>
        </div>
        </div>
      <div className='right-panel' />
    </>
  )
}

export default App;
