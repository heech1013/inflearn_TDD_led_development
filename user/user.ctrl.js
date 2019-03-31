// api(controller) 로직

const models = require('../models');

const index = (req, res)=>{
    req.query.limit = req.query.limit || 10;
    let limit = parseInt(req.query.limit, 10);  // parseInt는 정수가 아닐 경우 NaN 반환
    if (Number.isNaN(limit)){  // limit이 숫자가 아닐 경우
        return res.status(400).end();  // status는 기본값 200 반환. end()
    }

    models.User.findAll({
        limit: limit
    }).then(users=>{
            res.json(users);
        });
};

const show = (req, res)=>{  
    let id = parseInt(req.params.id, 10);  // "1"과 같이 문자열 형태로 넘어오기 때문에 int로 바꿔준다.
    if (Number.isNaN(id)) return res.status(400).end();  // parseInt는 숫자가 아닐 경우 NaN을 반환
    
    models.User.findOne({
        where: {id}  // {id: id}와 같다
    }).then(user => {
        if (!user) return res.status(404).end();
        res.json(user);
    });
};

const destroy = (req, res)=>{
    let id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    models.User.destroy({
        where: {id}
    }).then(()=>{
        res.status(204).end();
    });
};

const create = (req, res)=>{
    let name = req.body.name;
    if(!name) return res.status(400).end();
     
    //if(isConflict) return res.status(409).end();
    
    models.User.create({name})
        .then(user =>{
            res.status(201).json(user);
        }).catch(err =>{
            if (err.name === 'SequelizeUniqueConstraintError') {  // err를 console.log해본다. 에러 이름을 활용하여 에러처리를 한다.
                return res.status(409).end();
            }
            res.status(500).end();
        });
};

const update = (req, res)=>{
    let id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).end();

    let name = req.body.name;
    if (!name) return res.status(400).end();

    models.User.findOne({ where: { id } })
        .then(user => {
            if (!user) return res.status(404).end();

            user.name = name;
            user.save()
                .then(_ => {
                    res.json(user);
                })
                .catch(err => {
                    if (err.name === 'SequelizeUniqueConstraintError') {  // err를 console.log해본다. 에러 이름을 활용하여 에러처리를 한다.
                        return res.status(409).end();
                    }
                    res.status(500).end();
                });
        });
};

module.exports = {index, show, destroy, create, update};  // ES6 문법. 아래와 같다.
// module.exports = {
//     index: index,
//     show: show,
//     destroy: destroy,
//     create: create,
//     update: update
// };