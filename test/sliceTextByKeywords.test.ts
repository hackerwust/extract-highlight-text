import sliceTextByKeywords from '../src';
import test, { ExecutionContext } from 'ava';

test ('lazy match ["tt", "tttt"] include tt', (t: ExecutionContext) => {
    const text = '陪U自然拼读Letter Bb';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            enableLazyMatch: true,
            keywords: ["tt", "tttt"]
        }),
        [{
            type: 'normal',
            text: '陪U自然拼读Le',
            start: 0,
            end: 8
        }, {
            type: 'highlight',
            text: 'tt',
            start: 8,
            end: 10
        }, {
            type: 'normal',
            text: 'er Bb',
            start: 10,
            end: text.length
        }]
    );
});

test ('lazy match ["tttt", "tt"] include tt', (t: ExecutionContext) => {
    const text = '陪U自然拼读Letter Bb';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            enableLazyMatch: true,
            keywords: ["tttt", "tt"]
        }),
        [{
            type: 'normal',
            text: '陪U自然拼读Le',
            start: 0,
            end: 8
        }, {
            type: 'highlight',
            text: 'tt',
            start: 8,
            end: 10
        }, {
            type: 'normal',
            text: 'er Bb',
            start: 10,
            end: text.length
        }]
    );
});

test ('lazy match ["tttt", "tt"] include ttt', (t: ExecutionContext) => {
    const text = '陪U自然拼读Lettter Bb';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            enableLazyMatch: true,
            keywords: ["tttt", "tt"]
        }),
        [{
            type: 'normal',
            text: '陪U自然拼读Le',
            start: 0,
            end: 8
        }, {
            type: 'highlight',
            text: 'tt',
            start: 8,
            end: 10
        }, {
            type: 'normal',
            text: 'ter Bb',
            start: 10,
            end: text.length
        }]
    );
});

test('match empty keyword', (t: ExecutionContext) => {
    const text = '今晚打老虎';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            keywords: []
        }),
        [{
            type: 'normal',
            text: text,
            start: 0,
            end: text.length
        }]
    );
});

test('match empty text', (t: ExecutionContext) => {
    const text = '';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            keywords: ['电影']
        }),
        []
    );
});

test('match one keyword', (t: ExecutionContext) => {
    const text = '今晚打老虎，明天躺医院';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            keywords: ['老虎']
        }),
        [{
            type: 'normal',
            text: '今晚打',
            start: 0,
            end: 3
        }, {
            type: 'highlight',
            text: '老虎',
            start: 3,
            end: 5
        }, {
            type: 'normal',
            text: '，明天躺医院',
            start: 5,
            end: text.length
        }]
    );
});

test('match one keyword next to anthor keyword', (t: ExecutionContext) => {
    const text = '今晚打老虎虎虎生威';
    t.deepEqual(
        sliceTextByKeywords({
            text,
            keywords: ['老虎', '虎虎']
        }),
        [{
            type: 'normal',
            text: '今晚打',
            start: 0,
            end: 3
        }, {
            type: 'highlight',
            text: '老虎',
            start: 3,
            end: 5
        }, {
            type: 'highlight',
            text: '虎虎',
            start: 5,
            end: 7
        }, {
            type: 'normal',
            text: '生威',
            start: 7,
            end: text.length
        }]
    );
});
