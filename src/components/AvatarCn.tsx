// import { useEffect, useState, useRef } from 'react';

// interface AvatarCanvasProps {
//   features: {
//     accessories: {
//       shape: string
//     },
//     body: {
//       shape: string
//     },
//     face: {
//       shape: string
//     },
//     hair: {
//       shape: string
//     },
//   }
// }
// const importSVG = (type: string, name: string) => import(`../assets/widgets/${type}/${name}.svg?raw`).then(module => module.default);

// export default function AvatarCanvas({ features }: AvatarCanvasProps) {
//   const [svgContent, setSvgContent] = useState<string>('');
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [paths, setPaths] = useState<string[]>([]);
//   const svgRef = useRef<SVGSVGElement>(null);

//   // 加载 SVG 路径
//   useEffect(() => {
//     (async () => {
//       if (!features) return;
//       const { body, head, eyes } = features;
//       try {
//         const bodyPath = await importSVG('body', body.shape);
//         const headPath = await importSVG('head', head.shape);
//         const eyesPath = await importSVG('eyes', eyes.shape);
//         const mouthPath = await importSVG('mouth', eyes.shape);
//         const nosePath = await importSVG('nose', eyes.shape);
//         const eyebrowsPath = await importSVG('eyebrows', eyes.shape);

//         setPaths([bodyPath, headPath, eyesPath, mouthPath, nosePath, eyebrowsPath]);
//       } catch (error) {
//         console.error('Error loading SVG:', error);
//       }
//     })();
//   }, [features]);

//   // 监听鼠标移动
//   useEffect(() => {
//     const handleMouseMove = (e: MouseEvent) => {
//       const rect = svgRef.current?.getBoundingClientRect();
//       if (rect) {
//         // 计算相对位置
//         const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
//         const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20;
        
//         // 限制最大移动距离
//         const MAX_DISTANCE = 15;
//         const clampedX = Math.max(-MAX_DISTANCE, Math.min(MAX_DISTANCE, x));
//         const clampedY = Math.max(-MAX_DISTANCE, Math.min(MAX_DISTANCE, y));
        
//         setMousePosition({ x: clampedX, y: clampedY });
//       }
//     };

//     window.addEventListener('mousemove', handleMouseMove);
//     return () => window.removeEventListener('mousemove', handleMouseMove);
//   }, []);

//   // 更新 SVG 内容
//   useEffect(() => {
//     if (paths.length === 0) return;

//     const processedPaths = paths.map((svgRaw, index) => {
//       const content = svgRaw
//         .slice(svgRaw.indexOf('>', svgRaw.indexOf('<svg')) + 1)
//         .replace('</svg>', '');

//       if (index === 0) return `<g transform="translate(0, 550)">${content}</g>`;
//       if (index === 1) {
//         return `
//           <g transform="translate(200, 50)">
//             <g transform-origin="200 500">
//               ${content}
//               <animateTransform
//                 attributeName="transform"
//                 type="rotate"
//                 dur="1s"
//                 values="${mousePosition.x * 0.05}"
//                 repeatCount="1"
//                 additive="sum"
//               />
//             </g>
//           </g>
//         `;
//       }
//       if (index === 2) {
//         return `
//           <g transform="translate(320, 250)">
//             <g>
//               ${content}
//               <animateTransform
//                 attributeName="transform"
//                 type="translate"
//                 dur="1s"
//                 values="${mousePosition.x},${mousePosition.y}"
//                 repeatCount="1"
//               />
//             </g>
//           </g>
//         `;
//       }

//       if (index === 3) {
//         return `
//           <g transform="translate(320, 250)">
//             <g>
//               ${content}
//               <animateTransform
//                 id="mouthAnimation"
//                 attributeName="transform"
//                 type="translate"
//                 dur="2s"
//                 values="0,0; 0,-4; 0,0"
//                 repeatCount="indefinite"
//                 calcMode="spline"
//                 keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
//                 additive="sum"
//                 begin="0s"
//               />
//             </g>
//           </g>
//         `;
//       }

//       if (index === 5 || index === 4) {
//         return `
//           <g transform="translate(320, 250)">
//             <g>
//               ${content}
//               <animateTransform
//                 attributeName="transform"
//                 type="translate"
//                 dur="1s"
//                 values="${mousePosition.x / 5},${mousePosition.y / 5}"
//                 repeatCount="1"
//               />
//             </g>
//           </g>
//         `;
//       }

//       return `<g transform="translate(320, 250)"><g>${content}</g></g>`;
//     });

//     const avatarSize = 380;
//     const svgContent = `
//       <svg
//         id="avatar-svg"
//         transform="translate(-30, 0)"
//         width="${avatarSize}"
//         height="${avatarSize}"
//         viewBox="0 0 ${avatarSize / 0.5} ${avatarSize / 0.5}"
//         fill="none"
//         stroke="black"
//         strokeWidth="0.8"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//         xmlns="http://www.w3.org/2000/svg"
//       >
//         <g>
//           <g>
//             ${processedPaths.join('')}
//           </g>
//         </g>
//       </svg>
//     `;

//     setSvgContent(svgContent);
//   }, [paths, mousePosition]);

//   return (
//     <div 
//       dangerouslySetInnerHTML={{ __html: svgContent }} 
//       ref={svgRef}
//       style={{ width: '100%', height: '100%' }}
//     />
//   );
// }
