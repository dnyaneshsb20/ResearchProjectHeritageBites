import React, { useState, useEffect} from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../supabaseClient';

const BasicInfoStep = ({ formData, updateFormData, onNext }) => {
  const [imagePreview, setImagePreview] = useState(formData?.heroImage || null);
  const [isDragging, setIsDragging] = useState(false);
  const [states, setStates] = useState([]);

  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase.from("states").select("*");
      if (error) {
        console.error("Error fetching states:", error);
      } else {
        setStates(data);
      }
    };
    fetchStates();
  }, []);
  useEffect(() => {
  if (formData?.heroImage) {
    setImagePreview(formData.heroImage);
  }
}, [formData?.heroImage]);
  const categoryOptions = [
    { value: 'breakfast', label: 'Breakfast' },
    { value: 'lunch', label: 'Lunch' },
    { value: 'dinner', label: 'Dinner' },
    { value: 'snacks', label: 'Snacks' },
    { value: 'desserts', label: 'Desserts' },
    { value: 'beverages', label: 'Beverages' },
    { value: 'festival', label: 'Festival Special' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleImageUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e?.target?.result;
        setImagePreview(imageUrl);
        updateFormData({ heroImage: imageUrl });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragging(false);
    const file = e?.dataTransfer?.files?.[0];
    handleImageUpload(file);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragging(false);
  };

  const isFormValid = () => {
    return formData?.dishName && formData?.state_id && formData?.category && formData?.heroImage;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
          Basic Recipe Information
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Input
              label="Dish Name"
              type="text"
              placeholder="Enter the traditional dish name"
              value={formData?.dishName || ''}
              onChange={(e) => handleInputChange('dishName', e?.target?.value)}
              required
            />
            <Select
              label="Region / State"
              placeholder="Select the state of origin"
              options={states.map((s) => ({
                value: s.state_id,       // UUID value
                label: s.state_name,     // Human-readable name
              }))}
              value={formData?.state_id || ''}
              onChange={(value) => handleInputChange('state_id', value)}
              required
            />


            <Select
              label="Category"
              placeholder="Select dish category"
              options={categoryOptions}
              value={formData?.category || ''}
              onChange={(value) => handleInputChange('category', value)}
              required
            />

            <Input
              label="Preparation Time"
              type="text"
              placeholder="e.g., 30 minutes"
              value={formData?.prepTime || ''}
              onChange={(e) => handleInputChange('prepTime', e?.target?.value)}
            />

            <Input
              label="Cooking Time"
              type="text"
              placeholder="e.g., 45 minutes"
              value={formData?.cookTime || ''}
              onChange={(e) => handleInputChange('cookTime', e?.target?.value)}
            />

            <Input
              label="Serves"
              type="number"
              placeholder="Number of people"
              value={formData?.serves || ''}
              onChange={(e) => handleInputChange('serves', e?.target?.value)}
            />
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-body font-medium text-foreground">
              Hero Image *
            </label>

            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 ${isDragging
                  ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              {imagePreview ? (
                <div className="relative">
                  <Image
                    src={imagePreview}
                    alt="Recipe preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      updateFormData({ heroImage: null });
                    }}
                  >
                    <Icon name="X" size={16} />
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <Icon name="Upload" size={48} className="text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-body text-foreground mb-2">
                      Drag and drop your image here, or
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('hero-image-input')?.click()}
                    >
                      Browse Files
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              )}
            </div>

            <input
              id="hero-image-input"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleImageUpload(e?.target?.files?.[0])}
            />

            <Input
              label="Short Description"
              type="text"
              placeholder="Brief description of the dish"
              value={formData?.shortDescription || ''}
              onChange={(e) => handleInputChange('shortDescription', e?.target?.value)}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end">
        <Button
          variant="default"
          onClick={onNext}
          disabled={!isFormValid()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Next: Add Ingredients
        </Button>
      </div>
    </div>
  );
};

export default BasicInfoStep;