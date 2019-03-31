const express = require('express');
const bodyParser = require('body-parser');

const user = require('./user')  // index.js는 생략해도 무방하다!
const models = require('./models');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true }));

app.use('/users', user);  // '/user'로 들어오는 라우팅은 user가 담당한다.

models.sequelize.sync({ force:true })
    .then(_=>{  // promise를 리턴. 디비를 싱크한 후에 서버를 연결
        console.log('Sync database!');
        app.listen(3000, ()=>{
            console.log('3000 server connected');
        });
});

/* 서버 구동 시에는 DB 유지, 테스트 시에는 서버 force 옵션 주기
const options = {
    force: process.env.NODE_ENV === 'test' ? true : false
};
models.sequelize.sync(options);
*/

module.exports = app;