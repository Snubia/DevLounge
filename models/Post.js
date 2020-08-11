const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// We will create a schema that shows which users posted
// and allow them to delete their post

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'userd'
    },
    text: {
        type: String,
        required: true
    },
    name: {
        type: String
    },
    avatar: {
        type: String
    },
    // create an array allowing users to like
    // only like a post once
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        }
    }],
    // we will do the same with the comments
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'users'
        },
        text: {
            type: String,
            required: true
        },
        // the comment will have the name and picture of the person that posted it
        name: {
            type: String
        },
        avatar: {
            type: String
        },
        date: { // adding the date of the comment
            type: Date,
            default: Date.now
        }
    }],
    date: { // adding the date of the post itself
        type: Date,
        default: Date.now
    }
});

module.exports = Post = mongoose.model('post', PostSchema);