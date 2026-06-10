import { useState, useMemo } from 'react'
import { PREGUNTAS } from './data/preguntas'
import { PUESTOS } from './data/puestos'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const BTN_PRIMARY = 'w-full bg-[#2563eb] hover:bg-blue-700 active:scale-[0.98] text-white font-semibold py-3.5 rounded-xl shadow-sm transition-all text-sm flex items-center justify-center gap-2'
const BTN_DISABLED = 'w-full bg-gray-200 text-gray-400 font-semibold py-3.5 rounded-xl transition-all text-sm cursor-not-allowed'

const ArrowRight = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
  </svg>
)
const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/>
  </svg>
)

function RegistroForm({ onSubmit }) {
  const [nombre, setNombre] = useState('')
  const [email,  setEmail]  = useState('')
  const [puesto, setPuesto] = useState('')
  const [errors, setErrors] = useState({})

  const inputClass = (f) =>
    'w-full px-4 py-3 rounded-xl border text-gray-900 text-sm bg-white ' +
    'focus:ring-2 focus:ring-[#2563eb] focus:border-transparent outline-none transition-all ' +
    (errors[f] ? 'border-red-400 ring-1 ring-red-300' : 'border-gray-200')

  const limpiar = (f) => setErrors(p => ({ ...p, [f]: false }))

  const handleSubmit = () => {
    const e = {}
    if (!nombre.trim()) e.nombre = true
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = true
    if (!puesto) e.puesto = true
    if (Object.keys(e).length) { setErrors(e); return }
    onSubmit({ nombre: nombre.trim(), email: email.trim(), puesto })
  }

  return (
    <div className="fade-in space-y-5">
      <p className="text-sm text-gray-500 leading-relaxed">
        Completá tus datos y respondé el cuestionario. Tus respuestas nos ayudan a orientar mejor tu proceso de selección.
      </p>
      <div className="space-y-3.5">
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Nombre y Apellido</label>
          <input type="text" value={nombre} onChange={e=>{setNombre(e.target.value);limpiar('nombre')}}
            className={inputClass('nombre')} placeholder="Ej. Juan Pérez" autoComplete="name"/>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Correo Electrónico</label>
          <input type="email" value={email} onChange={e=>{setEmail(e.target.value);limpiar('email')}}
            className={inputClass('email')} placeholder="ejemplo@correo.com" autoComplete="email"/>
        </div>
        <div>
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5">Puesto al que Postula</label>
          <select value={puesto} onChange={e=>{setPuesto(e.target.value);limpiar('puesto')}} className={inputClass('puesto')}>
            <option value="" disabled>Seleccioná una opción...</option>
            <optgroup label="Operadores de Servicio">
              {PUESTOS.os.map(p=><option key={p} value={p}>{p}</option>)}
            </optgroup>
            <optgroup label="Roles Administrativos y Supervisión">
              {PUESTOS.ra.map(p=><option key={p} value={p}>{p}</option>)}
            </optgroup>
          </select>
        </div>
      </div>
      <button onClick={handleSubmit} className={BTN_PRIMARY}>
        Comenzar Evaluación <ArrowRight/>
      </button>
    </div>
  )
}

function Cuestionario({ onComplete }) {
  const [indice,     setIndice]     = useState(0)
  const [respuestas, setRespuestas] = useState([])
  const [seleccion,  setSeleccion]  = useState(null)

  const opcionesMezcladas = useMemo(() => PREGUNTAS.map(q => shuffle(q.opciones)), [])

  const total    = PREGUNTAS.length
  const pct      = Math.round((indice / total) * 100)
  const esUltima = indice === total - 1
  const q        = PREGUNTAS[indice]
  const opciones = opcionesMezcladas[indice]

  const avanzar = () => {
    if (!seleccion) return
    const nuevas = [...respuestas, seleccion]
    if (!esUltima) { setRespuestas(nuevas); setIndice(i=>i+1); setSeleccion(null) }
    else onComplete(nuevas)
  }

  return (
    <div className="fade-in space-y-5" key={indice}>
      <div>
        <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
          <span>Pregunta {indice+1} de {total}</span><span>{pct}%</span>
        </div>
        <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#2563eb] h-full rounded-full transition-all duration-500" style={{width:`${pct}%`}}/>
        </div>
      </div>
      <h2 className="text-base font-semibold text-gray-900 leading-snug pt-1">{q.enunciado}</h2>
      <div className="space-y-2.5">
        {opciones.map((op,i) => {
          const sel = seleccion === op.letra
          return (
            <div key={i} onClick={()=>setSeleccion(op.letra)}
              className={'radio-card flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer select-none ' +
                (sel ? 'border-[#2563eb] bg-blue-50' : 'border-gray-200')}>
              <div className={'mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 transition-all ' +
                (sel ? 'border-[#2563eb] bg-[#2563eb]' : 'border-gray-300')}/>
              <span className="text-sm text-gray-700 leading-snug">{op.texto}</span>
            </div>
          )
        })}
      </div>
      <button onClick={avanzar} disabled={!seleccion} className={seleccion ? BTN_PRIMARY : BTN_DISABLED}>
        {!seleccion ? 'Seleccioná una opción' : esUltima
          ? <><span>Finalizar y Enviar</span><CheckIcon/></>
          : <><span>Siguiente Pregunta</span><ArrowRight/></>}
      </button>
    </div>
  )
}

function Gracias({ nombre }) {
  return (
    <div className="fade-in flex flex-col items-center text-center py-8 gap-5">
      <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center">
        <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7"/>
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-bold text-gray-900">Gracias por aplicar, {nombre.split(' ')[0]}.</h2>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">Nos comunicaremos con Ud. en breve.</p>
      </div>
      <p className="text-xs text-gray-400 pt-2">Ya podés cerrar esta pestaña.</p>
    </div>
  )
}

function Cargando() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#2563eb]"/>
      <p className="text-sm font-medium text-gray-500">Procesando tu evaluación...</p>
    </div>
  )
}

function ErrorScreen({ onRetry }) {
  return (
    <div className="flex flex-col items-center text-center py-10 gap-4">
      <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center">
        <svg className="w-6 h-6 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"/>
        </svg>
      </div>
      <div>
        <h3 className="text-sm font-semibold text-gray-900">Ocurrió un error inesperado</h3>
        <p className="text-xs text-gray-400 mt-1">Por favor, intentá de nuevo.</p>
      </div>
      <button onClick={onRetry} className="text-sm text-[#2563eb] hover:underline font-medium">Reintentar</button>
    </div>
  )
}

export default function App() {
  const [paso,    setPaso]    = useState('registro')
  const [persona, setPersona] = useState(null)

  const handleRegistro = (datos) => { setPersona(datos); setPaso('preguntas') }

  const handleRespuestas = async (respuestas) => {
    setPaso('cargando')
    try {
      const res  = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: persona.nombre, email: persona.email, puestoAplicado: persona.puesto, respuestas })
      })
      const data = await res.json()
      setPaso(data.exito ? 'gracias' : 'error')
    } catch { setPaso('error') }
  }

  return (
    <div className="bg-[#f8fafc] min-h-screen flex flex-col justify-between text-gray-800 antialiased">
      <main className="flex-grow flex items-center justify-center p-4 sm:p-6 md:p-10">
        <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-10">
          <div className="mb-7">
            <p className="text-[11px] font-bold text-[#2563eb] uppercase tracking-widest mb-1">Servicios Globales S.A.</p>
            <h1 className="text-lg font-bold text-gray-900">Evaluación de Perfil Conductual</h1>
          </div>
          {paso === 'registro'  && <RegistroForm onSubmit={handleRegistro}/>}
          {paso === 'preguntas' && <Cuestionario onComplete={handleRespuestas}/>}
          {paso === 'cargando'  && <Cargando/>}
          {paso === 'gracias'   && <Gracias nombre={persona.nombre}/>}
          {paso === 'error'     && <ErrorScreen onRetry={()=>setPaso('preguntas')}/>}
        </div>
      </main>
      <footer className="text-center py-4 text-[10px] text-gray-400 border-t border-gray-100 bg-white">
        People Analytics System &copy; 2026 — Servicios Globales S.A.
      </footer>
    </div>
  )
}