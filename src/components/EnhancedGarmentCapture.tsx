
import React, { useState } from "react";
import { GarmentCaptureForm } from "./garment-capture/GarmentCaptureForm";
import { GarmentEditDetails } from "./garment-capture/GarmentEditDetails";

type CaptureView = "capture" | "edit-details";

export const EnhancedGarmentCapture = () => {
  const [currentView, setCurrentView] = useState<CaptureView>("capture");
  const [editingGarmentId, setEditingGarmentId] = useState<string | null>(null);

  const handleSave = (garmentId: string) => {
    // Reset to capture view after saving
    setCurrentView("capture");
    setEditingGarmentId(null);
  };

  const handleEditDetails = (garmentId: string) => {
    setEditingGarmentId(garmentId);
    setCurrentView("edit-details");
  };

  const handleBackToCapture = () => {
    setCurrentView("capture");
    setEditingGarmentId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentView === "capture" && (
        <GarmentCaptureForm
          onSave={handleSave}
          onEditDetails={handleEditDetails}
        />
      )}
      
      {currentView === "edit-details" && editingGarmentId && (
        <GarmentEditDetails
          garmentId={editingGarmentId}
          onBack={handleBackToCapture}
          onSave={handleBackToCapture}
        />
      )}
    </div>
  );
};
