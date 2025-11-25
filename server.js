const express = require('express');
const app = express();
app.use(express.json());
app.use(express.static('public'));

app.post('/auth', (req,res)=>{
  const {u,p} = req.body;
  if(u==='AVControl' && p==='123') return res.send('SUCCESS');
  return res.send('ACCESS DENIED');
});

app.listen(3000, ()=> console.log('Running on port 3000'));
