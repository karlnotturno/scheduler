import useAuthCheck from './hooks/useAuthCheck';

import './reset.css';
import './App.css';
import Login from './Login';


function App() {
  const { isAuthenticated, authEmail } = useAuthCheck()

  return (
    <>
      { isAuthenticated ? 
        <div className=''>Hello {JSON.stringify(authEmail)} </div> : 
        <Login /> 
      }

    </>
  )
}

export default App;
