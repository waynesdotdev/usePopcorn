import { useState } from 'react'

export default function Box({ children }) {
  const [isOpen, setIsOpen1] = useState(true)

  return (
    <div className='box'>
      <button className='btn-toggle' onClick={() => setIsOpen1(open => !open)}>
        {isOpen ? '–' : '+'}
      </button>
      {isOpen && children}
    </div>
  )
}
