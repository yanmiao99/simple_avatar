import { useState } from 'react';
import Content from './components/Content';
import Footer from './components/Footer';
import Configure from './components/Configure';

function App() {
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedFeatures, setSelectedFeatures] = useState({});

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-indigo-50 ">
      <div className="flex">
        <Content selectedFeatures={selectedFeatures} />

        {/* Configure Panel */}
        <div
          className={`
          fixed top-0 right-0 h-full w-80 bg-white/80 backdrop-blur-xl
          shadow-lg transform transition-transform duration-300 ease-in-out
          dark:bg-gray-800/90 dark:text-gray-100 z-10
          ${isConfigOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
          <Configure
            selectedFeatures={selectedFeatures}
            setSelectedFeatures={setSelectedFeatures}
          />

          {/* Toggle Button */}
          <button
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className={`
              absolute top-1/2 -left-20 p-3
              bg-white dark:bg-gray-800
              rounded-l-xl shadow-lg
              transform -translate-y-1/2
              hover:bg-gray-50
              transition-colors
              flex items-center
            `}>
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${
                isConfigOpen ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
            {isConfigOpen ? '隐藏' : '展开'}
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
