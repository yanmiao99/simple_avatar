import { useEffect, useState } from 'react';
import { SETTINGS } from '../utils/constant';
import Section from './Section';
import { loadSvg } from '../utils/avatar-option';

export type WidgetType =
  | 'face'
  | 'head'
  | 'body'
  | 'facialHair'
  | 'accessories';

export interface Widget {
  id: string;
  svgRaw: string;
}

export interface Section {
  widgetType: WidgetType;
  widgets: Widget[];
  widgetList: string[];
}

export interface SectionState {
  expanded?: boolean;
  loaded?: boolean;
}

export type SectionStates = {
  [key in WidgetType]?: SectionState;
};

interface ConfigureProps {
  selectedFeatures: { [key: string]: string };
  setSelectedFeatures: (features: { [key: string]: string }) => void;
}

const sectionList: WidgetType[] = ['face', 'head', 'body', 'accessories'];

export default function Configure({
  selectedFeatures,
  setSelectedFeatures,
}: ConfigureProps) {
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initSections() {
      setIsLoading(true);
      try {
        const sectionsData = await Promise.all(
          sectionList.map(async (type) => {
            const list = SETTINGS[type] || [];
            const initialWidgets = await Promise.all(
              list.slice(0, 3).map(async (name) => ({
                id: name,
                svgRaw: await loadSvg(type, name),
              }))
            );

            return {
              widgetType: type,
              widgets: initialWidgets,
              widgetList: list,
            };
          })
        );

        setSections(sectionsData);
      } catch (error) {
        console.error('Failed to initialize sections:', error);
      } finally {
        setIsLoading(false);
      }
    }

    initSections();
  }, []);

  return (
    <div className="h-full p-6 overflow-y-auto bg-white text-gray-700 w-80">
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 border-2 border-gray-300 border-t-gray-600
                          rounded-full animate-spin"
            />
            <span className="text-sm text-gray-500">Loading widgets...</span>
          </div>
        </div>
      ) : (
        sections.map((section) => (
          <Section
            key={section.widgetType}
            section={section}
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
          />
        ))
      )}
    </div>
  );
}
