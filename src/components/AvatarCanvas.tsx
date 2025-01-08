import { useEffect, useState } from 'react';

interface AvatarCanvasProps {
  features: {
    accessories: {
      shape: string;
    };
    body: {
      shape: string;
    };
    face: {
      shape: string;
    };
    facialHair: {
      shape: string;
    };
    head: {
      shape: string;
    };
    eyes: {
      shape: string;
    };
  };
  key?: number;
  isAnimated?: boolean;
}

const importSVG = (type: string, name: string) =>
  import(`../assets/widgets/${type}/${name}.svg?raw`).then(
    (module) => module.default
  );

export default function AvatarCanvas({
  features,
  key = 0,
  isAnimated = true,
}: AvatarCanvasProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [paths, setPaths] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 加载 SVG 路径
  useEffect(() => {
    (async () => {
      if (!features) return;
      setIsLoading(true);
      const { body, head, face, accessories } = features;
      try {
        const bodyPath = await importSVG('body', body.shape);
        const headPath = await importSVG('head', head.shape);
        const facePath = await importSVG('face', face.shape);
        const accessoriesPath = await importSVG(
          'accessories',
          accessories.shape
        );

        setPaths([bodyPath, headPath, facePath, accessoriesPath]);
      } catch (error) {
        console.error('Error loading SVG:', error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [features, key]);

  // 更新 SVG 内容
  useEffect(() => {
    if (paths.length === 0) return;

    const processedPaths = paths.map((svgRaw, index) => {
      const content = svgRaw
        .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
        .replace('</svg>', '');

      if (index === 0) return `<g transform="translate(0, 550)">${content}</g>`;
      if (index === 1)
        return `<g transform="translate(200, 50)">${content}</g>`;

      if (index === 2)
        return `<g transform="translate(320, 250)"><g>${content}</g></g>`;

      if (index === 3)
        return `<g transform="translate(210, 310)"><g>${content}</g></g>`;

      return `<g transform="translate(320, 250)"><g>${content}</g></g>`;
    });

    const svgContent = `
      <svg
        id="avatar-svg"
        transform="translate(-25, 0)"
        width="300"
        height="300"
        class="${isAnimated ? 'path1' : ''}"
        viewBox="0 0 700 700"
        fill="none"
        stroke="black"
        strokeWidth="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>
          @media (prefers-reduced-motion){.path1{animation:none!important;stroke-dasharray:unset!important}}@media print{.path1{animation:none!important;stroke-dasharray:unset!important}}@keyframes grow{0%{stroke-dashoffset:1px;stroke-dasharray:0 1000px;opacity:0;fill-opacity:0}10%{opacity:1;fill-opacity:0}60%{stroke-dasharray:1000px 0;fill-opacity:1;stroke-opacity:0}to{stroke-dasharray:1000px 0;fill-opacity:1;stroke-opacity:0}}.path1 g g path{stroke-dashoffset:1px;stroke-dasharray:1000px 0;animation:grow 7s linear forwards;transform-origin:center;stroke:#a2a0a0;stroke-width:10px;animation-delay:0s}
        </style>
        <g>
          <g>
            ${processedPaths.join('')}
          </g>
        </g>
      </svg>
    `;

    setSvgContent(svgContent);
  }, [paths, key, isAnimated]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="relative">
          {/* 主圆环 */}
          <div className="w-10 h-10 border-4 border-gray-200 rounded-full"></div>
          {/* 加载动画圆环 */}
          <div
            className="absolute top-0 left-0 w-10 h-10 border-4 border-indigo-500 rounded-full
                          border-t-transparent animate-spin"></div>

          {/* 可选：添加加载文字 */}
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-sm text-gray-500">
            Loading...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: svgContent }}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
