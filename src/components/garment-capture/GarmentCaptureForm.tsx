
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
    <div className="max-w-md mx-auto px-4">
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

      {/* Essential Fields Form Card */}
      <div className="card">
        <h3 className="section-title font-medium text-foreground">Essential Details</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Navy Blue Blazer"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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

              <FormField
                control={form.control}
                name="color"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Color *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Navy Blue"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Button Group - Save primary, Add Details secondary */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                className="w-full"
                size="lg"
              >
                <Save className="w-4 h-4 mr-2" />
                Save to Closet
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={handleEditDetails}
                className="w-full text-sm"
                size="sm"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Add Details
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
