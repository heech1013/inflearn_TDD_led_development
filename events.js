const EventEmitter = require('events');

const myEvent = new EventEmitter();

myEvent.addListener('방문', () => {
    console.log('방문해주셔서 감사합니다.');
});
myEvent.on('종료', () => {  // on과 addListener는 같다.
    console.log('안녕히');
});
myEvent.on('종료', () => {
    console.log('제발');
});
myEvent.once('특별 이벤트', () => {
    console.log('한번만');
});
myEvent.emit('방문');
myEvent.emit('종료');
myEvent.emit('특별 이벤트');
myEvent.emit('특별 이벤트');
myEvent.removeAllListeners('방문');