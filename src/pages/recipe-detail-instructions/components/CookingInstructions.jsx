import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const CookingInstructions = ({ instructions, videos }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [activeVideo, setActiveVideo] = useState(null);
  const [isPictureInPicture, setIsPictureInPicture] = useState(false);

  const toggleStep = (stepIndex) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted?.has(stepIndex)) {
      newCompleted?.delete(stepIndex);
    } else {
      newCompleted?.add(stepIndex);
    }
    setCompletedSteps(newCompleted);
  };

  const playVideo = (videoUrl) => {
    setActiveVideo(videoUrl);
  };

  const togglePictureInPicture = () => {
    setIsPictureInPicture(!isPictureInPicture);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Cooking Instructions
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">
            {completedSteps?.size} of {instructions?.length} completed
          </span>
          <div className="w-16 bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(completedSteps?.size / instructions?.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>
      {/* Video Player */}
      {activeVideo && (
        <div className={`mb-6 ${isPictureInPicture ? 'fixed bottom-4 right-4 w-64 h-36 z-50' : 'w-full h-64'} bg-black rounded-lg overflow-hidden`}>
          <div className="relative w-full h-full">
            <iframe
              src={activeVideo}
              title="Cooking demonstration"
              className="w-full h-full"
              allowFullScreen
            />
            <div className="absolute top-2 right-2 flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePictureInPicture}
                className="bg-black/50 text-white hover:bg-black/70 w-8 h-8"
              >
                <Icon name={isPictureInPicture ? "Maximize" : "Minimize"} size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveVideo(null)}
                className="bg-black/50 text-white hover:bg-black/70 w-8 h-8"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Instructions List */}
      <div className="space-y-6">
     {Array.isArray(instructions) && instructions.length > 0 ? (
  instructions.map((step, index) => (
          <div
            key={index}
            className={`flex space-x-4 p-4 rounded-lg border transition-all ${
              completedSteps?.has(index)
                ? 'bg-success/10 border-success/30' :'bg-background border-border hover:bg-muted/50'
            }`}
          >
            {/* Step Number & Checkbox */}
            <div className="flex flex-col items-center space-y-2 flex-shrink-0">
              <button
                onClick={() => toggleStep(index)}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-heading font-semibold text-sm transition-all ${
                  completedSteps?.has(index)
                    ? 'bg-success border-success text-white' :'border-primary text-primary hover:bg-primary hover:text-white'
                }`}
              >
                {completedSteps?.has(index) ? (
                  <Icon name="Check" size={14} />
                ) : (
                  index + 1
                )}
              </button>
              
              {/* Timer if available */}
              {step?.timer && (
                <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                  <Icon name="Clock" size={12} />
                  <span>{step?.timer}</span>
                </div>
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-3">
                <h3 className={`font-body font-medium ${
                  completedSteps?.has(index)
                    ? 'text-success' :'text-foreground'
                }`}>
                  Step {index + 1}
                </h3>
                
                {/* Video Button */}
                {step?.videoUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => playVideo(step?.videoUrl)}
                    iconName="Play"
                    iconPosition="left"
                    className="text-primary hover:text-primary-foreground hover:bg-primary"
                  >
                    Watch
                  </Button>
                )}
              </div>

              <p className={`text-sm font-body leading-relaxed mb-3 ${
                completedSteps?.has(index)
                  ? 'text-success/80' :'text-foreground'
              }`}>
                 {step?.instruction || step?.text}
              </p>

              {/* Step Image */}
              {step?.image && (
                <div className="w-full h-32 rounded-lg overflow-hidden bg-muted mb-3">
                  <Image
                    src={step?.image}
                    alt={`Step ${index + 1} demonstration`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Tips */}
              {step?.tip && (
                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <Icon name="Lightbulb" size={14} className="text-warning mt-0.5" />
                    <p className="text-sm text-warning-foreground">
                      <span className="font-medium">Tip:</span> {step?.tip}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
     ))
) : (
  <p className="text-muted-foreground">No instructions available.</p>
)}
      </div>
      {/* Completion Message */}
      {completedSteps?.size === instructions?.length && (
        <div className="mt-6 bg-success/10 border border-success/30 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center">
              <Icon name="CheckCircle" size={20} color="white" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-success">
                Congratulations!
              </h3>
              <p className="text-sm text-success/80">
                You've completed all cooking steps. Enjoy your delicious meal!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CookingInstructions;