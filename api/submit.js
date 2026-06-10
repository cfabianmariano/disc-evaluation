export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' })

  const scriptUrl = process.env.APPSCRIPT_URL
  if (!scriptUrl) return res.status(500).json({ exito: false, mensaje: 'APPSCRIPT_URL no configurada.' })

  try {
    let body = req.body
    if (typeof body === 'string') body = JSON.parse(body)

    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      redirect: 'follow'
    })

    const text = await response.text()

    try {
      const data = JSON.parse(text)
      return res.status(200).json(data)
    } catch {
      if (response.ok) return res.status(200).json({ exito: true })
      return res.status(200).json({ exito: false, mensaje: text.substring(0, 200) })
    }

  } catch (err) {
    return res.status(200).json({ exito: false, mensaje: err.message })
  }
}
