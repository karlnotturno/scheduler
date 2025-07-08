import useAuthCheck from './hooks/useAuthCheck';

import './reset.css';
import Login from './Login';


function App() {

  const { isAuthenticated, authEmail } = useAuthCheck()


  return (
    <>
      { isAuthenticated ? 
        <div>Hello {JSON.stringify(authEmail)} </div> : 
        <Login /> 
      }

    </>
  )
}

export default App;
