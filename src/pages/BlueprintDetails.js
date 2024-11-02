// src/pages/BlueprintDetails.js
import React from 'react';

const BlueprintDetails = ({ match }) => {
  const { id } = match.params; // Get the blueprint ID from the URL

  // Fetch and display details based on the blueprint ID
  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-4">Blueprint Details for ID: {id}</h1>
      {/* Here, display the details of the selected blueprint */}
      <p>Details will be populated here.</p>
    </div>
  );
};

export default BlueprintDetails;
