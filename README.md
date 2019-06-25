# extract-highlight-text
基于字典树数据结构的多关键字查找匹配模块，用于前端文本高亮，时间复杂度为O(N)。
对于关键词组如['影视', '人生', '影迷天下']会构造如下Trie树
```js
{
    '影':  {
        '视': {},
        '迷': {
            '天': {
                '下': {}
            }
        }
    },
    '人': {
        '生': {}
    }
}
```
然后遍历原始串在Trie进行查找

### 安装
npm install extract-highlight-text --save

### 使用
```js
import sliceTextByKeywords from 'extract-highlight-text';
const title = '床前明月光，疑似地上霜';
const keywords = ['明月', '地上'];
const result = sliceTextByKeywords({
    text: title,
    keywords: keywords
});
```
以上代码会输出如下内容， type为`highlight`表示需要高亮的内容
```js
 [ { type: 'normal', text: '床前', start: 0, end: 2 },
  { type: 'highlight', text: '明月', start: 2, end: 4 },
  { type: 'normal', text: '光，疑似', start: 4, end: 8 },
  { type: 'highlight', text: '地上', start: 8, end: 10 },
  { type: 'normal', text: '霜', start: 10, end: 11 } ]
```

有时会对一批文本高亮同样的关键词组，可以先对关键字构造好字典树，避免匹配时多次重复构造，提高效率

```js
import sliceTextByKeywords, { buildTrieTree } from 'extract-highlight-text';
const title = '床前明月光，疑似地上霜';
const keywords = ['明月', '地上'];
const trieTreeRoot = buildTrieTree(keywords);
const result = sliceTextByKeywords({
    text: title,
    keywords: keywords,
    trieTreeRoot: trieTreeRoot
});
```
以上代码会输出如下内容， type为`highlight`表示需要高亮的内容
```js
 [ { type: 'normal', text: '床前', start: 0, end: 2 },
  { type: 'highlight', text: '明月', start: 2, end: 4 },
  { type: 'normal', text: '光，疑似', start: 4, end: 8 },
  { type: 'highlight', text: '地上', start: 8, end: 10 },
  { type: 'normal', text: '霜', start: 10, end: 11 } ]
```