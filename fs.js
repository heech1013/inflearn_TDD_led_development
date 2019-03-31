const fs = require('fs');
fs.readFile('./readme.txt', (err, data) => {
    if (err) throw err;
    console.log(data.toString());
});

fs.writeFile('./writeme.txt', '글을 써주세영', (err, data) => {
    if (err) throw err;
    fs.readFile('./writeme.txt', (err, data) => {
        if (err) throw err;
        console.log(data.toString());
    }); 
});

//-------------------------------------

console.log('시작');
fs.readFile('./readme.txt', (err, data) => {
    if (err) throw err;
    console.log('1', data.toString());
});
fs.readFile('./readme.txt', (err, data) => {
    if (err) throw err;
    console.log('2', data.toString());
});
fs.readFile('./readme.txt', (err, data) => {
    if (err) throw err;
    console.log('3', data.toString());
});
console.log('끝');  // 코드의 순서와 상관 없이 먼저 읽기를 끝낸 파일이 먼저 뜸. 비동기 방식이기 때문.

console.log('시작');
fs.readFile('./readme.txt', (err, data) => {
    if (err) throw err;
    console.log('1', data.toString());
    fs.readFile('./readme.txt', (err, data) => {
        if (err) throw err;
        console.log('2', data.toString());
        fs.readFile('./readme.txt', (err, data) => {
            if (err) throw err;
            console.log('3', data.toString());
            console.log('끝');
        });
    });
});  // 콜백 안에 넣어주면 순서대로 뜬다.

console.log('시작');
let data = fs.readFileSync('./readme.txt');
console.log('1번', data.toString());
data = fs.readFileSync('./readme.txt');
console.log('2번', data.toString());
data = fs.readFileSync('./readme.txt');
console.log('3번', data.toString());
console.log('끝');  // sync를 붙여주면 동기식으로 작동하여 순서대로 뜬다.
// 다만 잘 쓰지 않는다. 동기식으로 할 시 파일을 읽느라 다른 요청을 처리하지 못할 수도 있기 때문.