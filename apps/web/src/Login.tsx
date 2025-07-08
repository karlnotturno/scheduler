import {useState} from 'react';

import './Login.css';

const baseUrl = import.meta.env.VITE_API_URL;

function Login() {

  const setEmailCookie = (email: string) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 10);
    document.cookie = `email=${encodeURIComponent(email)}; expires=${now.toUTCString()}; path=/`;
  }

  const deleteEmailCookie = () => {
    document.cookie = `email=; Max-Age=0; path=/;`;
  }

  const getEmailFromCookie = (): string | null => {
  const cookies = document.cookie.split(';').map(c => c.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith('email=')) {
      return decodeURIComponent(cookie.substring('email='.length));
    }
  }
  return null;
}

  const [email, setEmail] = useState<string>(getEmailFromCookie() || '');
  const [code, setCode] = useState<string>('');
  const [emailSendAttempted, setEmailSendAttempted] = useState<boolean>(!!getEmailFromCookie());
  const [emailSent, setEmailSent] = useState<boolean>(!!getEmailFromCookie());
  const [verifying, setVerifying] = useState<boolean>(false);
  const [verified, setVerified] = useState<boolean>(false);

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
    setEmailSent(false)
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
        setEmailCookie(email);
        setEmailSent(true);
      } else {
        const error = await response.json();
        console.error('Email error:', error);
        alert('Failed to send email');
        setEmailSendAttempted(false);
      }
    } catch (err) {
      console.error('Request error:', err);
      setEmailSendAttempted(false);
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

  const reset = () => {
    setEmailSent(false)
    deleteEmailCookie()
    setEmail('changing email')
    setTimeout(() => {
      setEmailSendAttempted(false)
    }, 150)
    setTimeout(() => {
      setEmail('')
    }, 160)
  }

  const verify = async () => {
    setVerifying(true);
    try {
      const response = await fetch(`${baseUrl}/api/verify/check-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email,
          code
        }),
        credentials: 'include'
      })
      if (response.ok) {
        const result = await response.json();
        console.log('Verified succesfully:', result);
        deleteEmailCookie();
        setVerified(true);
        
      } else {
        const error = await response.json();
        console.error('Verification failed:', error);
        alert('Not verified.');
        setVerifying(false);
      }
    } catch (err) {
      console.error('Request error:', err);
      setVerifying(false);
    }
  }

  return (
    <>
      <div className={`left-panel ${verified ? 'verified' : ''}`}>
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
                  <button onClick={sendEmail} className='fade-in'>{validateHouseEmail(email) ? 'Continue' : 'Notify Me'}</button>
                }
            </div>
            <div className={`button-container ${!validateHouseEmail(email) && validateSmart(email) ? 'show' : ''}`}>
              {validateSmart(email) && !validateHouseEmail(email) && <button className='fade-in' onClick={sendEmail}>Continue for Testing</button>}
            </div>
          </div>
        </div>
        <div className={`email-star-loader ${((emailSendAttempted && !emailSent && email !== 'changing email') || verifying) ? 'show' : ''}`}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <span key={idx} className={`star ${emailSent ? 'exit' : ''}`} style={{ animationDelay: `${idx * 0.2}s` }}>★</span>
          ))}        
        </div>
        <div className={`verify-code-container ${emailSent && !verifying ? 'show' : ''}`}>
          <h1>Emailed Code to</h1>
          <h2>{email}</h2>
          <div className={`reset`}>
            <button onClick={reset}>change email</button>
            |
            <button onClick={sendEmail}>resend</button>
          </div>
          <div className="code-input-container">
            {Array.from({ length: 6 }).map((_, idx) => (
              <input
                key={idx}
                type="text"
                inputMode="numeric"
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

export default Login;