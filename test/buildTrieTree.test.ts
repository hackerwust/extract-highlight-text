import { buildTrieTree } from '../src';
import test, { ExecutionContext } from 'ava';

test('build ["tt", "tttt"]', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(["tt", "tttt"]),
        {
            't': {
                't': {
                    't': {
                        't': { isLeaf: true }
                    },
                    isLeaf: true
                }
            }
        }
    );
});

test('build ["tttt", "tt"]', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(["tttt", "tt"]),
        {
            't': {
                't': {
                    't': {
                        't': { isLeaf: true }
                    },
                    isLeaf: true
                }
            }
        }
    );
});

test('empty keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree([]),
        {}
    );
});

test('one keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['游戏']),
        {'游': {'戏': { isLeaf: true }}}
    );
});

test('tow keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['电影', '游戏']),
        {
            '游': {'戏': { isLeaf: true }},
            '电': {'影': { isLeaf: true }}
        }
    );
});

// keyword有交集
test('union keyword', (t: ExecutionContext) => {
    t.deepEqual(
        buildTrieTree(['美女', '美貌']),
        {
            '美': {'女': { isLeaf: true }, '貌': { isLeaf: true}}
        }
    );
});