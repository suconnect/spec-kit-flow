/**
 * SpecKit ?????
 */

import { SpecKitRecognizer } from '../SpecKitRecognizer'
import type { SpecKitFlowNode } from '../../types/speckit'

describe('SpecKitRecognizer', () => {
  let recognizer: SpecKitRecognizer

  beforeEach(() => {
    recognizer = new SpecKitRecognizer()
  })

  describe('??????', () => {
    test('???????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-1',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '???? 1 - Markdown ????????????P1?',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('user-story')
      expect(recognized.data.storyNumber).toBe(1)
      expect(recognized.data.title).toBe('Markdown ???????')
      expect(recognized.data.priority).toBe('P1')
      expect(recognized.data.icon).toBe('??')
    })

    test('????????????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-2',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '???? 2 - ?????',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('user-story')
      expect(recognized.data.storyNumber).toBe(2)
      expect(recognized.data.title).toBe('?????')
      expect(recognized.data.priority).toBeUndefined()
    })
  })

  describe('???????', () => {
    test('???????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-3',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '- **FR-001**: ?????? Markdown ??',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('functional-requirement')
      expect(recognized.data.requirementId).toBe('FR-001')
      expect(recognized.data.requirementType).toBe('functional')
    })
  })

  describe('??????', () => {
    test('??????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-4',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '- **SC-001**: ?????? 100ms',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('success-criteria')
      expect(recognized.data.criteriaId).toBe('SC-001')
      expect(recognized.data.criteriaType).toBe('success')
    })
  })

  describe('??????', () => {
    test('??????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-5',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '????',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('acceptance-scenario')
      expect(recognized.data.isAcceptanceSection).toBe(true)
    })
  })

  describe('??????', () => {
    test('???????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-6',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '- [ ] ?? Markdown ???',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('task')
      expect(recognized.data.taskDescription).toBe('?? Markdown ???')
      expect(recognized.data.completed).toBe(false)
      expect(recognized.data.isTask).toBe(true)
    })

    test('???????', () => {
      const node: SpecKitFlowNode = {
        id: 'test-7',
        type: 'heading',
        position: { x: 0, y: 0 },
        data: {
          label: '- [x] ????',
          content: '',
          preview: ''
        }
      }

      const recognized = recognizer.recognize(node)

      expect(recognized.type).toBe('task')
      expect(recognized.data.completed).toBe(true)
    })
  })

  describe('????', () => {
    test('recognizeAll ??????', () => {
      const nodes: SpecKitFlowNode[] = [
        {
          id: '1',
          type: 'heading',
          position: { x: 0, y: 0 },
          data: {
            label: '???? 1 - ???????P1?',
            content: '',
            preview: ''
          }
        },
        {
          id: '2',
          type: 'heading',
          position: { x: 0, y: 0 },
          data: {
            label: '????',
            content: '',
            preview: ''
          }
        },
        {
          id: '3',
          type: 'heading',
          position: { x: 0, y: 0 },
          data: {
            label: '- [ ] ?? 1',
            content: '',
            preview: ''
          }
        }
      ]

      const recognized = recognizer.recognizeAll(nodes)

      expect(recognized[0].type).toBe('user-story')
      expect(recognized[1].type).toBe('acceptance-scenario')
      expect(recognized[2].type).toBe('task')
    })
  })

  describe('????', () => {
    test('getUserStories ??????', () => {
      const nodes: SpecKitFlowNode[] = [
        {
          id: '1',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: 'Story 1', content: '', preview: '' }
        },
        {
          id: '2',
          type: 'heading',
          position: { x: 0, y: 0 },
          data: { label: 'Heading', content: '', preview: '' }
        },
        {
          id: '3',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: 'Story 2', content: '', preview: '' }
        }
      ]

      const stories = recognizer.getUserStories(nodes)

      expect(stories).toHaveLength(2)
      expect(stories.every(n => n.type === 'user-story')).toBe(true)
    })

    test('filterByPriority ??????', () => {
      const nodes: SpecKitFlowNode[] = [
        {
          id: '1',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: 'S1', content: '', preview: '', priority: 'P1' }
        },
        {
          id: '2',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: 'S2', content: '', preview: '', priority: 'P2' }
        },
        {
          id: '3',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: 'S3', content: '', preview: '', priority: 'P1' }
        }
      ]

      const p1Nodes = recognizer.filterByPriority(nodes, 'P1')

      expect(p1Nodes).toHaveLength(2)
      expect(p1Nodes.every(n => n.data.priority === 'P1')).toBe(true)
    })

    test('getStatistics ??????', () => {
      const nodes: SpecKitFlowNode[] = [
        {
          id: '1',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: '', content: '', preview: '', priority: 'P1' }
        },
        {
          id: '2',
          type: 'user-story',
          position: { x: 0, y: 0 },
          data: { label: '', content: '', preview: '', priority: 'P1' }
        },
        {
          id: '3',
          type: 'task',
          position: { x: 0, y: 0 },
          data: { label: '', content: '', preview: '', priority: 'P2' }
        }
      ]

      const stats = recognizer.getStatistics(nodes)

      expect(stats.total).toBe(3)
      expect(stats.byType['user-story']).toBe(2)
      expect(stats.byType['task']).toBe(1)
      expect(stats.byPriority['P1']).toBe(2)
      expect(stats.byPriority['P2']).toBe(1)
    })
  })
})
