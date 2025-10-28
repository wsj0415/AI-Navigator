import React, { useState, useEffect, useLayoutEffect } from 'react';

type OnboardingStep = {
  targetId: string;
  title: string;
  content: string;
  position?: 'bottom' | 'top' | 'left' | 'right';
};

const steps: OnboardingStep[] = [
  {
    targetId: 'nav-add-new',
    title: 'Welcome to AI Nexus!',
    content: 'This is your intelligent knowledge base. Click here to add your first resource.',
    position: 'bottom',
  },
  {
    targetId: 'nav-search',
    title: 'Powerful Search',
    content: 'Quickly find any resource. You can search by title, description, URL, and even the content of your attached text files.',
    position: 'bottom',
  },
  {
    targetId: 'filter-panel',
    title: 'Advanced Filtering',
    content: 'Refine your view with multi-select filters for categories, priorities, and statuses to find exactly what you need.',
    position: 'right',
  },
    {
    targetId: 'nav-main-tabs',
    title: 'Switch Pages',
    content: 'Navigate between your Dashboard for insights, this Resources view, and the Settings page to customize your app.',
    position: 'bottom',
  },
];

interface OnboardingGuideProps {
  onComplete: () => void;
}

const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const step = steps[currentStep];

  useLayoutEffect(() => {
    const updatePosition = () => {
      const targetElement = document.getElementById(step.targetId);
      if (targetElement) {
        setTargetRect(targetElement.getBoundingClientRect());
      } else {
        // If element not found, maybe skip or wait? For now, we'll just not show the tooltip.
        setTargetRect(null);
      }
    };
    
    // Give a small delay for elements to render
    const timer = setTimeout(updatePosition, 100);
    window.addEventListener('resize', updatePosition);
    
    return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', updatePosition);
    };
  }, [currentStep, step.targetId]);


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const getTooltipPosition = () => {
    if (!targetRect) return { top: '-9999px', left: '-9999px' }; // Hide if no target
    const offset = 12; // 12px gap
    switch(step.position) {
        case 'top':
            return { top: targetRect.top - offset, left: targetRect.left + targetRect.width / 2, transform: 'translate(-50%, -100%)' };
        case 'left':
            return { top: targetRect.top + targetRect.height / 2, left: targetRect.left - offset, transform: 'translate(-100%, -50%)' };
        case 'right':
            return { top: targetRect.top + targetRect.height / 2, left: targetRect.right + offset, transform: 'translate(0, -50%)' };
        default: // bottom
            return { top: targetRect.bottom + offset, left: targetRect.left + targetRect.width / 2, transform: 'translate(-50%, 0)' };
    }
  };
  
  const tooltipStyle = getTooltipPosition();

  return (
    <div className="fixed inset-0 z-[100]">
       <div 
        className="fixed inset-0 transition-all duration-300 ease-out"
        style={{
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            clipPath: targetRect ? `path(evenodd, "M0 0 H ${window.innerWidth} V ${window.innerHeight} H 0 Z M ${targetRect.x - 4} ${targetRect.y - 4} H ${targetRect.x + targetRect.width + 4} V ${targetRect.y + targetRect.height + 4} H ${targetRect.x - 4} Z")` : 'path("M0 0 H 0 V 0 H 0 Z")',
        }}
       ></div>
      
      {targetRect && (
        <div 
            className="absolute bg-white dark:bg-gray-800 rounded-lg p-4 shadow-2xl w-72 border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-out"
            style={{ ...tooltipStyle }}
        >
          <h3 className="font-bold text-lg mb-2 text-gray-900 dark:text-white">{step.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">{step.content}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xs text-gray-400 dark:text-gray-500">{currentStep + 1} / {steps.length}</span>
            <div>
              <button onClick={handleSkip} className="text-sm text-gray-500 dark:text-gray-400 hover:underline mr-3">Skip</button>
              <button onClick={handleNext} className="bg-primary hover:bg-primary-hover text-white font-semibold py-1 px-3 rounded-md text-sm transition">
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OnboardingGuide;
