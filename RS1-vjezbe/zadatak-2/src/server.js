import { createApp } from './app.js'

const port = Number(process.env.PORT || 3000)
const server = createApp().listen(port, '0.0.0.0', () => console.log(`AutoAtlas API sluša na portu ${port}`))
process.on('SIGTERM', () => server.close(() => process.exit(0)))
