/**
 * SpecKit ???????
 * 
 * ????? Markdown ???????
 */

import { markdownAdapter } from '../adapters';
import { specKitRecognizer } from '../speckit';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('SpecKit ????', () => {
  describe('????: Markdown ? ?? ? ??', () => {
    it('????????? test-spec.md', () => {
      // 1. ??????
      const markdown = `
# ??????

## ???????

### ???? 1 - Markdown ????????????P1?

?? spec-kit ???????????

### ???? 2 - ??????????P2?

## ??

- **FR-001**: ?????? flowgram.ai
- **FR-002**: ??????

## ????

- **SC-001**: 5 ???????

## ????

- [ ] ?? 1
- [x] ?? 2
      `.trim();
      
      // 2. ?? Markdown
      let nodes = markdownAdapter.parseMarkdownToNodes(markdown);
      
      expect(nodes.length).toBeGreaterThan(0);
      
      // 3. ?? spec-kit ??
      nodes = specKitRecognizer.recognizeAll(nodes);
      
      // 4. ??????
      const userStoryNodes = nodes.filter((n) => n.type === 'user-story');
      expect(userStoryNodes.length).toBe(2);
      
      const userStory1 = userStoryNodes[0];
      expect(userStory1.data.storyNumber).toBe(1);
      expect(userStory1.data.priority).toBe('P1');
      
      const userStory2 = userStoryNodes[1];
      expect(userStory2.data.storyNumber).toBe(2);
      expect(userStory2.data.priority).toBe('P2');
      
      const frNodes = nodes.filter((n) => n.type === 'functional-requirement');
      expect(frNodes.length).toBe(2);
      expect(frNodes[0].data.requirementId).toBe('FR-001');
      
      const scNodes = nodes.filter((n) => n.type === 'success-criteria');
      expect(scNodes.length).toBe(1);
      expect(scNodes[0].data.criteriaId).toBe('SC-001');
      
      const taskNodes = nodes.filter((n) => n.type === 'task');
      expect(taskNodes.length).toBe(2);
      expect(taskNodes[0].data.completed).toBe(false);
      expect(taskNodes[1].data.completed).toBe(true);
    });
  });
  
  describe('??????', () => {
    it('Markdown ? ?? ? Markdown ??????', () => {
      const originalMarkdown = `
# ?? 1

## ?? 2

### ???? 1 - ???????P1?

- **FR-001**: ????
- [ ] ????
      `.trim();
      
      // Markdown ? ??
      let nodes = markdownAdapter.parseMarkdownToNodes(originalMarkdown);
      nodes = specKitRecognizer.recognizeAll(nodes);
      
      // ?? ? Markdown
      const rebuiltMarkdown = markdownAdapter.buildNodesToMarkdown(nodes);
      
      // ????????
      expect(rebuiltMarkdown).toContain('# ?? 1');
      expect(rebuiltMarkdown).toContain('## ?? 2');
      expect(rebuiltMarkdown).toContain('### ???? 1');
      expect(rebuiltMarkdown).toContain('- **FR-001**:');
      expect(rebuiltMarkdown).toContain('- [ ] ????');
    });
  });
  
  describe('SpecKit ?????', () => {
    it('????????????? spec-kit ???', () => {
      const markdown = '### ???? 5 - ?????????P3?';
      
      let nodes = markdownAdapter.parseMarkdownToNodes(markdown);
      nodes = specKitRecognizer.recognizeAll(nodes);
      
      const node = nodes[0];
      
      // ????
      expect(node.type).toBe('user-story');
      
      // ?????
      expect(node.data.specKitType).toBe('user-story');
      expect(node.data.storyNumber).toBe(5);
      expect(node.data.title).toBe('????');
      expect(node.data.priority).toBe('P3');
    });
  });
});
