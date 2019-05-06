import request from 'supertest';
import Generic from '../../../db/models';
import createInMemoryMongoose from '../../../db/createInMemoryMongoose';

// May require additional time for downloading MongoDB binaries
jasmine.DEFAULT_TIMEOUT_INTERVAL = 60000;

describe('API documents requests', function () {
    let mongoServer;
    let db;
    let app;

    beforeAll(async () => {
        const inMemoryDB = createInMemoryMongoose();
        mongoServer = inMemoryDB.mongoServer;
        db = inMemoryDB.db;
    });

    afterAll(async () => {
        await db.disconnect();
        await mongoServer.stop();
    });

    beforeEach(() => {
        app = require('../../index.js');
    });

    afterEach(async () => {
        await Generic.deleteMany({});
    });

    describe('GET', () => {
        test('should honour a limit on', async (done) => {
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'cluck'
                }
            }).save();
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'bakawk'
                }
            }).save();

            request(app).get('/api/chicken?limit=1').then((response) => {
                const responseText = JSON.parse(response.text);
                expect(response.statusCode).toBe(200);
                expect(responseText.length).toBe(1);
                expect(responseText[0].data).toEqual({ goes: 'cluck' });
                done();
            });
        });

        test('should honour an order', async (done) => {
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'cluck'
                }
            }).save();
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'bakawk'
                }
            }).save();

            request(app).get('/api/chicken?order=descending').then((response) => {
                const responseText = JSON.parse(response.text);
                expect(response.statusCode).toBe(200);
                expect(responseText.length).toBe(2);
                expect(responseText[0].data).toEqual({ goes: 'bakawk' });
                expect(responseText[1].data).toEqual({ goes: 'cluck' });
                done();
            });
        });

        test('should handle complex criteria', async (done) => {
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'cluck',
                    sometimes: {
                        goes: 'squawk'
                    }
                }
            }).save();
            await new Generic({
                name: 'chicken',
                created_at: new Date().getTime(),
                data: {
                    goes: 'squawk',
                    never: {
                        goes: 'woof'
                    }
                }
            }).save();

            request(app).get('/api/chicken?sometimes.goes=squawk').then((response) => {
                const responseText = JSON.parse(response.text);
                expect(response.statusCode).toBe(200);
                expect(responseText.length).toBe(1);
                expect(responseText[0].data).toEqual({ goes: 'cluck', sometimes: { goes: 'squawk' } });
                done();
            });
        });

    });

    describe('POST', () => {
        test('should save documents', (done) => {
            const horsey = {
                'id': 1,
                'name': 'Shadowfax'
            };
            request(app)
                .post('/api/horses')
                .send(horsey)
                .set('Content-Type', 'application/json')
                .expect(200)
                .end((err, res) => {
                    if (err) throw err;
                    expect(res.body.data).toEqual(horsey);
                    Generic
                        .find({ name: 'horses' })
                        .exec((err, documents) => {
                            expect(documents.length).toBe(1);
                            expect(documents[0].data).toEqual(horsey);
                            done();
                        });
                });
        });
    })
});