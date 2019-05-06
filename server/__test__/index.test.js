import request from 'supertest';

describe('Express server', function () {
    let app;

    beforeEach(function () {
        app = require('../index.js');
    });

    describe('Root path', () => {
        test('should respond to the GET method', async (done) => {
            request(app).get('/').then((response) => {
                expect(response.statusCode).toBe(200);
                done();
            });
        });
    });

    describe('Health check', () => {
        test('should respond to the GET method', async () => {
            const response = await request(app).get('/healthcheck');
            expect(response.statusCode).toBe(200);
        });
    });

});