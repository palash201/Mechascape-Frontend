// src/pages/BlueprintGallery.js
import React from 'react';

const BlueprintGallery = () => {
  return (
    <div className="text-center p-10">
      <h1 className="text-3xl font-bold mb-4">Blueprint Gallery</h1>
      {/* Here you would map over user blueprints to display them */}
      <p className="mt-2">No blueprints available. Create one now!</p>
    </div>
  );
};

export default BlueprintGallery;
