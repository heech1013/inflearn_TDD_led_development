const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

let users = [
    {id: 1, name: 'alice'},
    {id: 2, name: 'bruce'},
    {id: 3, name: 'heech'}
];

app.get('/users/:id', (req, res)=>{
    let id = parseInt(req.params.id, 10);  // "1"과 같이 문자열 형태로 넘어오기 때문에 int로 바꿔준다.
    if (Number.isNaN(id)) return res.status(400).end();  // parseInt는 숫자가 아닐 경우 NaN을 반환
    
    let user = users.filter(user => user.id === id)[0]; // filter(): array 메소드. 특정 조건에 해당하는 값을 반환해서 새로운 array를 반환.
    if (!user) return res.status(404).end();
    
    res.json(user);
});

app.get('/users', (req, res)=>{
    req.query.limit = req.query.limit || 10;
    let limit = parseInt(req.query.limit, 10);  // parseInt는 정수가 아닐 경우 NaN 반환
    if (Number.isNaN(limit)){  // limit이 숫자가 아닐 경우
        return res.status(400).end();  // status는 기본값 200 반환. end()
    }
    res.json(users.slice(0, limit));
});

app.delete('/users/:id', (req, res)=>{
    let id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    users = users.filter(user=> user.id !== id);
    res.status(204).end();
});

app.post('/users', (req, res)=>{
    let name = req.body.name;
    if(!name) return res.status(400).end();
    let isConflict = users.filter(user=> user.name === name).length
    if(isConflict) return res.status(409).end();

    let id = Date.now();  // unique id
    let user = {id, name};
    users.push(user);
    res.status(201).json(user);
});

app.put('/users/:id', (req, res)=>{
    let id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    let name = req.body.name;
    if (!name) return res.status(400).end();
    
    let user = users.filter(user=> user.id === id)[0];
    if (!user) return res.status(404).end();
    
    let isConflict = users.filter(user => user.name === name).length;
    if(isConflict) return res.status(409).end();

    user.name = name;

    res.json(user);
})

app.listen(3000, ()=>{
    console.log('3000 server connected');
});

module.exports = app;