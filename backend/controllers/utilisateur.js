const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Utilisateur = require('../models/utilisateur');

exports.signup = (req, res, next) => {
    console.log(req.body)
    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const utilisateur = new Utilisateur({
                email: req.body.email,
                password: hash
            });
            utilisateur.save()
                .then(() => res.status(201).json({
                    message: 'Utilisateur créé !'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};

exports.login = (req, res, next) => {
    Utilisateur.findOne({
            email: req.body.email
        })
        .then(utilisateur => {
            if (!utilisateur) {
                return res.status(401).json({
                    error: 'Utilisateur non trouvé !'
                });
            }
            bcrypt.compare(req.body.password, utilisateur.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Mot de passe incorrect !'
                        });
                    }
                    res.status(200).json({
                        userId: utilisateur._id,
                        token: jwt.sign({
                                userId: utilisateur._id
                            },
                            'RANDOM_TOKEN_SECRET', {
                                expiresIn: '24h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};