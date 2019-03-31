// 라우팅 설정
const router = require('express').Router();
const ctrl = require('./user.ctrl');

// index.js는 라우팅과 컨트롤러를 binding해주는 역할을 하게 된다.
router.get('/:id', ctrl.show);
router.get('/', ctrl.index);
router.delete('/:id', ctrl.destroy);
router.post('/', ctrl.create);
router.put('/:id', ctrl.update);

module.exports = router;

// [router 모듈화] 1. router 정의 / 2. app을 router로 바꾼다. / 3. '/users' 생략한다.
// [controller 분리] 1. 각각의 라우팅에 대응되는 함수들을 잘라내기, ctrl파일에 붙여넣기 / 2. ctrl 파일 내에서 함수들을 module화 하기 / 3. 기존 index.js 파일에서 ctrl파일을 require하고, 함수 대신 ctrl.메소드로 대체하기
