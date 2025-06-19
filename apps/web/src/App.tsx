import Verify from './Verify'

import {useState} from 'react';

import './reset.css'
import './App.css'

function App() {

  const [email, setEmail] = useState<string>('')

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
  };

  const validateSmart = (email: string): boolean => {
    return (validateEmail(email) && emailDivergesFromHouse(email)) || validateHouseEmail(email)
  }

  const verify = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: email
        })
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Email sent:', result);
        alert('Verification email sent!');
      } else {
        const error = await response.json();
        console.error('Email error:', error);
        alert('Failed to send email');
      }
    } catch (err) {
      console.error('Request error:', err);
      alert('Network error');
    }
  };


  return (
    <>
      <div className='left-panel'>
        <div className='coffee'>
          <h1>Coffee?</h1>
          <input type='email' className={email === '' ? '' : validateHouseEmail(email) ? 'valid' : 'invalid'} placeholder='mike.johnson@mail.house.gov' onChange={(e) => setEmail(e.target.value)} value={email} />
          <div className={`email-warning-container ${emailDivergesFromHouse(email) ? 'show' : ''}`}>
            {emailDivergesFromHouse(email) && 
              <h2 className='fade-in'>
                We currently only support House staff with <code>mail.house.gov</code> email addresses.
                <br/><br/>Feel free to join our mailing list to be notified when we expand access.
              </h2>}
          </div>
          <div className={`email-submit-container ${validateSmart(email) ? 'show' : ''}`}>
              {validateSmart(email) && 
                <button className='fade-in'>{validateHouseEmail(email) ? 'Continue' : 'Notify Me'}</button>
              }
              {validateSmart(email) && !validateHouseEmail(email) && <button className='fade-in' onClick={verify}>Continue for Testing</button>}

          </div>
        </div>
      </div>
      <div className='right-panel' />
      <Verify />
    </>
  )
}

export default App
