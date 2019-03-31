// 테스트 코드
// $ node_modules/.bin/mocha .\TDD\user\user.spec.js (mocha는 node_module파일 속 mocha로 위치 지정, spec파일은 또 다시 따로 위치 지정)
// 테스트 로그는 테스트와 관련된 내용만 박히는 것이 좋다.(server connected 등은 불필요)
// '테스트 환경 개선' 강의: bin(www.js)과 script의 "start"를 통해서 서버 구동 부분을 모듈화하는 강의. (필요성을 지금은 모르겠어서 패스한다.)
const request = require('supertest');
const should = require('should');
const app = require('../');  // index는 생략 가능(ES6)
const models = require('../models');

// describe 또는 it 뒤에 .only(...): 해당 테스트만 시행.
describe('GET /users는', function(){
    describe('성공시', ()=>{
        let users = [
            {name: 'alice'}, {name: 'bek'}, {name: 'heech'}
        ];
        before( ()=> models.sequelize.sync({ force:true }) );  // 파일에 접근하는 것이기 때문에 비동기 처리 필요(done), return을 사용하면 done없이도 마무리지어준다.(?)
        before( ()=> models.User.bulkCreate(users) ); // bulkCreate(): 샘플 데이터를 DB에 넣어준다. limit 등의 테스트를 위해
        it('유저 객체를 담은 배열로 응답한다.', (done)=>{
            request(app)  // 슈퍼테스트 모듈
                .get('/users')
                .end((err, res)=>{
                    res.body.should.be.instanceOf(Array) // 응답 데이터가 배열인지 확인하는 코드
                    done();
                });
        });
        it('최대 limit 갯수만큼 응답한다.', (done)=>{  // 또 하나의 테스트 케이스
            request(app)
                .get('/users?limit=2')
                .end((err, res)=>{
                    res.body.should.have.lengthOf(2);
                    done();
                });
        });
    });
    describe('실패시', ()=>{
        it('limit이 숫자형이 아니면 400을 응답한다.', (done)=>{
            request(app)  // 슈퍼테스트 모듈
                .get('/users?limit=two')
                .expect(400)  // 슈퍼테스트는 상태코드를 검증할 수 있는 함수 expect 제공. 검증해야 할 상태코드를 넣어준다.
                .end((err, res)=>{  // res로 데이터 검증을 하지 않아도 된다. expect로 검증
                    //if (err) throw done(err);
                    done();  // end(done)로도 가능
                });
        });
    });
});

describe('GET /users/:id은', ()=>{
    let users = [
        {name: 'alice'}, {name: 'bek'}, {name: 'heech'}
    ];
    before( ()=> models.sequelize.sync({ force:true }) );
    before( ()=> models.User.bulkCreate(users) );
    describe('성공시', ()=>{
        it('id가 1인 유저 객체를 반환한다.', (done)=>{
            request(app)
                .get('/users/1')
                .end((err, res)=>{  // end(): api 호출 결과가 응답
                    res.body.should.have.property('id', 1)  // should.have.property('기대하는 id의 문자열', id 값)
                    done();
                });
        });
    });
    describe('실패시', ()=>{
        it('id가 숫자가 아닐 경우 400으로 응답한다.', (done)=>{
            request(app)
                .get('/users/one')
                .expect(400)
                .end(done);
        });
        it('id로 유저를 찾을 수 없을 경우 404로 응답한다.', (done)=>{
            request(app)
                .get('/users/9999')
                .expect(404)
                .end(done);
        });
    });
});

describe('DELETE /users/:id', ()=>{
    let users = [
        {name: 'alice'}, {name: 'bek'}, {name: 'heech'}
    ];
    before( ()=> models.sequelize.sync({ force:true }) );
    before( ()=> models.User.bulkCreate(users) );
    describe('성공시', ()=>{
        it('204를 응답한다.', (done)=>{
            request(app)
                .delete('/users/1')
                .expect(204)
                .end(done);
        });
    });
    describe('실패시', ()=>{
        it('id가 숫자가 아닐 경우 400으로 응답한다.', done=>{
            request(app)
                .delete('/users/one')
                .expect(400)
                .end(done);
        });
    });
});

describe('POST /users', ()=>{
    let users = [
        {name: 'alice'}, {name: 'bek'}, {name: 'heech'}
    ];
    before( ()=> models.sequelize.sync({ force:true }) );
    before( ()=> models.User.bulkCreate(users) );
    describe('성공시', ()=>{
        let name = 'mildang',
        body;  // 각 테스트 케이스마다 body값, name값을 설정하는 코드 중복을 막기 위해 미리(before) body, name값을 설정해놓는다.
        before(done=>{  // mocha함수 before(): 테스트 케이스가 동작하기 전에 미리 실행되는 함수
            request(app)
                .post('/users')
                .send({name: name})
                .expect(201)  // 201 상태코드 반환 테스트
                .end((err, res)=>{
                    body = res.body;
                    done();
                });
        });
        it('생성된 유저 객체를 반환한다.', ()=>{  // 비동기 테스트가 아니므로 done을 없앤다(?)
            body.should.have.property('id');
        });
        it('입력한 name을 반환한다.', ()=>{
            body.should.have.property('name', name);
        })
    });
    describe('실패시', ()=>{
        it('name 파라미터 누락시 400을 반환한다.', done=>{
            request(app)
                .post('/users')
                .send({})
                .expect(400)
                .end(done);
        });
        it('name이 중복일 경우 409를 반환한다.', done=>{
            request(app)
                .post('/users')
                .send({name: 'heech'})
                .expect(409)
                .end(done);
        });
    });
});
// 참고) delete 테스트 케이스에서 id:1 인 데이터를 삭제한 경우, post에서 중복된 이름으로 데이터
// 추가 시 오류내는 테스트 케이스에서 오류가 안나고 등록이 될 수 있다.

describe('PUT /users/:id', ()=>{
    let users = [
        {name: 'alice'}, {name: 'bek'}, {name: 'heech'}
    ];
    before( ()=> models.sequelize.sync({ force:true }) );
    before( ()=> models.User.bulkCreate(users) );
    describe('성공시', ()=>{
        it('변경된 name을 반환한다.', done=>{
            let name = 'den';
            request(app)
                .put('/users/3')
                .send({name: name})
                .end((err, res)=>{
                    res.body.should.have.property('name', name);
                    done();
                });
        });
    });
    describe('실패시', ()=>{
        it('정수가 아닌 id일 경우 400을 응답한다.', done=>{
            request(app)
                .put('/users/one')
                .expect(400)
                .end(done);
        });
        it('name이 없을 경우 400을 응답한다.', done=>{
            request(app)
                .put('/users/1')
                .send({})
                .expect(400)
                .end(done);
        });
        it('없는 유저일 경우 404을 응답한다.', done=>{
            request(app)
                .put('/users/9999')
                .send({name: 'foo'})  // 밑의 테스트케이스를 위해 더미데이터라도 name값을 줘야 함
                .expect(404)
                .end(done);
        });
        it('이름이 중복일 경우 409을 응답한다.', done=>{
            request(app)
                .put('/users/2')
                .send({name: 'alice'})
                .expect(409)
                .end(done);
        });
    })
});