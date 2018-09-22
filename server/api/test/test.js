const request = require('supertest');
const app = require('../app');
const uuidv4 = require('uuid/v4');

/* eslint-disable no-console */

function randomUsername() {
    return uuidv4().replace(/^[-\d]+/, '').replace(/-+$/, '');
}

describe('Index page', () => {
    it('should render successfully', done => {
        request(app).get('/').expect(200, done);
    });
});

describe('Art API', () => {
    describe('GET art data', () => {
        it('should get art data', done => {
            request(app).get('/v1/art/10000002').expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.title.en === 'Aristotle with a Bust of Homer')
                .end(done);
        });
        it('should report invalid id', done => {
            request(app).get('/v1/art/1000002').expect(400)
                .expect('Content-Type', /json/)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report invalid username', done => {
            request(app).get('/v1/art/as').expect(400)
                .expect('Content-Type', /json/)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report ART_NOT_FOUND', done => {
            request(app).get('/v1/art/00000000').expect(404)
                .expect('Content-Type', /json/)
                .expect(res => res.body.code === 'ART_NOT_FOUND')
                .end(done);
        });
        it('should report ART_NOT_FOUND', done => {
            request(app).get('/v1/art/notexist').expect(404)
                .expect('Content-Type', /json/)
                .expect(res => res.body.code === 'ART_NOT_FOUND')
                .end(done);
        });
    });

    describe('GET art relations', () => {
        it('should return related artizens of art', done => {
            request(app).get('/v1/art/10000003/artizen').expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.length >= 4 && res.body[3].type && res.body[3].data[0].id)
                .end(done);
        });
        it('should return specified type of relations', done => {
            request(app).get('/v1/art/10000003/artizen?type=artist').expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.length === 0 && res.body[0].type === 'artist')
                .end(done);
        });
        it('should return empty relations', done => {
            request(app).get('/v1/art/10000003/artizen?type=notexist').expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.length === 0)
                .end(done);
        });
        it('should report invalid id', done => {
            request(app).get('/v1/art/1000003/artizen').expect(400)
                .expect('Content-Type', /json/)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report invalid username', done => {
            request(app).get('/v1/art/as/artizen').expect(400)
                .expect('Content-Type', /json/)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report ART_NOT_FOUND', done => {
            request(app).get('/v1/art/00000000/artizen').expect(404)
                .expect('Content-Type', /json/)
                .expect(res => res.body.code === 'ART_NOT_FOUND')
                .end(done);
        });
        it('should report ART_NOT_FOUND', done => {
            request(app).get('/v1/art/notexist/artizen').expect(404)
                .expect('Content-Type', /json/)
                .expect(res => res.body.code === 'ART_NOT_FOUND')
                .end(done);
        });
        it('should report invalid type', done => {
            request(app).get('/v1/art/10000003/artizen?type=123').expect(400)
                .expect('Content-Type', /json/)
                .expect(res => res.body.errors)
                .end(done);
        });
    });

    describe('PUT artizen', () => {
        it('should put artizen data', done => {
            const username = randomUsername();
            request(app).put(`/v1/artizen/${username}`)
                .send({
                    'name': {'default': 'This is name A', 'en': 'This is name A'},
                    'username': username,
                    'type': ['museum', 'exhibition']
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.username === username && res.body.id.toString().match(/^\d{10}$/))
                .end(() => {
                    request(app).get(`/v1/artizen/${username}`)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .expect(res => res.body.name.default === 'This is name A' && res.body.type.length === 2)
                        .end(done);
                });
        });
        it('should report invalid data', done => {
            const username = randomUsername();
            request(app).put(`/v1/artizen/${username}`)
                .send({
                    'name': {'en': 'This is name A'},
                    'username': randomUsername()
                })
                .expect(400)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report invalid data', done => {
            const username = randomUsername();
            request(app).put(`/v1/artizen/${username}`)
                .send({
                    'name': {'en': 'This is name A'},
                    'username': username
                })
                .expect(400)
                .expect(res => res.body.errors)
                .end(done);
        });
        it('should report duplicate username', done => {
            const username = 'nga';
            request(app).put('/v1/artizen/nga')
                .send({
                    'name': {'default': 'NGA', 'en': 'NGA'},
                    'username': username
                })
                .expect(400)
                .expect(res => res.body.code === 'USERNAME_EXIST')
                .end(done);
        });
    });

    describe('PUT art', () => {
        it('should put art data and relations', done => {
            const username = randomUsername();
            request(app).put(`/v1/art/${username}`)
                .send({
                    'title': {'default': 'This is title A', 'en': 'This is title A'},
                    'username': username,
                    'relations': [
                        {'artizen': 'nga', 'type': 'museum'},
                        {'artizen': 'nga', 'type': 'exhibition'},
                        {'artizen': 'caravaggio', 'type': 'artist'},
                        {'artizen': 'leonardo-da-vinci', 'type': 'artist'}]
                })
                .expect(200)
                .expect('Content-Type', /json/)
                .expect(res => res.body.username === username && res.body.id.toString().match(/^\d{10}$/))
                .end(() => {
                    request(app).get(`/v1/art/${username}/artizen`)
                        .expect(200)
                        .expect('Content-Type', /json/)
                        .expect(res => {
                            if (res.body.length !== 3) {
                                return false;
                            }
                            for (let item of res.body) {
                                if (item.type === 'artist' && item.data.length !== 2) {
                                    return false;
                                }
                                if (item.type === 'museum' && item.data.length !== 1) {
                                    return false;
                                }
                                if (item.type === 'exhibition' && (item.data.length !== 1 || parseInt(item.data[0].id) !== 1000000012)) {
                                    return false;
                                }
                            }
                            return true;
                        })
                        .end(done);
                });
        });
    });
});
