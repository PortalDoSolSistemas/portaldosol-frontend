const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + '/dist/mail-app'));

app.get('/*', (req, res) =>{
    res.sendFile(__dirname + '/dist/mail-app/index.html');
});

app.listen(PORT, () =>{
    console.log('Frontend excutando na porta ' + PORT);
});

