import { buildTrieTree } from '../src';
import test, { ExecutionContext } from 'ava';

test('empty keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree([]),
        {}
    );
});

test('one keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['游戏']),
        {'游': {'戏': {}}}
    );
});

test('tow keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['电影', '游戏']),
        {
            '游': {'戏': {}},
            '电': {'影': {}}
        }
    );
});

// keyword有交集
test('union keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['美女', '美貌']),
        {
            '美': {'女': {}, '貌': {}}
        }
    );
});