const mongoose = require('mongoose');


const publicationSchema = mongoose.Schema({
    userId: { type: String, required: true },
    texte: { type: String, required: true },
    imageUrl: { type: String, required: true },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    usersLiked: { type: [String] },
    usersDisliked: { type: [String] },
});

module.exports = mongoose.model('Publication', publicationSchema);