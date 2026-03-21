import { useState } from 'react'
import axios from 'axios'
import './App.css'

const API_URL = 'http://localhost:3000/clientes'

function App() {
  const [clients, setClients] = useState([])
  const [responseText, setResponseText] = useState('')
  const [clientId, setClientId] = useState('')
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellidos: '',
    domicilio: '',
    telf: '',
  })

  const updateField = (event) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const getClients = async () => {
    const response = await axios.get(API_URL)
    const data = response.data
    setClients(data)
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
  }

  const postClient = async () => {
    const response = await axios.post(API_URL, formData)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
  }

  const putClient = async () => {
    const response = await axios.put(`${API_URL}/${clientId}`, formData)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
  }

  const deleteClient = async () => {
    const response = await axios.delete(`${API_URL}/${clientId}`)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
  }

  return (
    <main className="app">
      <h1>Clients</h1>

      <div className="controls">
        <button type="button" onClick={getClients}>Get all clients</button>
        <button type="button" onClick={postClient}>Post client</button>
        <button type="button" onClick={putClient}>Put client</button>
        <button type="button" onClick={deleteClient}>Delete client</button>
      </div>

      <div className="inputs">
        <input
          type="text"
          placeholder="id"
          value={clientId}
          onChange={(event) => setClientId(event.target.value)}
        />
        <input
          type="text"
          name="dni"
          placeholder="dni"
          value={formData.dni}
          onChange={updateField}
        />
        <input
          type="text"
          name="nombre"
          placeholder="nombre"
          value={formData.nombre}
          onChange={updateField}
        />
        <input
          type="text"
          name="apellidos"
          placeholder="apellidos"
          value={formData.apellidos}
          onChange={updateField}
        />
        <input
          type="text"
          name="domicilio"
          placeholder="domicilio"
          value={formData.domicilio}
          onChange={updateField}
        />
        <input
          type="text"
          name="telf"
          placeholder="telf"
          value={formData.telf}
          onChange={updateField}
        />
      </div>

      <pre className="response">{responseText}</pre>

      <ul className="clientList">
        {clients.map((client) => (
          <li key={client.id}>
            {client.id} - {client.nombre} {client.apellidos}
          </li>
        ))}
      </ul>
    </main>
  )
}

export default App
