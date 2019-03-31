const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',  // 파일 형식으로 데이터를 저장하는 데이터베이스(sqlite3)
    storage: './db.sqlite',  // 파일로 저장할 경로 명(파일 이름) -> db.sqlite라는 파일로 디비 생성된다.
    logging: false  // 기본값: console.log
});

const User = sequelize.define('User', {  // User모델 생성 / 1param: 테이블 명, 2param: 옵션
    // id는 자동 생성
    name: {
        type: Sequelize.STRING,
        unique: true
    }
});

;  // 기존 생성된 db가 있어도 지우고 다시 생성

module.exports = {Sequelize, sequelize, User};
// '데이터베이스-ORM동기화'강의에서는 bin 폴더에 db 싱크 파일을 모듈화하지만
// 필요성을 모르겠으므로 우선 패스한다.