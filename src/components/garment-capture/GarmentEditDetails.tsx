
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TagsInput } from "./TagsInput";
import { useGarmentStore } from "@/hooks/useGarmentStore";
import { useToast } from "@/hooks/use-toast";
import { GarmentData } from "@/components/GarmentCard";

const detailsSchema = z.object({
  brand: z.string(),
  material: z.string(),
  season: z.string(),
  occasion: z.string(),
  purchaseDate: z.string(),
  price: z.string(),
  notes: z.string(),
  tags: z.string(),
});

type DetailsFormData = z.infer<typeof detailsSchema>;

interface GarmentEditDetailsProps {
  garmentId: string;
  onBack?: () => void;
  onSave?: () => void;
}

export const GarmentEditDetails = ({ garmentId, onBack, onSave }: GarmentEditDetailsProps) => {
  const { getGarment, updateGarment } = useGarmentStore();
  const { toast } = useToast();
  
  const garment = getGarment(garmentId);

  const form = useForm<DetailsFormData>({
    resolver: zodResolver(detailsSchema),
    defaultValues: {
      brand: garment?.brand || "",
      material: "",
      season: "",
      occasion: "",
      purchaseDate: "",
      price: "",
      notes: "",
      tags: garment?.tags?.join(", ") || "",
    },
  });

  // AI-enhanced suggestions based on garment type and existing data
  const getAISuggestions = () => {
    if (!garment) return {};

    const suggestions: any = {};
    
    // Material suggestions based on type
    const materialSuggestions = {
      'Tops': ['Cotton', 'Polyester', 'Silk', 'Linen', 'Wool'],
      'Bottoms': ['Denim', 'Cotton', 'Polyester', 'Wool', 'Linen'],
      'Outerwear': ['Wool', 'Polyester', 'Down', 'Leather', 'Cotton'],
      'Dresses': ['Cotton', 'Polyester', 'Silk', 'Chiffon', 'Crepe'],
      'Shoes': ['Leather', 'Canvas', 'Synthetic', 'Rubber', 'Suede'],
      'Accessories': ['Leather', 'Metal', 'Fabric', 'Plastic', 'Wood']
    };

    // Season suggestions based on type and color
    const seasonSuggestions = {
      'Outerwear': ['Fall', 'Winter', 'Spring'],
      'Tops': ['Spring', 'Summer', 'Fall', 'Winter'],
      'Bottoms': ['Spring', 'Summer', 'Fall', 'Winter'],
      'Dresses': ['Spring', 'Summer', 'Fall'],
      'Shoes': ['Spring', 'Summer', 'Fall', 'Winter'],
      'Accessories': ['All Season']
    };

    // Occasion suggestions based on type
    const occasionSuggestions = {
      'Outerwear': ['Casual', 'Work', 'Formal', 'Outdoor'],
      'Tops': ['Casual', 'Work', 'Formal', 'Athletic'],
      'Bottoms': ['Casual', 'Work', 'Formal', 'Athletic'],
      'Dresses': ['Casual', 'Work', 'Formal', 'Party', 'Wedding'],
      'Shoes': ['Casual', 'Work', 'Formal', 'Athletic', 'Outdoor'],
      'Accessories': ['Casual', 'Work', 'Formal', 'Party']
    };

    suggestions.materials = materialSuggestions[garment.type as keyof typeof materialSuggestions] || [];
    suggestions.seasons = seasonSuggestions[garment.type as keyof typeof seasonSuggestions] || [];
    suggestions.occasions = occasionSuggestions[garment.type as keyof typeof occasionSuggestions] || [];

    return suggestions;
  };

  const aiSuggestions = getAISuggestions();

  const onSubmit = (data: DetailsFormData) => {
    if (!garment) return;

    updateGarment(garmentId, {
      brand: data.brand,
      tags: data.tags.split(",").map(tag => tag.trim()).filter(tag => tag !== ""),
    });

    toast({
      title: "Details updated!",
      description: `${garment.name} details have been saved.`,
    });

    onSave?.();
  };

  const handleApplyAISuggestions = () => {
    if (aiSuggestions.materials?.length) {
      form.setValue("material", aiSuggestions.materials[0]);
    }
    if (aiSuggestions.seasons?.length) {
      form.setValue("season", aiSuggestions.seasons[0]);
    }
    if (aiSuggestions.occasions?.length) {
      form.setValue("occasion", aiSuggestions.occasions[0]);
    }

    toast({
      title: "AI suggestions applied",
      description: "Form fields have been updated with smart recommendations.",
    });
  };

  if (!garment) {
    return (
      <div className="max-w-md mx-auto p-4 text-center">
        <p className="text-muted-foreground">Garment not found</p>
        <Button onClick={onBack} variant="outline" className="mt-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button onClick={onBack} variant="ghost" size="sm">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-xl font-semibold text-foreground">Edit Details</h2>
          <p className="text-sm text-muted-foreground">{garment.name}</p>
        </div>
      </div>

      {/* AI Suggestions Panel */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium text-gray-800 flex items-center gap-1.5 text-sm">
            <Sparkles className="w-4 h-4 text-blue-500" />
            Smart Suggestions
          </h3>
        </div>
        <div className="text-xs text-gray-600 mb-3">
          AI-powered recommendations based on your garment type and style
        </div>
        <Button
          type="button"
          onClick={handleApplyAISuggestions}
          size="sm"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white"
        >
          Apply Smart Suggestions
        </Button>
      </div>

      {/* Enhanced Details Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Brand</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., J.Crew, Zara, Nike" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="material"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Material</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select material" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aiSuggestions.materials?.map((material: string) => (
                        <SelectItem key={material} value={material}>
                          {material}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="season"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Season</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select season" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {aiSuggestions.seasons?.map((season: string) => (
                        <SelectItem key={season} value={season}>
                          {season}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="occasion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Occasion</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {aiSuggestions.occasions?.map((occasion: string) => (
                      <SelectItem key={occasion} value={occasion}>
                        {occasion}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            <FormField
              control={form.control}
              name="purchaseDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input placeholder="$0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <TagsInput
                  tags={field.value}
                  onChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Care instructions, fit notes, styling ideas..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Details
          </Button>
        </form>
      </Form>
    </div>
  );
};
