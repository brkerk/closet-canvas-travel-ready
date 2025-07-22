
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Save, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PhotoUploadCard, CapturedImage } from "./PhotoUploadCard";
import { AIAnalysisPanel } from "./AIAnalysisPanel";
import { useGarmentAnalysis } from "@/hooks/useGarmentAnalysis";
import { useGarmentStore } from "@/hooks/useGarmentStore";
import { useToast } from "@/hooks/use-toast";
import type { GarmentAnalysis } from "@/types/garment";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  type: z.string().min(1, "Type is required"),
  color: z.string().min(1, "Color is required"),
});

type FormData = z.infer<typeof formSchema>;

interface GarmentCaptureFormProps {
  onSave?: (garmentId: string) => void;
  onEditDetails?: (garmentId: string) => void;
}

export const GarmentCaptureForm = ({ onSave, onEditDetails }: GarmentCaptureFormProps) => {
  const [capturedImage, setCapturedImage] = useState<CapturedImage | null>(null);
  const { analysis, isAnalyzing, error, analyzeImage, clearAnalysis } = useGarmentAnalysis();
  const { addGarment } = useGarmentStore();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "Tops",
      color: "",
    },
  });

  const handleImageAnalysis = async () => {
    if (!capturedImage) return;
    
    const img = new Image();
    img.onload = () => analyzeImage(img);
    img.src = capturedImage.url;
  };

  const handleApplyAISuggestions = () => {
    if (!analysis) return;
    
    form.setValue("name", analysis.suggestedName);
    form.setValue("type", analysis.type);
    form.setValue("color", analysis.color);
    
    toast({
      title: "AI suggestions applied",
      description: "Form fields have been updated with AI recommendations.",
    });
  };

  const onSubmit = (data: FormData) => {
    if (!capturedImage) {
      toast({
        title: "Photo required",
        description: "Please capture or upload a photo of the garment.",
        variant: "destructive",
      });
      return;
    }

    // Create garment with essential fields
    const newGarment = addGarment({
      name: data.name,
      type: data.type,
      color: data.color,
      brand: "", // Will be filled in edit details
      tags: analysis?.suggestedTags || [],
      isFavorite: false,
      imageUrl: capturedImage.url, // Include the captured image URL
    });

    toast({
      title: "Garment saved!",
      description: `${data.name} has been added to your closet.`,
    });

    // Reset form
    form.reset();
    setCapturedImage(null);
    clearAnalysis();

    // Call callbacks
    onSave?.(newGarment.id);
  };

  const handleEditDetails = () => {
    const data = form.getValues();
    if (!data.name || !data.type || !data.color) {
      toast({
        title: "Complete required fields",
        description: "Please fill in Name, Type, and Color before proceeding.",
        variant: "destructive",
      });
      return;
    }

    if (!capturedImage) {
      toast({
        title: "Photo required", 
        description: "Please capture or upload a photo before proceeding.",
        variant: "destructive",
      });
      return;
    }

    // Save basic garment first
    const newGarment = addGarment({
      name: data.name,
      type: data.type,
      color: data.color,
      brand: "",
      tags: analysis?.suggestedTags || [],
      isFavorite: false,
      imageUrl: capturedImage.url, // Include the captured image URL
    });

    onEditDetails?.(newGarment.id);
  };

  return (
    <div className="max-w-md mx-auto px-4 form-container">
      <div className="text-center mb-6">
        <h2 className="screen-title">Add New Garment</h2>
        <p className="screen-subtitle">Capture a photo and add essential details</p>
      </div>

      {/* Photo Upload Card */}
      <div className="card">
        <PhotoUploadCard
          image={capturedImage}
          onImageChange={setCapturedImage}
          onAnalyze={handleImageAnalysis}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* AI Analysis Panel */}
      {analysis && (
        <div className="card">
          <AIAnalysisPanel
            analysis={analysis}
            onApply={handleApplyAISuggestions}
          />
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="card bg-destructive/10 border border-destructive/20">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Streamlined Form Card - Essentials Only */}
      <div className="card">
        <h3 className="section-title font-medium text-foreground">Essential Details</h3>
        <Form {...form}>
          <form id="garment-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Navy Blue Blazer"
                      required
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Type and Color in Row - 48% width each with 4% gap */}
            <div style={{ display: 'flex', gap: '4%', marginTop: '12px' }}>
              <div style={{ flex: '1' }}>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} required>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="[Tops,Pants,...]" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Tops">Tops</SelectItem>
                          <SelectItem value="Bottoms">Bottoms</SelectItem>
                          <SelectItem value="Outerwear">Outerwear</SelectItem>
                          <SelectItem value="Dresses">Dresses</SelectItem>
                          <SelectItem value="Shoes">Shoes</SelectItem>
                          <SelectItem value="Accessories">Accessories</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div style={{ flex: '1' }}>
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Navy Blue"
                          required
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Secondary Flow - Add Details Link */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleEditDetails}
                className="text-sm text-primary hover:underline"
              >
                Add more details
              </button>
            </div>
          </form>
        </Form>
      </div>

      {/* Sticky Footer Button - positioned above bottom navigation */}
      <div 
        className="fixed left-0 right-0 z-40 p-4 bg-background border-t border-border"
        style={{ 
          bottom: '80px', // Account for bottom navigation height
          paddingBottom: '16px'
        }}
      >
        <div className="max-w-md mx-auto">
          <button
            type="button"
            onClick={form.handleSubmit(onSubmit)}
            className="w-full h-14 font-medium rounded-lg text-white transition-all flex items-center justify-center gap-2 shadow-lg"
            style={{ 
              backgroundColor: 'hsl(var(--color-primary))',
              fontSize: '16px'
            }}
          >
            <Save size={24} />
            Save to Closet
          </button>
        </div>
      </div>
    </div>
  );
};
