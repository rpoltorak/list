import request from 'supertest';
import app from '../src/index';

import mongoose from 'mongoose';
import { Source } from '../src/model/source';

beforeAll(() => {
    return mongoose.connect(
        // This is provided by jest-mongodb.
        // The `else testurl` is to appease Typescript.
        process.env.MONGO_URL || 'testurl',
        { useNewUrlParser: true, useUnifiedTopology: true },
    );
});

afterAll(() => {
    return mongoose.disconnect();
});

beforeEach(() => {
    return Source.deleteMany({});
});

describe('GET', () => {
    it('list should return 200', async () => {
        const source = await new Source({
            name: 'test-source',
            origin: { url: 'http://foo.bar' },
        }).save();
        const res = await request(app)
            .get('/api/sources')
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body).toHaveLength(1);
        expect(res.body[0]._id).toEqual(source.id);
    });
    it('one existing item should return 200', async () => {
        const source = await new Source({
            name: 'test-source',
            origin: { url: 'http://foo.bar' },
        }).save();
        const res = await request(app)
            .get(`/api/sources/${source.id}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body._id).toEqual(source.id);
    });
});

describe('PUT', () => {
    it('should update a source', async () => {
        const source = await new Source({
            name: 'test-source',
            origin: { url: 'http://foo.bar' },
        }).save();
        const res = await request(app)
            .put(`/api/sources/${source.id}`)
            .send({ name: 'new name' })
            .expect(200)
            .expect('Content-Type', /json/);
        // Check what changed.
        expect(res.body.name).toEqual('new name');
        // Check stuff that didn't change.
        expect(res.body.origin.url).toEqual('http://foo.bar');
    });
    it('cannot update an inexistent source', (done) => {
        request(app)
            .put('/api/sources/424242424242424242424242')
            .expect(404, done);
    });
    it('should not update to an invalid source', async () => {
        const source = await new Source({
            name: 'test-source',
            origin: { url: 'http://foo.bar' },
        }).save();
        const res = await request(app)
            .put(`/api/sources/${source.id}`)
            .send({ name: '' })
            .expect(422);
        expect(res.body).toMatch('Enter a name');
    });
});

describe('POST', () => {
    it('should return the created source', async () => {
        request(app)
            .post('/api/sources/')
            .send({ name: 'some name', origin: { url: 'http://what.ever' } })
            .expect(201);
    });
    it('should not create invalid source', async () => {
        const res = await request(app).post('/api/sources').expect(422);
        expect(res.body).toMatch('Enter a name');
    });
});

describe('DELETE', () => {
    it('should delete a source', async () => {
        const source = await new Source({
            name: 'test-source',
            origin: { url: 'http://foo.bar' },
        }).save();
        const res = await request(app)
            .delete(`/api/sources/${source.id}`)
            .expect(200)
            .expect('Content-Type', /json/);
        expect(res.body._id).toEqual(source.id);
    });
    it('should not be able to delete a non existent source', (done) => {
        request(app)
            .delete('/api/sources/424242424242424242424242')
            .expect(404, done);
    });
});
