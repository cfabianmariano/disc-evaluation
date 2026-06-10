export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const scriptUrl = process.env.APPSCRIPT_URL
  if (!scriptUrl) return res.status(500).json({ exito: false, mensaje: 'APPSCRIPT_URL no configurada.' })

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      redirect: 'follow'
    })
    const data = await response.json()
    return res.status(200).json(data)
  } catch (err) {
    return res.status(500).json({ exito: false, mensaje: 'No se pudo conectar con el servidor.' })
  }
}