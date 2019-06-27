# extract-highlight-text
基于字典树数据结构的多关键字查找匹配模块，用于前端文本高亮，时间复杂度为O(N)

### 安装
npm install extract-highlight-text --save

### 特性
1. 支持模糊匹配(忽略大小写)
2. 对于比较庞大的目标字符串拥有良好的性能

### 使用
```js
import sliceTextByKeywords from 'extract-highlight-text';
const keywords = ['Apple'];
const result = sliceTextByKeywords({
    text: 'I have a Apple',
    // 开启模糊匹配
    enableLazyMatch: true,
    keywords: keywords
});
```

以上代码会输出如下内容， type为`highlight`表示匹配成功的子串
```js
  // result
  [
    {
      type: 'normal',
      text: 'I have a ',
      start: 0,
      end: 9
    }, {
      type: 'highlight',
      text: 'Apple',
      start: 9,
      end: 14
    }
  ]
```

有时会对一批文本高亮同样的关键词组，可以先对关键字构造好字典树，避免匹配时多次重复构造，提高效率

```js
import sliceTextByKeywords, { buildTrieTree } from 'extract-highlight-text';
const keywords = ['明月', '地上'];
const trieTreeRoot = buildTrieTree(keywords);

const result1 = sliceTextByKeywords({
    text: '床前明月光，疑似地上霜',
    keywords: keywords,
    trieTreeRoot: trieTreeRoot
});

const result2 = sliceTextByKeywords({
    text: '举头望明月，低头思故乡',
    keywords: keywords,
    trieTreeRoot: trieTreeRoot
});
```

trieTreeRoot结构如下
```js
{
    '明': {
        '月': {}
    },
    '地': {
        '上': {}
    }
}
```

以上代码会输出如下内容， type为`highlight`表示匹配成功的子串
```js
  // result1
  [
    { type: 'normal', text: '床前', start: 0, end: 2 },
    { type: 'highlight', text: '明月', start: 2, end: 4 },
    { type: 'normal', text: '光，疑似', start: 4, end: 8 },
    { type: 'highlight', text: '地上', start: 8, end: 10 },
    { type: 'normal', text: '霜', start: 10, end: 11 }
  ]

  // result2
  [
    { type: 'normal', text: '举头望', start: 0, end: 3 },
    { type: 'highlight', text: '明月', start: 3, end: 5 },
    { type: 'normal', text: '，低头思故乡', start: 5, end: 11 }
  ]
```
