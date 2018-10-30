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
        request.post({
            url: `${process.env.ESROOT}/${index}/_search`,
            body: {
                'from':req.query.from,
                'size':20,
                'query': {
                    'bool':{
                        'should':
                        [
                            {
                                'multi_match' : {
                                    'query': req.query.q,
                                    'fields':['title.*','artist.*','museum.*','genre.*','style.*','name.*'],
                                    'fuzziness' : 'AUTO',
                                    'prefix_length' : 0,
                                    'operator':'and'
                                }
                            },
                            {
                                'multi_match' : 
                                {
                                    'query': req.query.q,
                                    'fields':['introduction.*'],
                                    'operator':'and'
                                }
                            }
                        ]
                    }
                },
            },
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
