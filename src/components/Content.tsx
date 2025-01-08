import { useEffect, useState } from 'react';
import { RefreshCw, Download, Star } from 'lucide-react';
import AvatarCanvas from './AvatarCanvas';
import { getRandomAvatarOption } from '../utils/avatar-option';
import { Switch } from './Switch';

interface ContentProps {
  selectedFeatures: { [key: string]: string };
}

export default function Content({ selectedFeatures }: ContentProps) {
  const [features, setFeatures] = useState<any>(null);
  const [refreshKey, setRefreshKey] = useState(1);
  const [isAnimated, setIsAnimated] = useState(true);

  // 生成头像的核心逻辑
  const generateAvatar = (
    useSelected: boolean = true,
    prevFeatures: any = null
  ) => {
    // 完全随机生成
    if (!useSelected) {
      return getRandomAvatarOption();
    }

    // 如果是首次生成且没有选择特征
    if (!prevFeatures && Object.keys(selectedFeatures).length === 0) {
      return getRandomAvatarOption();
    }

    // 使用之前的特征作为基础，仅更新选择的部分
    const baseFeatures = prevFeatures || getRandomAvatarOption();

    return {
      ...baseFeatures,
      ...Object.entries(selectedFeatures).reduce(
        (acc, [type, shape]) => ({
          ...acc,
          [type]: {
            ...baseFeatures[type], // 保留其他属性
            shape, // 只更新 shape
          },
        }),
        {}
      ),
    };
  };

  // 初始化
  useEffect(() => {
    const initialFeatures = generateAvatar(true);
    setFeatures(initialFeatures);
  }, []);

  // 当 selectedFeatures 改变时更新
  useEffect(() => {
    if (features) {
      const newFeatures = generateAvatar(true, features);
      setFeatures(newFeatures);
    }
  }, [selectedFeatures]);

  // 重新生成头像（使用随机选项）
  const regenerateAvatar = () => {
    const newFeatures = generateAvatar(false); // 强制使用随机
    setFeatures(newFeatures);
  };

  // 刷新动画
  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 下载头像
  const downloadAvatar = () => {
    const svg = document.querySelector('#avatar-svg');
    if (!svg) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svg);
    const blob = new Blob([svgStr], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = 'my-avatar.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 生成按钮文本
  const generateButtonText =
    Object.keys(selectedFeatures).length > 0 ? '随机化' : '生成头像';

  return (
    <div className="max-w-md mx-auto pt-10">
      {/* <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">极简动态头像</h1>
        <p className="text-gray-600">极简主义动画线条艺术头像生成器</p>
      </div> */}

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h1 className="text-1xl font-bold text-gray-800 ">极简动态头像</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">动画</span>
            <Switch
              checked={isAnimated}
              onChange={setIsAnimated}
              className="relative inline-flex h-5 w-9"
            />
          </div>
        </div>

        <div className="aspect-square w-full mb-6 bg-gray-50 rounded-xl p-4 flex items-center justify-center">
          <AvatarCanvas
            features={features}
            key={refreshKey}
            isAnimated={isAnimated}
          />
        </div>

        <div className="flex justify-center items-center gap-3">
          <button
            onClick={regenerateAvatar}
            className="group flex items-center gap-2.5 px-4 py-2
                      bg-gradient-to-r from-indigo-500 to-purple-500
                      text-white rounded-full shadow-sm
                      hover:shadow-md hover:from-indigo-600 hover:to-purple-600
                      transition-all duration-200 ease-in-out">
            <Star
              size={16}
              className="group-hover:scale-110 transition-transform duration-300"
            />
            <span className="font-medium text-sm">{generateButtonText}</span>
          </button>

          <div className="h-6 w-px bg-gray-200 dark:bg-gray-700" />

          <div className="flex items-center gap-2">
            <button
              onClick={handleRefresh}
              className="group flex items-center gap-2 px-3 py-2
                          bg-white text-gray-600 rounded-full
                          border border-gray-200
                          hover:bg-gray-50 hover:border-gray-300
                          transition-all duration-200 ease-in-out
                          disabled:opacity-60 disabled:cursor-not-allowed
                          dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700
                          dark:hover:bg-gray-750">
              <RefreshCw
                size={16}
                className="group-hover:rotate-180 transition-transform duration-500"
              />
              <span className="font-medium text-sm">重新生成</span>
            </button>

            <button
              onClick={downloadAvatar}
              className="group flex items-center gap-2 px-3 py-2
                          bg-gray-900 text-white rounded-full
                          shadow-sm hover:shadow-md hover:bg-black
                          transition-all duration-200 ease-in-out
                          dark:bg-white dark:text-gray-800 dark:hover:bg-gray-100">
              <Download
                size={16}
                className="group-hover:translate-y-0.5 transition-transform duration-200"
              />
              <span className="font-medium text-sm">下载SVG</span>
            </button>
          </div>
        </div>
      </div>

      {/* <div className="text-center text-sm text-gray-500">
        {Object.keys(selectedFeatures).length > 0
          ? '单击随机化以忽略选择并生成随机化身。'
          : '点击生成新头像，下载svg文件。'}
      </div> */}
    </div>
  );
}
