import {
    DictionaryDocument,
    dictionarySchema,
} from '../../src/model/dictionary';

import { Error } from 'mongoose';
import fullModel from './data/dictionary.full.json';
import minimalModel from './data/dictionary.minimal.json';
import mongoose from 'mongoose';

const Dictionary = mongoose.model<DictionaryDocument>(
    'Dictionary',
    dictionarySchema,
);

describe('validate', () => {
    it('a values field with duplicate values is invalid', async () => {
        return new Dictionary({ ...fullModel, values: ['a', 'a'] }).validate(
            (e) => {
                expect(e.name).toBe(Error.ValidationError.name);
            },
        );
    });

    it('a minimal dictionary document is valid', async () => {
        return new Dictionary(minimalModel).validate();
    });

    it('a fully specified dictionary document is valid', async () => {
        return new Dictionary(fullModel).validate();
    });
});
