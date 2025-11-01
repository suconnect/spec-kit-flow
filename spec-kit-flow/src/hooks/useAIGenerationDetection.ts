import { useState, useCallback, useEffect } from 'react';
import { FileChangeEvent } from '../services/fileSystem';

interface FileChangeHistory {
  timestamps: number[];
}

const FILE_CHANGE_HISTORY = new Map<string, FileChangeHistory>();
const AI_DETECTION_THRESHOLD = 3; // 3 ???? 3 ????? AI ??
const DETECTION_WINDOW = 3000; // 3 ?????

export function useAIGenerationDetection() {
  const [aiGeneratingPaths, setAIGeneratingPaths] = useState<Set<string>>(new Set());

  // ????????? AI ??
  const detectAIGeneration = useCallback((event: FileChangeEvent) => {
    const { path, timestamp } = event;
    const now = timestamp;

    // ??????????
    let history = FILE_CHANGE_HISTORY.get(path);
    if (!history) {
      history = { timestamps: [] };
      FILE_CHANGE_HISTORY.set(path, history);
    }

    // ???????
    history.timestamps.push(now);

    // ???? 3 ????
    history.timestamps = history.timestamps.filter(t => now - t < DETECTION_WINDOW);

    // ????? AI ???3 ?? > 3 ????
    const isAIGenerating = history.timestamps.length > AI_DETECTION_THRESHOLD;

    if (isAIGenerating) {
      // ??? AI ???
      setAIGeneratingPaths(prev => new Set(prev).add(path));
    } else if (history.timestamps.length === 0) {
      // ?????????
      setAIGeneratingPaths(prev => {
        const newSet = new Set(prev);
        newSet.delete(path);
        return newSet;
      });
    }

    // 3 ??????????????
    setTimeout(() => {
      const currentHistory = FILE_CHANGE_HISTORY.get(path);
      if (currentHistory) {
        const cleanedTimestamps = currentHistory.timestamps.filter(
          t => Date.now() - t < DETECTION_WINDOW
        );
        if (cleanedTimestamps.length === 0) {
          FILE_CHANGE_HISTORY.delete(path);
        } else {
          currentHistory.timestamps = cleanedTimestamps;
        }
      }
    }, DETECTION_WINDOW);

    return isAIGenerating;
  }, []);

  // ????????? AI ??
  const isAIGenerating = useCallback((path: string) => {
    return aiGeneratingPaths.has(path);
  }, [aiGeneratingPaths]);

  // ???? AI ??????????
  const setAIGenerating = useCallback((path: string, generating: boolean) => {
    setAIGeneratingPaths(prev => {
      const newSet = new Set(prev);
      if (generating) {
        newSet.add(path);
      } else {
        newSet.delete(path);
      }
      return newSet;
    });
  }, []);

  return {
    aiGeneratingPaths,
    detectAIGeneration,
    isAIGenerating,
    setAIGenerating,
  };
}
