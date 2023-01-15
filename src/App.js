
import './App.css';
import React, { useReducer } from 'react'
import friendlyWords from 'friendly-words'

let backgrounds = [
  'Noble',
  'Urchin',
  'Folk Hero',
  'Acolyte',
  'Criminal',
  'Hermit',
  'Guild Artisan',
  'Sage',
]

const initialState = {
  darkMode: false,
  name: '',
  background: '',
  error: null
}

/* Using useReducer to implement custom useMadeState 
function useMadeState (initialValue) {
  let [state, dispatch] = useReducer((state,action)=>{
    return action
  },initialValue)
  return [state,dispatch]
} */

function randomBackground() {
  return backgrounds[Math.floor(Math.random() * backgrounds.length)]
}

function randomName() {
  let array = friendlyWords.predicates
  let string = array[Math.floor(Math.random() * array.length)]
  return string.charAt(0).toUpperCase() + string.slice(1)
}

// 1. Replace the useMadeStates with a useReducer
// 2. Move our useReducer into a custom hook

function useCustomHook(){
  const [state, dispatch] = useReducer((state, action) => {
    switch(action.type) {
      case 'setDarkMode' :
        return {...state, darkMode: !state.darkMode}
      case 'setName' :
        return {...state, name: action.value}
      case 'setBackground' :
        return {...state, background: action.value}
      case 'setError' :
        return {...state, error: action.value}
      default: 
        return state
    }
  }, initialState)
  return [state, dispatch]
}

function App() {

  const [state, dispatch] = useCustomHook()

 /*  let [darkMode, setDarkMode] = useMadeState(false)
  let [name, setName] = useMadeState('')
  let [background, setBackground] = useMadeState('')
  let [error, setError] = useMadeState(null) */

  const {darkMode,name,background, error} = state

  function handleBackgroundSelect(event) {
    let back_value = event.target.value
    dispatch({type:'setBackground', value:back_value})
    if (!backgrounds.includes(back_value)) {
      dispatch({type: 'setError', value:'This background does NOT exist.'})
    } else {
      dispatch({type: 'setError', value: null})
    }
  }

  return (
    <>
      <div className={`App ${darkMode ? 'darkmode' : ''}`}>
        <button
          onClick={() => {
            dispatch({type: 'setDarkMode'})
          }}
        >
          Dark Mode {darkMode ? 'ON' : 'OFF'}
        </button>{' '}
        <br />
        <input
          type="text"
          placeholder="Type your name"
          value={name}
          onChange={(event) => {
            dispatch({type:'setName', value: event.target.value})
            if (event.target.value.length > 15) {
              dispatch({type:'setError', value:'Name is WAY too long, bucko.'})
            }
          }}
        />
        <select value={background} onChange={handleBackgroundSelect}>
          {backgrounds.map((b) => {
            return <option key={`bg-${b}`}>{b}</option>
          })}
        </select>
        {error && (
          <div className="error">
            {error}
            <button
              onClick={() => {
                dispatch({type:'setError', value:null})
              }}
            >
              Dismiss
            </button>
          </div>
        )}
        <div className="sheet">
          <h3>Name: {name}</h3>
          <h3>Background: {background}</h3>
        </div>
        <button
          onClick={() => {
            dispatch({type: 'setName', value:randomName()})
            dispatch({type:'setBackground', value:randomBackground()})
          }}
        >
          Do it all for me instead
        </button>
      </div>
    </>
  )
}

export default App;
