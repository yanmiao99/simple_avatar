import { useState, useEffect } from 'react';
import { loadSvg } from '../utils/avatar-option';
import { SectionState } from '../components/Configure';

interface Widget {
  id: string;
  svgRaw: string;
}

const initialLoadCount = 6;

export function useWidgetLoader(
  widgetType: string,
  list: string[],
  sectionState: SectionState
) {
  const [allWidgets, setAllWidgets] = useState<Widget[]>([]); // 存储所有加载的 widgets
  const [displayedWidgets, setDisplayedWidgets] = useState<Widget[]>([]); // 当前显示的 widgets
  const [isLoading, setIsLoading] = useState(false);

  // 加载初始 widgets
  useEffect(() => {
    async function loadInitialWidgets() {
      setIsLoading(true);
      try {
        const initialList = list.slice(0, initialLoadCount);
        const loadedWidgets = await Promise.all(
          initialList.map(async (name) => {
            const svgRaw = await loadSvg(widgetType, name);
            return { id: name, svgRaw };
          })
        );
        setAllWidgets(loadedWidgets);
        setDisplayedWidgets(loadedWidgets);
      } catch (error) {
        console.error('Failed to load initial widgets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadInitialWidgets();
  }, [widgetType, initialLoadCount, list]);

  // 加载剩余 widgets
  useEffect(() => {
    async function loadRemainingWidgets() {
      if (!sectionState.expanded || allWidgets.length === list.length) return;

      setIsLoading(true);
      try {
        const remainingList = list.slice(initialLoadCount);
        const loadedWidgets = await Promise.all(
          remainingList.map(async (name) => {
            const svgRaw = await loadSvg(widgetType, name);
            return { id: name, svgRaw };
          })
        );
        setAllWidgets(prev => [...prev, ...loadedWidgets]);
      } catch (error) {
        console.error('Failed to load remaining widgets:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadRemainingWidgets();
  }, [sectionState.expanded, widgetType, list, allWidgets.length, initialLoadCount]);

  // 根据展开状态更新显示的 widgets
  useEffect(() => {
    if (sectionState.expanded) {
      setDisplayedWidgets(allWidgets);
    } else {
      setDisplayedWidgets(allWidgets.slice(0, initialLoadCount));
    }
  }, [sectionState.expanded, allWidgets, initialLoadCount]);

  return { 
    widgets: displayedWidgets, 
    isLoading,
    totalLoaded: allWidgets.length 
  };
}

