const Publication = require('../models/publication.js');
const fs = require('fs');

exports.createPublication = (req, res, next) => {
    const publicationObject = JSON.parse(req.body.publication);
    delete publicationObject._id;
    const publication = new Publication({
        ...publicationObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    publication.save()
        .then(() => res.status(201).json({ message: 'Publication enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getOnePublication = (req, res, next) => {
    Publication.findOne({
        _id: req.params.id
    }).then(
        (publication) => {
            res.status(200).json(publication);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
};

exports.modifyPublication = (req, res, next) => {
    const publicationObject = req.file ? {
        ...JSON.parse(req.body.publication),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body };
    Publication.updateOne({ _id: req.params.id }, {...publicationObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Publication modifié !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.deletePublication = (req, res, next) => {
    Publication.findOne({ _id: req.params.id })
        .then(publication => {
            const filename = publication.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Publication.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Publication supprimé !' }))
                    .catch(error => res.status(400).json({ error }));
            });
        })
        .catch(error => res.status(500).json({ error }));
};

exports.getAllPublication = (req, res, next) => {
    Publication.find().then(
        (publications) => {
            res.status(200).json(publications);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};

// Aimer ou pas une sauce
exports.likeOrNot = (req, res, next) => {
    console.log(req.body);
    const like = JSON.parse(req.body.like);

    if (like === 1) {
        Publication.updateOne({ _id: req.params.id }, { $inc: { likes: req.body.like++ }, $push: { usersLiked: req.body.userId } })
            .then((publication) => res.status(200).json({ message: 'Like ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like === -1) {
        Publication.updateOne({ _id: req.params.id }, { $inc: { dislikes: (req.body.like++) * -1 }, $push: { usersDisliked: req.body.userId } })
            .then((publication) => res.status(200).json({ message: 'Dislike ajouté !' }))
            .catch(error => res.status(400).json({ error }))
    } else if (like === 0) {
        Publication.findOne({ _id: req.params.id })
            .then(publication => {
                if (publication.usersLiked.includes(req.body.userId)) {
                    Publication.updateOne({ _id: req.params.id }, { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } })
                        .then((publication) => { res.status(200).json({ message: 'Like supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                } else if (publication.usersDisliked.includes(req.body.userId)) {
                    Publication.updateOne({ _id: req.params.id }, { $pull: { usersDisliked: req.body.userId }, $inc: { dislikes: -1 } })
                        .then((publication) => { res.status(200).json({ message: 'Dislike supprimé !' }) })
                        .catch(error => res.status(400).json({ error }))
                }
            })
            .catch(error => res.status(400).json({ error }))
    } else {
        res.status(500).json({ message: 'choix non valide' })
    }
}