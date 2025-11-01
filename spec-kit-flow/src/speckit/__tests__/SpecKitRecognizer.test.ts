/**
 * SpecKit ???????
 */

import { SpecKitRecognizer } from '../SpecKitRecognizer';
import { SPEC_KIT_PATTERNS } from '../patterns';
import type { SpecKitFlowNode } from '../../types/speckit';

describe('SpecKitRecognizer', () => {
  let recognizer: SpecKitRecognizer;
  
  beforeEach(() => {
    recognizer = new SpecKitRecognizer();
  });
  
  describe('?? 1: ??????', () => {
    it('?????????????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_1',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {
          title: '???? 1 - Markdown ????????????P1?',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('user-story');
      expect(result.data.specKitType).toBe('user-story');
      expect(result.data.storyNumber).toBe(1);
      expect(result.data.title).toBe('Markdown ???????');
      expect(result.data.priority).toBe('P1');
    });
    
    it('??????????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_2',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {
          title: '???? 5 - CLI ??????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('user-story');
      expect(result.data.storyNumber).toBe(5);
      expect(result.data.title).toBe('CLI ??????');
      expect(result.data.priority).toBeUndefined();
    });
    
    it('????????????', () => {
      const storyNumber = recognizer.extractStoryNumber('???? 123 - ?????????P2?');
      expect(storyNumber).toBe(123);
    });
  });
  
  describe('?? 2: ??????', () => {
    it('??????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_3',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {
          title: '????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('acceptance-scenario');
      expect(result.data.isAcceptanceSection).toBe(true);
    });
  });
  
  describe('?? 3: ???????', () => {
    it('?????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_4',
        type: 'list-item',
        meta: { position: { x: 0, y: 0 } },
        data: {
          content: '- **FR-001**: ?????? flowgram.ai demo-free-layout ??????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('functional-requirement');
      expect(result.data.requirementId).toBe('FR-001');
      expect(result.data.content).toBe('?????? flowgram.ai demo-free-layout ??????');
    });
    
    it('???????????ID', () => {
      const node: SpecKitFlowNode = {
        id: 'test_5',
        type: 'list-item',
        meta: { position: { x: 0, y: 0 } },
        data: {
          content: '- **FR-025**: ????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.data.requirementId).toBe('FR-025');
    });
  });
  
  describe('?? 4: ??????', () => {
    it('????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_6',
        type: 'list-item',
        meta: { position: { x: 0, y: 0 } },
        data: {
          content: '- **SC-001**: ????? 5 ?????????????????????????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('success-criteria');
      expect(result.data.criteriaId).toBe('SC-001');
      expect(result.data.content).toContain('5 ?????');
    });
  });
  
  describe('?? 5: ??????', () => {
    it('??????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_7',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {
          title: '????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('boundary-case');
      expect(result.data.isBoundarySection).toBe(true);
    });
  });
  
  describe('?? 6: ??????', () => {
    it('?????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_8',
        type: 'list-item',
        meta: { position: { x: 0, y: 0 } },
        data: {
          content: '- [ ] flowgram.ai ?????????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('task');
      expect(result.data.taskDescription).toBe('flowgram.ai ?????????');
      expect(result.data.completed).toBe(false);
    });
    
    it('?????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test_9',
        type: 'list-item',
        meta: { position: { x: 0, y: 0 } },
        data: {
          content: '- [x] ???????',
        },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('task');
      expect(result.data.taskDescription).toBe('???????');
      expect(result.data.completed).toBe(true);
    });
  });
  
  describe('?? 7: ???????', () => {
    it('??????? P1', () => {
      const priority = recognizer.extractPriority('?????????P1?????...');
      expect(priority).toBe('P1');
    });
    
    it('??????? P2', () => {
      const priority = recognizer.extractPriority('???????????P2?');
      expect(priority).toBe('P2');
    });
    
    it('??????? P3', () => {
      const priority = recognizer.extractPriority('???????????P3?');
      expect(priority).toBe('P3');
    });
    
    it('????????? undefined', () => {
      const priority = recognizer.extractPriority('??????????');
      expect(priority).toBeUndefined();
    });
  });
  
  describe('????', () => {
    it('??????????', () => {
      const nodes: SpecKitFlowNode[] = [
        {
          id: 'node_1',
          type: 'heading',
          meta: { position: { x: 0, y: 0 } },
          data: { title: '???? 1 - ???????P1?' },
        },
        {
          id: 'node_2',
          type: 'heading',
          meta: { position: { x: 0, y: 0 } },
          data: { title: '????' },
        },
        {
          id: 'node_3',
          type: 'list-item',
          meta: { position: { x: 0, y: 0 } },
          data: { content: '- [ ] ????' },
        },
      ];
      
      const results = recognizer.recognizeAll(nodes);
      
      expect(results[0].type).toBe('user-story');
      expect(results[1].type).toBe('acceptance-scenario');
      expect(results[2].type).toBe('task');
    });
  });
  
  describe('????', () => {
    it('isSpecKitNode ?????? spec-kit ??', () => {
      const specKitNode: SpecKitFlowNode = {
        id: 'node_1',
        type: 'user-story',
        meta: { position: { x: 0, y: 0 } },
        data: { specKitType: 'user-story' },
      };
      
      const regularNode: SpecKitFlowNode = {
        id: 'node_2',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {},
      };
      
      expect(recognizer.isSpecKitNode(specKitNode)).toBe(true);
      expect(recognizer.isSpecKitNode(regularNode)).toBe(false);
    });
    
    it('getRecognitionResult ??????????????', () => {
      const node: SpecKitFlowNode = {
        id: 'node_1',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: { title: '???? 1 - ???????P1?' },
      };
      
      const originalType = node.type;
      const result = recognizer.getRecognitionResult(node);
      
      expect(result.recognized).toBe(true);
      expect(result.type).toBe('user-story');
      expect(result.metadata?.storyNumber).toBe(1);
      
      // ????????
      expect(node.type).toBe(originalType);
      expect(node.data.specKitType).toBeUndefined();
    });
  });
  
  describe('????', () => {
    it('??????????', () => {
      const node: SpecKitFlowNode = {
        id: 'node_1',
        type: 'heading',
        meta: { position: { x: 0, y: 0 } },
        data: {},
      };
      
      const result = recognizer.recognize(node);
      
      expect(result).toBe(node);
      expect(result.type).toBe('heading');
    });
    
    it('??????????????', () => {
      const node: SpecKitFlowNode = {
        id: 'node_1',
        type: 'paragraph',
        meta: { position: { x: 0, y: 0 } },
        data: { title: '??????' },
      };
      
      const result = recognizer.recognize(node);
      
      expect(result.type).toBe('paragraph');
      expect(result.data.specKitType).toBeUndefined();
    });
  });
  
  describe('??????', () => {
    it('?????? 7 ???', () => {
      expect(SPEC_KIT_PATTERNS).toHaveLength(7);
      
      const types = SPEC_KIT_PATTERNS.map((p) => p.type);
      expect(types).toContain('user-story');
      expect(types).toContain('acceptance-scenario');
      expect(types).toContain('functional-requirement');
      expect(types).toContain('success-criteria');
      expect(types).toContain('boundary-case');
      expect(types).toContain('task');
      expect(types).toContain('priority-marker');
    });
  });
});
