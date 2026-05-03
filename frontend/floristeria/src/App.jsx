import { useEffect, useState } from 'react'
import axios from 'axios'
import DetailClient from './DetailClient'
import './App.css'

const API_URL = 'http://localhost:3000/clientes'

function App() {
  const [path, setPath] = useState(window.location.pathname)
  const [clients, setClients] = useState([])
  const [responseText, setResponseText] = useState('')
  const [clientId, setClientId] = useState('')
  const [responseData, setResponseData] = useState(null)
  const [formData, setFormData] = useState({
    dni: '',
    nombre: '',
    apellidos: '',
    domicilio: '',
    telf: ''
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
    setResponseData(null)
  }

  const postClient = async () => {
    const response = await axios.post(API_URL, formData)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
    setResponseData(data)
  }

  const putClient = async () => {
    const response = await axios.put(`${API_URL}/${clientId}`, formData)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
    setResponseData(data)
  }

  const deleteClient = async () => {
    const response = await axios.delete(`${API_URL}/${clientId}`)
    const data = response.data
    setResponseText(`${response.status} ${response.statusText}\n${JSON.stringify(data, null, 2)}`)
    setResponseData(null)
  }

  const pedidosMatch = path.match(/^\/clientes\/(\d+)\/pedidos$/)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = (newPath) => {
    window.history.pushState({}, '', newPath)
    setPath(newPath)
  }

  const openPedidos = (id) => {
    navigate(`/clientes/${id}/pedidos`)
  }

  if (pedidosMatch) {
    return (
      <DetailClient
        clientId={pedidosMatch[1]}
        onBack={() => navigate('/')}
      />
    )
  }

  return (
    <main className="app">
      <header className="pageHeader">
        <h1>Clientes</h1>
        <p>Gestion de clientes de la floristeria</p>
      </header>

      <section className="clientPanel">
        <div className="sectionHeader">
          <h2>Datos del cliente</h2>
          <span>CRUD basico</span>
        </div>

        <div className="inputs">
          <label>
            ID
            <input
              type="text"
              placeholder="Para editar o borrar"
              value={clientId}
              onChange={(event) => setClientId(event.target.value)}
            />
          </label>
          <label>
            DNI
            <input
              type="text"
              name="dni"
              placeholder="12345678A"
              value={formData.dni}
              onChange={updateField}
            />
          </label>
          <label>
            Nombre
            <input
              type="text"
              name="nombre"
              placeholder="Nombre"
              value={formData.nombre}
              onChange={updateField}
            />
          </label>
          <label>
            Apellidos
            <input
              type="text"
              name="apellidos"
              placeholder="Apellidos"
              value={formData.apellidos}
              onChange={updateField}
            />
          </label>
          <label>
            Domicilio
            <input
              type="text"
              name="domicilio"
              placeholder="Direccion"
              value={formData.domicilio}
              onChange={updateField}
            />
          </label>
          <label>
            Telefono
            <input
              type="text"
              name="telf"
              placeholder="Telefono"
              value={formData.telf}
              onChange={updateField}
            />
          </label>
        </div>

        <div className="controls">
          <button type="button" className="secondaryButton" onClick={getClients}>Cargar clientes</button>
          <button type="button" className="primaryButton" onClick={postClient}>Crear</button>
          <button type="button" className="secondaryButton" onClick={putClient}>Actualizar</button>
          <button type="button" className="dangerButton" onClick={deleteClient}>Eliminar</button>
        </div>
      </section>

      <section className="clientPanel">
        <div className="sectionHeader">
          <h2>Listado</h2>
          <span>{clients.length} clientes</span>
        </div>

        <div className="clientList">
          {clients.length === 0 ? (
            <p className="emptyState">Pulsa "Cargar clientes" para ver el listado.</p>
          ) : (
            clients.map((client) => (
              <article className="clientItem" key={client.id}>
                <div className="clientInfo">
                  <span className="clientId">#{client.id}</span>
                  <strong>{client.nombre} {client.apellidos}</strong>
                  <span>{client.dni}</span>
                  <span>{client.domicilio}</span>
                  <span>{client.telf}</span>
                </div>
                <button
                  type="button"
                  className="primaryButton"
                  onClick={() => openPedidos(client.id)}
                >
                  Pedidos
                </button>
              </article>
            ))
          )}
        </div>
      </section>

      {responseData ? (
        <section className="responseCard">
          <div className="responseHeader">
            <span>Respuesta</span>
            <strong>Cliente #{responseData.id}</strong>
          </div>
          <div className="responseGrid">
            <span>DNI</span>
            <p>{responseData.dni}</p>
            <span>Nombre</span>
            <p>{responseData.nombre}</p>
            <span>Apellidos</span>
            <p>{responseData.apellidos}</p>
            <span>Domicilio</span>
            <p>{responseData.domicilio}</p>
            <span>Telefono</span>
            <p>{responseData.telf}</p>
          </div>
          <button
            type="button"
            className="primaryButton"
            onClick={() => openPedidos(responseData.id)}
          >
            Pedidos
          </button>
        </section>
      ) : (
        responseText && <pre className="response">{responseText}</pre>
      )}
    </main>
  )
}

export default App
