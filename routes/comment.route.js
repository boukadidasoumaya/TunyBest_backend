const commentModel = require('../models/comment.model');
const route = require('express').Router();
route.get('/', (req, res) => {
    const {mediaId, mediaType} = req.query;
    commentModel.getAllCommentsAndRepliesByMediaName(mediaId, mediaType)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
});

route.post('/add',(req,res) => {
    const {text,user_id,parent_id,media_type,media_id,created_at} = req.body;
    commentModel.addComment(text,user_id,parent_id,media_type,media_id,created_at)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})

route.post('/delete/:id',(req,res) => {
    const {id} = req.params;
    commentModel.deleteComment(id)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})
route.get('/getLikes/:id',(req,res) => {
    const {id} = req.params;
    commentModel.getLikesByCommentId(id)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})

route.get('/getLike/:comment_id/:user_id',(req,res) => {
    const {comment_id,user_id} = req.params;
    commentModel.getLikeByUserId(comment_id,user_id)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})

route.post('/handleLike',(req,res) => {
    const {comment_id,user_id} = req.body;
    commentModel.handleLike(comment_id,user_id)
        .then((results) => {
            res.status(200).json(results);
        }).catch((err) => {
        console.log(err);
    });
})


module.exports = route;

