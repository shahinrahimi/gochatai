import './App.css'
import React from 'react'
import { Button } from './components/ui/button'
import { Input } from './components/ui/input'

function App() {

  const [model, setModel] = React.useState<string>("")
  const [role, setRole] = React.useState<string>("")
  const [content, setContent] = React.useState<string>("")

  const fetchResponse = () => {
    const url = "http://localhost:3000/api/hello"
    fetch(url)
      .then(data => data.json())
      .then(data => {
        console.log(data)
      })
      .catch(err => {
        console.error("error fetching data", err)
      })
  }
  return (
  <div id="app" className="flex-col">
    <label htmlFor='model'>Model Name</label>
    <Input 
      name='model'
      placeholder='enter model name'
      value={model} 
      onChange={(e) => setModel(e.target.value)}
    />  
    <label htmlFor='role'>Role</label>
    <Input 
      name='role' 
      placeholder='enter role e.g senior backend engineer'
      value={role} 
      onChange={(e) => setRole(e.target.value)}
    />  
    <label htmlFor='content'>Content</label>
    <Input 
      name='content' 
      placeholder='ask a question e.g why the sky is blue?'
      value={content} 
      onChange={(e) => setContent(e.target.value)}
    />  

    <Button onClick={fetchResponse}>Confirm</Button>
  </div>
  )

}
export default App
