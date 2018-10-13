require('dotenv').config();
const express = require('express');
const router = express.Router();
const _ = require('lodash');
const request = require('request');
const {query, validationResult} = require('express-validator/check');

/* GET search results. */
router.get('/', [
    query('q').exists().isLength({min: 1}),
    query('from').optional().isInt(),
], function (req, res, next) {
    const errors = validationResult(req);
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }

    let results = {'art': [], 'artizen': []};

    const search = _.after(Object.keys(results).length, () => {
        res.json(results);
    });

    for (let index in results) {
        request.get({
            url: `${process.env.ESROOT}/${index}/_search`,
            qs: {q: req.query.q, from: req.query.from || 0, size: 20},
            json: true
        }, (error, response, body) => {
            /* istanbul ignore if */
            if (error || !(response && response.statusCode === 200)) {
                res.status(500).json({
                    code: 'ES_ERROR',
                    message: 'Error in ElasticSearch service'
                });
            } else {
                results[index] = body.hits.hits.map(item => item._source);
                search();
            }
        });
    }
});

module.exports = router;
