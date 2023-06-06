const express = require('express')
const axios = require('axios')
const app = express()
const port = 3100

app.get('/', (req, res) => {
    res.send('OK')
})
app.get('/proxy', async (req, res) => {
    try {
        const imageUrl = req.query.url
        console.log('request to proxy', imageUrl)
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer',
        })
        const contentType = response.headers['content-type']
        res.set('Content-Type', contentType)
        res.send(response.data)
    } catch (error) {
        console.error('Proxy error:', error)
        res.status(500).send('Proxy error')
    }
})

app.listen(port, () => {
    console.log(`Proxy server listening at http://localhost:${port}`)
})
