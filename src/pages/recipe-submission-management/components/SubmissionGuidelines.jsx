import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const SubmissionGuidelines = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-warm-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-heading font-semibold text-foreground">
              Recipe Submission Guidelines
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-start space-x-3">
                <Icon name="Heart" size={20} className="text-primary mt-0.5" />
                <div>
                  <h3 className="font-body font-semibold text-foreground mb-2">
                    Our Mission
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    DishCover is dedicated to preserving and promoting indigenous Indian culinary heritage. 
                    Every recipe you share helps keep our rich food traditions alive for future generations.
                  </p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                <Icon name="CheckCircle" size={20} className="mr-2 text-success" />
                Authenticity Standards
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Share traditional recipes with authentic preparation methods</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Include regional variations and cultural context when possible</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Use indigenous ingredients and traditional cooking techniques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Provide accurate measurements and clear instructions</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Camera" size={20} className="mr-2 text-secondary" />
                Image & Video Guidelines
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Use high-quality, well-lit photos of the finished dish</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Include step-by-step images for complex techniques</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Videos should be clear, stable, and under 5 minutes</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Ensure all content is original and not copyrighted</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Users" size={20} className="mr-2 text-accent" />
                Community Values
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Respect cultural sensitivities and dietary restrictions</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Share family stories and cultural significance when appropriate</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Be open to feedback and recipe improvements</span>
                </li>
                <li className="flex items-start space-x-2">
                  <Icon name="Dot" size={16} className="mt-1 text-primary" />
                  <span>Credit original sources and family traditions</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                <Icon name="Clock" size={20} className="mr-2 text-warning" />
                Review Process
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Submission Review</p>
                    <p className="text-xs text-muted-foreground">Our team reviews for authenticity and quality (2-3 days)</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Feedback & Approval</p>
                    <p className="text-xs text-muted-foreground">You'll receive feedback or approval notification</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                  <div className="w-8 h-8 bg-success text-success-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <div>
                    <p className="font-body font-medium text-foreground">Publication</p>
                    <p className="text-xs text-muted-foreground">Approved recipes go live on the platform</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-success/5 rounded-lg border border-success/20">
              <div className="flex items-start space-x-3">
                <Icon name="Award" size={20} className="text-success mt-0.5" />
                <div>
                  <h3 className="font-body font-semibold text-foreground mb-2">
                    Recognition & Rewards
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Contributors with approved recipes earn community badges, get featured in our 
                    newsletter, and help preserve India's culinary heritage. Top contributors may 
                    be invited to special events and cooking demonstrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex justify-end">
              <Button variant="default" onClick={onClose}>
                I Understand
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmissionGuidelines;