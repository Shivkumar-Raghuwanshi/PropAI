import { useState, useEffect } from 'react';
import { Steps } from 'intro.js-react';
import 'intro.js/introjs.css';
import { AccommodationType } from '@/types';

interface TutorialGuideProps {
  accommodationType: AccommodationType;
  setAccommodationType: (type: AccommodationType) => void;
}

const steps = [
  {
    element: '.chat-area',
    intro: 'Welcome to your accommodation finder! This is the chat area where you will see your conversation with our AI assistant.',
    position: 'right',
  },
  {
    element: '.tabs-area',
    intro: 'You can switch between different accommodation types here. Lets try each one!',
    position: 'bottom',
  },
  {
    element: '[data-type="home"]',
    intro: 'Looking for a home? Our HomeAdvisor can help you find the perfect house.',
    position: 'bottom',
  },
  {
    element: '[data-type="flat"]',
    intro: 'Need a flat? FlatFinder is here to assist you in finding the ideal apartment.',
    position: 'bottom',
  },
  {
    element: '[data-type="pg"]',
    intro: 'Searching for a PG? PGPal will guide you to comfortable paying guest accommodations.',
    position: 'bottom',
  },
  {
    element: '[data-type="hostel"]',
    intro: 'Want a hostel? HostelHelper can recommend the best hostel options for you.',
    position: 'bottom',
  },
  {
    element: '.input-area',
    intro: 'Type your questions or requirements here. Be specific to get the best recommendations!',
    position: 'top',
  },
  {
    element: '.send-button',
    intro: 'Hit this button to send your message and get instant responses from our AI assistant.',
    position: 'left',
  },
  {
    element: '.chat-area',
    intro: 'Great! Now you are all set to start your accommodation search. Happy exploring!',
    position: 'right',
  },
];

export function TutorialGuide({ accommodationType, setAccommodationType }: TutorialGuideProps) {
  const [stepsEnabled, setStepsEnabled] = useState(false);
  const [initialStep, setInitialStep] = useState(0);

  useEffect(() => {
    const hasSeenTutorial = localStorage.getItem('hasSeenTutorial');
    if (!hasSeenTutorial) {
      setStepsEnabled(true);
      localStorage.setItem('hasSeenTutorial', 'true');
    }
  }, []);

  const onExit = () => {
    setStepsEnabled(false);
  };

  const onChange = (nextStepIndex: number) => {
    if (nextStepIndex >= 2 && nextStepIndex <= 5) {
      const newType = ['home', 'flat', 'pg', 'hostel'][nextStepIndex - 2] as AccommodationType;
      setAccommodationType(newType);
    }
  };

  return (
    <>
      <button 
        onClick={() => {setStepsEnabled(true); setInitialStep(0);}}
        className="fixed bottom-4 right-4 bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition-colors duration-200 z-50 hidden sm:block"
      >
        Start Tutorial
      </button>
      <Steps
        enabled={stepsEnabled}
        steps={steps}
        initialStep={initialStep}
        onExit={onExit}
        onChange={onChange}
        options={{ 
          dontShowAgain: false,
          exitOnEsc: true,
          exitOnOverlayClick: false,
          showStepNumbers: true,
          showBullets: false,
          showProgress: true,
          nextLabel: 'Next →',
          prevLabel: '← Back',
          skipLabel: 'Skip',
          doneLabel: 'Finish',
          tooltipClass: 'customTooltip',
          highlightClass: 'customHighlight',
          buttonClass: 'customButton',
          overlayOpacity: 0.7,
          scrollToElement: true,
          scrollPadding: 50,
        }}
      />
    </>
  );
}