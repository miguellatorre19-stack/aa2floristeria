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
const emptyForm = {
  descripcion: '',
  tipo_flores: '',
  cantidad_flores: '',
  especificaciones: '',
}

const formatError = (error: unknown) => {
  if (!axios.isAxiosError(error) || !error.response) {
    return 'No se pudo conectar con el servidor'
  }

  const errores = error.response.data?.errores
  if (Array.isArray(errores)) {
    return errores.map((errorItem) => errorItem.msg).join('\n')
  }

  return JSON.stringify(error.response.data, null, 2)
}

export default function DetailClient({ clientId, onBack }: DetailClientProps) {
  const [cliente, setCliente] = useState<Cliente | null>(null)
  const [pedidos, setPedidos] = useState<Pedido[]>([])
  const [message, setMessage] = useState('')
  const [editingPedidoId, setEditingPedidoId] = useState<number | null>(null)
  const [formData, setFormData] = useState(emptyForm)

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

  const resetForm = () => {
    setEditingPedidoId(null)
    setFormData(emptyForm)
  }

  const createPedido = async () => {
    try {
      const response = await axios.post(pedidosUrl, {
        ...formData,
        cantidad_flores: Number(formData.cantidad_flores),
      })

      setPedidos([...pedidos, response.data])
      setMessage(`Pedido creado con id ${response.data.id}`)
      resetForm()
    } catch (error) {
      setMessage(formatError(error))
    }
  }

  const updatePedido = async () => {
    if (!editingPedidoId) return

    try {
      const response = await axios.put(`${pedidosUrl}/${editingPedidoId}`, {
        ...formData,
        cantidad_flores: Number(formData.cantidad_flores),
      })

      setPedidos(pedidos.map((pedido) => (
        pedido.id === editingPedidoId ? response.data : pedido
      )))
      setMessage(`Pedido ${editingPedidoId} actualizado`)
      resetForm()
    } catch (error) {
      setMessage(formatError(error))
    }
  }

  const savePedido = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (editingPedidoId) {
      await updatePedido()
      return
    }

    await createPedido()
  }

  const selectPedido = (pedido: Pedido) => {
    setEditingPedidoId(pedido.id)
    setFormData({
      descripcion: pedido.descripcion,
      tipo_flores: pedido.tipo_flores,
      cantidad_flores: String(pedido.cantidad_flores),
      especificaciones: pedido.especificaciones || '',
    })
    setMessage(`Editando pedido ${pedido.id}`)
  }

  const deletePedido = async (pedidoId: number) => {
    await axios.delete(`${pedidosUrl}/${pedidoId}`)
    setPedidos(pedidos.filter((pedido) => pedido.id !== pedidoId))
    setMessage(`Pedido ${pedidoId} eliminado`)

    if (editingPedidoId === pedidoId) {
      resetForm()
    }
  }

  useEffect(() => {
    setMessage('')
    resetForm()
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
          <p>{cliente.nombre} {cliente.apellidos} - Cliente #{cliente.id}</p>
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
          <h2>{editingPedidoId ? `Editar pedido #${editingPedidoId}` : 'Nuevo pedido'}</h2>
          <span>{pedidos.length} pedidos</span>
        </div>

        <form className="pedidoForm" onSubmit={savePedido}>
          <label>
            Descripcion
            <input
              type="text"
              name="descripcion"
              value={formData.descripcion}
              onChange={updateField}
            />
          </label>
          <label>
            Tipo de flores
            <input
              type="text"
              name="tipo_flores"
              value={formData.tipo_flores}
              onChange={updateField}
            />
          </label>
          <label>
            Cantidad
            <input
              type="number"
              name="cantidad_flores"
              value={formData.cantidad_flores}
              onChange={updateField}
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
            {editingPedidoId ? 'Guardar cambios' : 'Crear pedido'}
          </button>
          {editingPedidoId && (
            <button type="button" className="secondaryButton wideField" onClick={resetForm}>
              Cancelar edicion
            </button>
          )}
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
                <div className="pedidoActions">
                  <button
                    type="button"
                    className="secondaryButton"
                    onClick={() => selectPedido(pedido)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="dangerButton"
                    onClick={() => deletePedido(pedido.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
