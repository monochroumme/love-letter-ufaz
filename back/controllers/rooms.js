const rooms = { name: {}};
exports.getIndex = function(req, res, next){
    if(!req.session.isLoggedIn){
        res.render('index', {
            pageTitle: 'Love Letter'
        });
    } else {
        res.render('index', {
            pageTitle: 'Love Letter',
            username: req.session.user.username,
            rooms: rooms
        });
    }
};

exports.getRoom = function(req, res, next){
    if(!req.session.isLoggedIn){
        // return res.redirect('/login');
    }else{
        res.render('index', {
            pageTitle: 'Love Letter - In Game',
            roomName: req.params.room
        });
    }
}

exports.postRoom = function(req, res, next){
    if(rooms[req.body.room] != null){
        return res.redirect('/'); //video 11:16
    }
    rooms[req.body.room] = {users: {}};
    res.redirect(req.body.room);
};
