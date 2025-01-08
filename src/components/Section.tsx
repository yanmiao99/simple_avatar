import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useWidgetLoader } from '../hooks/useWidgetLoader';
import type { Section } from './Configure';
import { Transition } from '@headlessui/react';


interface SectionState {
  expanded?: boolean;
  loaded?: boolean;
}
const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1);

function scaleSvg(svgRaw: string, size: number = 60): string {
  // 提取原始 viewBox 值
  const viewBoxMatch = svgRaw.match(/viewBox="([^"]+)"/);
  if (!viewBoxMatch) return svgRaw;

  const [origX, origY, origWidth, origHeight] = viewBoxMatch[1].split(' ').map(Number);
  
  // 创建新的 SVG
  return svgRaw
    .replace(/<svg[^>]*>/, `<svg 
      width="${size}" 
      height="${size}" 
      viewBox="${origX} ${origY} ${origWidth} ${origHeight}"
      preserveAspectRatio="xMidYMid meet"
    >`)
    .replace(/width="[^"]*"/, '')
    .replace(/height="[^"]*"/, '');
}

export default function Section({ section, selectedFeatures, setSelectedFeatures }: { section: Section, selectedFeatures: { [key: string]: string }, setSelectedFeatures: (features: { [key: string]: string }) => void  }) {
  const [sectionState, setSectionState] = useState<SectionState>({});
  const { widgets, isLoading } = useWidgetLoader(
    section.widgetType,
    section.widgetList,
    sectionState
  );

  const toggleSection = async () => {
    setSectionState(prev => {
      const currentState = prev || { expanded: false, loaded: false };
      return {
        ...currentState,
        expanded: !currentState.expanded,
        loaded: true
      };
    });
  };

  return (
    <div key={section.widgetType} className="mb-8">
          <h2 className="text-lg font-medium mb-4">
            {capitalize(section.widgetType)}
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {widgets
              .map((widget) => (
                <Transition
                  key={widget.id}
                  show={true}
                  enter="transition-all duration-200 ease-out"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="transition-all duration-150 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <button
                    key={widget.id}
                    onClick={() => setSelectedFeatures(prev => ({
                      ...prev,
                      [section.widgetType]: widget.id
                    }))}
                    className={`
                      aspect-square p-2 rounded-lg border-2
                      hover:bg-gray-50 dark:hover:bg-gray-700
                      transition-colors
                      ${selectedFeatures[section.widgetType] === widget.id
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                        : 'border-gray-200 dark:border-gray-700'
                      }
                    `}
                >
                 {isLoading ? (
                    <div className="w-5 h-5 animate-pulse bg-gray-200 dark:bg-gray-700 rounded" />
                  ) : (
                    <div 
                      dangerouslySetInnerHTML={{ __html: scaleSvg(widget.svgRaw) }}
                    />
                  )}
                  </button>
                </Transition>
              ))
            }
          </div>

          <button
            onClick={() => toggleSection()}
            className="mt-2 p-1 w-full 
                      flex items-center justify-center
                      rounded-lg border-2 border-gray-200 hover:bg-gray-50
                      text-gray-500 hover:text-gray-700
                      transition-all duration-200 ease-in-out"
            aria-label={sectionState?.expanded ? 'Show less' : 'Show more'}
          >
            {sectionState?.expanded ? (
              <ChevronUp 
                size={16}
                className="transform transition-transform duration-200"
              />
            ) : (
              <ChevronDown 
                size={16}
                className="transform transition-transform duration-200"
              />
            )}
          </button>
        </div>
  )
}
