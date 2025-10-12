import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const InstructionsStep = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [currentInstruction, setCurrentInstruction] = useState({
    step: '',
    description: '',
    image: null,
    tips: ''
  });
  
  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(formData?.videoDemo || null);

  const instructions = formData?.instructions || [];

  const addInstruction = () => {
    if (currentInstruction?.step && currentInstruction?.description) {
      const newInstructions = [...instructions, { 
        ...currentInstruction, 
        id: Date.now(),
        stepNumber: instructions?.length + 1
      }];
      updateFormData({ instructions: newInstructions });
      setCurrentInstruction({ step: '', description: '', image: null, tips: '' });
    }
  };

  const removeInstruction = (id) => {
    const updatedInstructions = instructions?.filter(instruction => instruction?.id !== id)?.map((instruction, index) => ({ ...instruction, stepNumber: index + 1 }));
    updateFormData({ instructions: updatedInstructions });
  };

  const editInstruction = (id) => {
    const instruction = instructions?.find(inst => inst?.id === id);
    if (instruction) {
      setCurrentInstruction(instruction);
      removeInstruction(id);
    }
  };

  const handleImageUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCurrentInstruction({ ...currentInstruction, image: e?.target?.result });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleVideoUpload = (file) => {
    if (file && file?.type?.startsWith('video/')) {
      setVideoFile(file);
      const videoUrl = URL.createObjectURL(file);
      setVideoPreview(videoUrl);
      updateFormData({ videoDemo: videoUrl });
    }
  };

  const isFormValid = () => {
    return instructions?.length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
          Cooking Instructions
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-foreground">
              Add Instruction Step
            </h3>
            
            <Input
              label="Step Title"
              type="text"
              placeholder="e.g., Prepare the base"
              value={currentInstruction?.step}
              onChange={(e) => setCurrentInstruction({ ...currentInstruction, step: e?.target?.value })}
              required
            />
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Detailed Description *
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                placeholder="Describe the step in detail..."
                value={currentInstruction?.description}
                onChange={(e) => setCurrentInstruction({ ...currentInstruction, description: e?.target?.value })}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Step Image (Optional)
              </label>
              <div className="border-2 border-dashed border-border rounded-lg p-4">
                {currentInstruction?.image ? (
                  <div className="relative">
                    <Image
                      src={currentInstruction?.image}
                      alt="Step preview"
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => setCurrentInstruction({ ...currentInstruction, image: null })}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="Camera" size={32} className="mx-auto mb-2 text-muted-foreground" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById('step-image-input')?.click()}
                    >
                      Add Image
                    </Button>
                  </div>
                )}
              </div>
              <input
                id="step-image-input"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload(e?.target?.files?.[0])}
              />
            </div>
            
            <Input
              label="Tips (Optional)"
              type="text"
              placeholder="Any helpful tips for this step"
              value={currentInstruction?.tips}
              onChange={(e) => setCurrentInstruction({ ...currentInstruction, tips: e?.target?.value })}
            />
            
            <Button
              variant="outline"
              onClick={addInstruction}
              disabled={!currentInstruction?.step || !currentInstruction?.description}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Add Step
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-foreground">
              Instructions List ({instructions?.length} steps)
            </h3>
            
            {instructions?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="List" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm font-body">No instructions added yet</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {instructions?.map((instruction) => (
                  <div
                    key={instruction?.id}
                    className="p-4 bg-muted rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                          Step {instruction?.stepNumber}
                        </span>
                        <span className="font-body font-medium text-foreground">
                          {instruction?.step}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => editInstruction(instruction?.id)}
                        >
                          <Icon name="Edit2" size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeInstruction(instruction?.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {instruction?.description}
                    </p>
                    
                    {instruction?.image && (
                      <Image
                        src={instruction?.image}
                        alt={`Step ${instruction?.stepNumber}`}
                        className="w-full h-24 object-cover rounded mt-2"
                      />
                    )}
                    
                    {instruction?.tips && (
                      <div className="mt-2 p-2 bg-warning/10 rounded text-xs text-warning-foreground">
                        <Icon name="Lightbulb" size={12} className="inline mr-1" />
                        {instruction?.tips}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-heading font-medium text-foreground mb-4">
            Video Demonstration (Optional)
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="border-2 border-dashed border-border rounded-lg p-6">
                {videoPreview ? (
                  <div className="relative">
                    <video
                      src={videoPreview}
                      controls
                      className="w-full h-48 rounded-lg"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setVideoPreview(null);
                        setVideoFile(null);
                        updateFormData({ videoDemo: null });
                      }}
                    >
                      <Icon name="X" size={16} />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Icon name="Video" size={48} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm font-body text-foreground mb-4">
                      Upload a cooking demonstration video
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('video-input')?.click()}
                    >
                      Choose Video File
                    </Button>
                    <p className="text-xs text-muted-foreground mt-2">
                      MP4, MOV, AVI up to 100MB
                    </p>
                  </div>
                )}
              </div>
              <input
                id="video-input"
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => handleVideoUpload(e?.target?.files?.[0])}
              />
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-body font-medium text-foreground mb-2">
                  Video Guidelines
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Keep video under 5 minutes</li>
                  <li>• Show key cooking techniques clearly</li>
                  <li>• Good lighting and stable camera</li>
                  <li>• Optional: Add voice narration</li>
                  <li>• Focus on unique preparation methods</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        
        <Button
          variant="default"
          onClick={onNext}
          disabled={!isFormValid()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Next: Cultural Context
        </Button>
      </div>
    </div>
  );
};

export default InstructionsStep;