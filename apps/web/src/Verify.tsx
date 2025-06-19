const baseUrl = import.meta.env.VITE_API_URL;

export default function Verify() {

  const verify = async () => {
    try {
      const response = await fetch(`${baseUrl}api/emails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          to: 'karl@karlnotturno.com'
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
      <button onClick={verify}>Verify</button>
    </>
  )
}

