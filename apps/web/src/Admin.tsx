import { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_API_URL;

function Admin () {

  const [emails, setEmails] = useState();

  useEffect(() => {
    try {
      fetch(`${baseUrl}/api/emails`)
      .then(res => res.json())
      .then(setEmails);
    } catch (err) {
      console.log(err)
    }
  }, []);

  const deleteEmails = () => {
    try {
      fetch(`${baseUrl}/api/emails`, {method: 'DELETE'})
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {JSON.stringify(emails)}
      <button onClick={deleteEmails}>Delete</button>
    </>
  )
}

export default Admin;
