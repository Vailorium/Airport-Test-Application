const express = require('express')
const app = express()
const port = 8080

// http://www.gcmap.com/map?P=YSSY+-NZNE&MS=wls&MR=120&MX=720x360&PM=*
app.get('/', (req, res) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});