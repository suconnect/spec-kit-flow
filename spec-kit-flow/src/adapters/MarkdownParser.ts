/**
 * Markdown ???
 * ?? unified + remark-parse ?? Markdown ? AST
 */

import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import type { Root } from 'mdast'

/**
 * Markdown ????
 */
export class MarkdownParser {
  private processor: ReturnType<typeof unified>

  constructor() {
    // ??? unified ???
    this.processor = unified()
      .use(remarkParse)      // ?? Markdown
      .use(remarkGfm)        // ?? GitHub Flavored Markdown
  }

  /**
   * ?? Markdown ???? AST
   * @param markdown - Markdown ??
   * @returns Markdown AST (Root??)
   */
  parse(markdown: string): Root {
    try {
      const ast = this.processor.parse(markdown) as Root
      return ast
    } catch (error) {
      console.error('[MarkdownParser] ????:', error)
      throw new Error(`Markdown ????: ${(error as Error).message}`)
    }
  }

  /**
   * ???? Markdown???????
   * @param markdown - Markdown ??
   * @returns Promise<Root>
   */
  async parseAsync(markdown: string): Promise<Root> {
    return Promise.resolve(this.parse(markdown))
  }
}

// ????
export const markdownParser = new MarkdownParser()
