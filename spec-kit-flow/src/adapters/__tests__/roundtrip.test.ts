/**
 * Markdown ???????
 * ?? Markdown ? Nodes ? Markdown ????
 */

import { MarkdownAdapter } from '../MarkdownAdapter'
import type { SpecKitFlowNode } from '../../types/speckit'

describe('MarkdownAdapter - Roundtrip Tests', () => {
  let adapter: MarkdownAdapter

  beforeEach(() => {
    adapter = new MarkdownAdapter()
  })

  /**
   * ??? Markdown????????
   */
  const normalizeMarkdown = (md: string): string => {
    return md
      .trim()
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .split('\n')
      .map(line => line.trimEnd())
      .join('\n')
  }

  describe('??????', () => {
    test('??????', () => {
      const originalMarkdown = `# ????

## ????

### ????`

      const nodes = adapter.parseMarkdownToNodes(originalMarkdown)
      expect(nodes).toHaveLength(3)
      expect(nodes[0].data.label).toBe('????')
      expect(nodes[0].data.depth).toBe(1)
      expect(nodes[1].data.label).toBe('????')
      expect(nodes[1].data.depth).toBe(2)
      expect(nodes[2].data.label).toBe('????')
      expect(nodes[2].data.depth).toBe(3)

      const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
      const normalizedOriginal = normalizeMarkdown(originalMarkdown)
      const normalizedRebuilt = normalizeMarkdown(rebuiltMarkdown)

      expect(normalizedRebuilt).toContain('# ????')
      expect(normalizedRebuilt).toContain('## ????')
      expect(normalizedRebuilt).toContain('### ????')
    })

    test('??????', () => {
      const originalMarkdown = `# ????

???????????

## ????

???????

### ???? 1

???????`

      const nodes = adapter.parseMarkdownToNodes(originalMarkdown)
      expect(nodes).toHaveLength(3)
      
      const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('# ????')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('## ????')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('### ???? 1')
    })

    test('??????', () => {
      const originalMarkdown = `# ???

## ??? A

### ??? A1

## ??? B

### ??? B1

#### ???? B1a`

      const nodes = adapter.parseMarkdownToNodes(originalMarkdown)
      
      // ??????
      const rootNode = nodes.find(n => n.data.label === '???')
      expect(rootNode).toBeDefined()
      expect(rootNode?.children).toHaveLength(2)
      
      const childA = nodes.find(n => n.data.label === '??? A')
      expect(childA?.children).toHaveLength(1)
      
      const childB = nodes.find(n => n.data.label === '??? B')
      expect(childB?.children).toHaveLength(1)
      
      const grandchildB1 = nodes.find(n => n.data.label === '??? B1')
      expect(grandchildB1?.children).toHaveLength(1)
    })
  })

  describe('spec.md ??????', () => {
    test('??????', () => {
      const specMarkdown = `# ????

## ???????

### ???? 1 - Markdown ????????????P1?

??????????????? Markdown ??????

#### ????

1. **??** ?? spec.md ??
2. **?** ??????
3. **?** ????????

### ???? 2 - ??????????P2?

?????????????????????`

      const nodes = adapter.parseMarkdownToNodes(specMarkdown)
      
      // ?????????
      expect(nodes.length).toBeGreaterThan(0)
      
      // ?????
      const rootNode = nodes[0]
      expect(rootNode.data.label).toBe('????')
      expect(rootNode.data.depth).toBe(1)
      
      // ????????
      const userStory1 = nodes.find(n => 
        n.data.label.includes('???? 1')
      )
      expect(userStory1).toBeDefined()
      expect(userStory1?.data.depth).toBe(3)
      
      // ????
      const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('# ????')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('???? 1')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('???? 2')
    })

    test('???????', () => {
      const markdown = `## ??

### ?????

- **FR-001**: ?????? Markdown ??
- **FR-002**: ??????????

### ????

- **SC-001**: ?????? 100ms
- **SC-002**: ??????`

      const nodes = adapter.parseMarkdownToNodes(markdown)
      
      expect(nodes.length).toBeGreaterThan(0)
      
      const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('## ??')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('### ?????')
      expect(normalizeMarkdown(rebuiltMarkdown)).toContain('### ????')
    })
  })

  describe('??????', () => {
    test('???', () => {
      const markdown = ''
      const nodes = adapter.parseMarkdownToNodes(markdown)
      expect(nodes).toHaveLength(0)
      
      const rebuilt = adapter.buildNodesToMarkdown(nodes)
      expect(rebuilt.trim()).toBe('')
    })

    test('???????', () => {
      const markdown = `????????????

??????`

      const nodes = adapter.parseMarkdownToNodes(markdown)
      expect(nodes).toHaveLength(0)  // ??????????
    })

    test('???????h6?', () => {
      const markdown = `# H1
## H2
### H3
#### H4
##### H5
###### H6`

      const nodes = adapter.parseMarkdownToNodes(markdown)
      expect(nodes).toHaveLength(6)
      expect(nodes[5].data.depth).toBe(6)
      
      const rebuilt = adapter.buildNodesToMarkdown(nodes)
      expect(normalizeMarkdown(rebuilt)).toContain('###### H6')
    })

    test('???????', () => {
      const markdown = `# H1

### H3???? H2?

##### H5???? H4?`

      const nodes = adapter.parseMarkdownToNodes(markdown)
      expect(nodes).toHaveLength(3)
      
      // ?????????
      expect(nodes[0].data.depth).toBe(1)
      expect(nodes[1].data.depth).toBe(3)
      expect(nodes[2].data.depth).toBe(5)
    })

    test('?????????', () => {
      const markdown = `# ?? *??* **??** \`??\`

## ?? [??](url)

### ?? & ?? < > $`

      const nodes = adapter.parseMarkdownToNodes(markdown)
      expect(nodes).toHaveLength(3)
      
      const rebuiltMarkdown = adapter.buildNodesToMarkdown(nodes)
      // ?????????
      expect(rebuiltMarkdown).toBeTruthy()
    })
  })

  describe('????', () => {
    test('????????', () => {
      // ?? 100 ??????
      const lines: string[] = []
      for (let i = 1; i <= 100; i++) {
        const depth = (i % 3) + 1
        lines.push(`${'#'.repeat(depth)} ?? ${i}`)
        lines.push('')
        lines.push(`???? ${i} ????`)
        lines.push('')
      }
      const largeMarkdown = lines.join('\n')
      
      const startTime = Date.now()
      const nodes = adapter.parseMarkdownToNodes(largeMarkdown)
      const parseTime = Date.now() - startTime
      
      expect(nodes).toHaveLength(100)
      expect(parseTime).toBeLessThan(100)  // ???? 100ms
      
      // ????????
      const rebuildStartTime = Date.now()
      const rebuilt = adapter.buildNodesToMarkdown(nodes)
      const rebuildTime = Date.now() - rebuildStartTime
      
      expect(rebuildTime).toBeLessThan(100)  // ???? 100ms
      expect(rebuilt).toBeTruthy()
    })
  })

  describe('???????', () => {
    test('???????', () => {
      const markdown = `# ????`
      
      const nodes = adapter.parseMarkdownToNodes(markdown)
      const node = nodes[0]
      
      // ?????????
      expect(node.id).toBeDefined()
      expect(node.type).toBe('heading')
      expect(node.data.label).toBe('????')
      expect(node.data.content).toBeDefined()
      expect(node.data.preview).toBeDefined()
      expect(node.data.depth).toBe(1)
      expect(node.data.wordCount).toBeDefined()
      expect(node.data.lastModified).toBeDefined()
      expect(node.data.status).toBe('draft')
      expect(node.position).toEqual({ x: 0, y: 0 })
    })

    test('AST ????', () => {
      const markdown = `# ????

## ???`
      
      const nodes = adapter.parseMarkdownToNodes(markdown)
      
      // ?? AST ?????
      nodes.forEach(node => {
        expect(node.data.astNodeRef).toBeDefined()
        expect(node.data.astNodeRef.type).toBe('heading')
      })
    })

    test('??????', () => {
      const markdown = `# ???

## ??? 1

### ??? 1-1

## ??? 2`
      
      const nodes = adapter.parseMarkdownToNodes(markdown)
      
      const parent = nodes.find(n => n.data.label === '???')
      const child1 = nodes.find(n => n.data.label === '??? 1')
      const grandchild = nodes.find(n => n.data.label === '??? 1-1')
      const child2 = nodes.find(n => n.data.label === '??? 2')
      
      expect(parent?.children).toContain(child1?.id)
      expect(parent?.children).toContain(child2?.id)
      expect(child1?.children).toContain(grandchild?.id)
    })
  })
})
