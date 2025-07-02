import { useState, useEffect } from 'react';

const baseUrl = import.meta.env.VITE_API_URL;

function Admin () {

  const [emails, setEmails] = useState();

  useEffect(() => {
    try {
      fetch(`${baseUrl}/api/verify`)
      .then(res => res.json())
      .then(setEmails);
    } catch (err) {
      console.log(err)
    }
  }, []);

  const deleteVerifications = () => {
    try {
      fetch(`${baseUrl}/api/verify`, {method: 'DELETE'})
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <>
      {JSON.stringify(emails)}
      <button onClick={deleteVerifications}>Delete</button>
    </>
  )
}

export default Admin;
