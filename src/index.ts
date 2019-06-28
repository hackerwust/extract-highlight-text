export interface TrieNode {
    [key: string]: TrieNode | boolean | undefined;
}

export interface TextSliceItem {
    type: 'normal' | 'highlight';
    text: string;
    start: number;
    end: number;
}

export function buildTrieTree (keywords: string[]): TrieNode {
    const rootNode: TrieNode = {};
    if (!keywords.length) {
        return rootNode;
    }
    let curNode: TrieNode = rootNode;
    // 遍历keywords数组，对每个keyword递归构造字典树
    for (let i = 0; i < keywords.length; i++) {
        const word: string = keywords[i];
        for (let j = 0, len = word.length; j < len; j++) {
            const char: string = word[j];
            if (!curNode.hasOwnProperty(char)) {
                curNode[char] = {};
            }
            curNode = curNode[char] as TrieNode;
        }
        curNode.isLeaf = true;
        // 恢复curNode为rootNode(根节点)，准备开始扫描下一个keyword
        curNode = rootNode;
    }
    return rootNode;
}

export default function sliceTextByKeywords ({ text, keywords, trieTreeRoot, enableLazyMatch = false }: {
    // 原始文本串
    text: string;
    // 需要匹配的关键字
    keywords: string[];
    // 关键字字典树
    trieTreeRoot?: TrieNode;
    // 是否开启模糊匹配，忽略大小写, 默认关闭
    enableLazyMatch?: boolean;
}): TextSliceItem[] {
    if (!text) {
        return [];
    }
    if (!keywords || !keywords.length) {
        return [{
            type: 'normal',
            text: text,
            start: 0,
            end: text.length
        }];
    }
    let textTiles: TextSliceItem[] = [];
    const textLen = text.length;
    // 每次匹配起始位置
    let start = 0;
    // 上一次匹配终止下标，匹配到的字符串不包含text[lastMatchEnd]
    let lastMatchEnd = 0;
    const rootNode: TrieNode = trieTreeRoot ? trieTreeRoot : buildTrieTree(keywords);
    while (start < textLen) {
        let end = start;
        let curNode: TrieNode = rootNode;
        // 是否命中keyword字符串
        let matched = false;
        // 匹配到的keyword
        let matchecEndPos = end;
        while (end < textLen) {
            const char = text[end];
            if (curNode.hasOwnProperty(char)) {
                end++;
                curNode = curNode[char] as TrieNode;
                if (curNode.isLeaf) {
                    matchecEndPos = end;
                    matched = true;
                }
                continue;
            }
            // 进行模糊匹配
            if (enableLazyMatch) {
                const upperChar = char.toLowerCase();
                const lowerChar = char.toLowerCase();
                if (curNode.hasOwnProperty(upperChar) || curNode.hasOwnProperty(lowerChar)) {
                    end++;
                    curNode = (curNode[upperChar] || curNode[lowerChar]) as TrieNode;
                    if (curNode.isLeaf) {
                        matchecEndPos = end;
                        matched = true;
                    }
                    continue;
                }
            }
            break;
        }

        if (matched) {
            // 如果上次匹配结束时的下标位置小于本次匹配开始位置，说明中间有一段normal文本需要截取存储
            if (lastMatchEnd < start) {
                textTiles.push({
                    type: 'normal',
                    text: text.substring(lastMatchEnd, start),
                    start: lastMatchEnd,
                    end: start
                });
            }
            lastMatchEnd = matchecEndPos;
            textTiles.push({
                type: 'highlight',
                text: text.substring(start, matchecEndPos),
                start: start,
                end: matchecEndPos
            });
            start = matchecEndPos;
        } else {
            start++;
        }
    }
    // 最后一次匹配结束位置小于textLen表明还有一段normal文本没有截取
    if (lastMatchEnd < textLen) {
        textTiles.push({
            type: 'normal',
            text: text.substring(lastMatchEnd, textLen),
            start: lastMatchEnd,
            end: textLen
        });
    }
    return textTiles;
}
