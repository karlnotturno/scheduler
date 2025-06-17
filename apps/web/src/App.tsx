import { useState } from 'react'
import './App.css'
import CoffeeForm from './CoffeeForm'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <h1></h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>

      </div>
      <CoffeeForm />
    </>
  )
}

export default App
