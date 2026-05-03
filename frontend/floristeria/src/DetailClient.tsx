import { useEffect, useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import axios from 'axios'

type Cliente = {
  id: number
  dni: string
  nombre: string
  apellidos: string
  domicilio: string
  telf: string
}

type Pedido = {
  id: number
  cliente_id: number
  descripcion: string
  tipo_flores: string
  cantidad_flores: number
  especificaciones: string
}

type DetailClientProps = {
  clientId: string
  onBack: () => void
}

const API_URL = 'http://localhost:3000/clientes'

export default function DetailClient({ clientId, onBack }: DetailClientProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    descripcion: '',
    tipo_flores: '',
    cantidad_flores: '',
    especificaciones: '',
  })

  const pedidosUrl = `${API_URL}/${clientId}/pedidos`

  const updateField = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const loadDetail = async () => {
    const [clienteResponse, pedidosResponse] = await Promise.all([
      axios.get(`${API_URL}/${clientId}`),
      axios.get(pedidosUrl),
    ])

    setCliente(clienteResponse.data)
    setPedidos(pedidosResponse.data)
  }

  const createPedido = async (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault()
    const response = await axios.post(pedidosUrl, {
      ...formData,
      cantidad_flores: Number(formData.cantidad_flores),
    })

    setPedidos([...pedidos, response.data])
    setMessage(`Pedido creado con id ${response.data.id}`)
    setFormData({
      descripcion: '',
      tipo_flores: '',
      cantidad_flores: '',
      especificaciones: '',
    })
  }

  useEffect(() => {
    setMessage('')
    loadDetail().catch(() => setMessage('No se pudo cargar el cliente o sus pedidos.'))
  }, [clientId])

  return (
    <main className="app">
      <button type="button" className="secondaryButton backButton" onClick={onBack}>
        Volver
      </button>

      <header className="pageHeader">
        <h1>Pedidos</h1>
        {cliente ? (
          <p>{cliente.nombre} {cliente.apellidos} · Cliente #{cliente.id}</p>
        ) : (
          <p>Cargando cliente...</p>
        )}
      </header>

      {cliente && (
        <section className="responseCard">
          <div className="responseHeader">
            <span>Cliente</span>
            <strong>{cliente.dni}</strong>
          </div>
          <div className="responseGrid">
            <span>Nombre</span>
            <p>{cliente.nombre}</p>
            <span>Apellidos</span>
            <p>{cliente.apellidos}</p>
            <span>Domicilio</span>
            <p>{cliente.domicilio}</p>
            <span>Telefono</span>
            <p>{cliente.telf}</p>
          </div>
        </section>
      )}

      <section className="clientPanel">
        <div className="sectionHeader">
          <h2>Nuevo pedido</h2>
          <span>{pedidos.length} pedidos</span>
        </div>

        <form className="pedidoForm" onSubmit={createPedido}>
          <label>
            Descripcion
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Tipo de flores
            <input
              type="text"
              name="tipo_flores"
              value={formData.tipo_flores}
              onChange={updateField}
              required
            />
          </label>
          <label>
            Cantidad
            <input
              type="number"
              name="cantidad_flores"
              min="1"
              value={formData.cantidad_flores}
              onChange={updateField}
              required
            />
          </label>
          <label className="wideField">
            Especificaciones
            <textarea
              name="especificaciones"
              value={formData.especificaciones}
              onChange={updateField}
              rows={3}
            />
          </label>
          <button type="submit" className="primaryButton wideField">
            Crear pedido
          </button>
        </form>

        {message && <p className="formMessage">{message}</p>}
      </section>

      <section className="clientPanel">
        <div className="sectionHeader">
          <h2>Listado de pedidos</h2>
          <span>{pedidos.length} total</span>
        </div>

        <div className="pedidoList">
          {pedidos.length === 0 ? (
            <p className="emptyState">Este cliente aun no tiene pedidos.</p>
          ) : (
            pedidos.map((pedido) => (
              <article className="pedidoItem" key={pedido.id}>
                <div>
                  <span className="clientId">#{pedido.id}</span>
                  <strong>{pedido.descripcion}</strong>
                </div>
                <span>{pedido.tipo_flores}</span>
                <span>{pedido.cantidad_flores} flores</span>
                <p>{pedido.especificaciones || 'Sin especificaciones'}</p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
