import React, { useEffect, useRef, useState } from 'react';
import { Circle, Triangle, Canvas, Rect, PatternBrush, PencilBrush, CircleBrush, SprayBrush, getFabricDocument, Shadow } from 'fabric';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import api from '../api';
import './BlueprintEditor.css';
import blueprintImage from '../images/blueprint.png'

const BlueprintEditor = () => {
  const location = useLocation();
  const { onLoadBlueprintId } = location.state || {}; // Access the currentBlueprintId
  const canvasRef = useRef(null);
  const canvasObj = useRef(null);
  const [currentBlueprintId, setCurrentBlueprintId] = useState(null);
  const { authToken } = useAuth();
  const navigate = useNavigate();

  // State for drawing properties
  const [saveButtonText, setSaveButtonText] = useState('Save');
  const [drawingColor, setDrawingColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(5);
  const [shadowWidth, setShadowWidth] = useState(0);
  const [shadowColor, setShadowColor] = useState('#000000');
  const [isDrawingMode, setIsDrawingMode] = useState(true);
  const [selectedBrush, setSelectedBrush] = useState('PencilBrush'); // Default brush
  const [canvasData, setCanvasData] = useState(null);

  // State for undo functionality
  const [history, setHistory] = useState([]); // Stack to hold history states
  const [historyIndex, setHistoryIndex] = useState(-1); // Current index in history stack


  useEffect(() => {
    if (!authToken) {
      navigate('/login');
      return;
    }
    if (onLoadBlueprintId) {
      setCurrentBlueprintId(onLoadBlueprintId)
    }

    const canvas = new Canvas(canvasRef.current, {
      isDrawingMode: true,
      height: window.innerHeight * 0.8,
      width: window.innerWidth * 0.95,
      backgroundColor: '#404040'
    });
    if (onLoadBlueprintId) {
      console.log(onLoadBlueprintId)
      loadBlueprint(onLoadBlueprintId)
    }
    if (canvasData) {
      canvas.loadFromJSON(canvasData)
    }
// Push initial state to history
saveCanvasState(canvas);
  
    canvasObj.current = canvas;

    setBrushType(selectedBrush);

    const rect = new Rect({
      left: 100,
      top: 100,
      fill: 'red',
      width: 100,
      height: 100,
      selectable: true,
    });

    canvas.add(rect);
    canvas.renderAll();

    const resizeCanvas = () => {
      const newWidth = window.innerWidth * 0.95;
      const newHeight = window.innerHeight * 0.85;
      canvas.setWidth(newWidth);
      canvas.setHeight(newHeight);
      canvas.renderAll();
    };

    window.addEventListener('resize', resizeCanvas);

    function refresh() {
      canvasObj.current.renderAll();
    }

    setInterval(refresh, 100)

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('keydown', handleKeyDown); // Cleanup
      canvas.dispose();
    };
  }, [authToken, navigate, drawingColor, lineWidth, shadowWidth, shadowColor, selectedBrush]);

  // Function to set up the chosen brush type
  const setBrushType = (type) => {
    if (!canvasObj.current) {
      return;
    }
    if (canvasObj.current.freeDrawingBrush && canvasObj.current.freeDrawingBrush.type === type) {
      // If the current brush type is already set, just return to avoid unnecessary changes
      return;
    }
    const canvasData = canvasObj.current.toJSON();
    switch (type) {
      case 'HatchBrush':
        const hatchBrush = new PatternBrush(canvasObj.current);
        hatchBrush.getPatternSrc = function () {
          const patternCanvas = getFabricDocument().createElement('canvas');
          patternCanvas.width = patternCanvas.height = 10;
          const ctx = patternCanvas.getContext('2d');
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(10, 10);
          ctx.moveTo(0, 10);
          ctx.lineTo(10, 0);
          ctx.stroke();
          return patternCanvas;
        };
        canvasObj.current.freeDrawingBrush = hatchBrush;
        break;

case 'DiamondBrush':
  const diamondBrush = new PatternBrush(canvasObj.current);
  diamondBrush.getPatternSrc = function () {
    const patternCanvas = getFabricDocument().createElement('canvas');
    patternCanvas.width = patternCanvas.height = 15;
    const ctx = patternCanvas.getContext('2d');
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(7.5, 0);
    ctx.lineTo(15, 7.5);
    ctx.lineTo(7.5, 15);
    ctx.lineTo(0, 7.5);
    ctx.closePath();
    ctx.fill();
    return patternCanvas;
  };
  canvasObj.current.freeDrawingBrush = diamondBrush;
  break;

      case 'PencilBrush':
        canvasObj.current.freeDrawingBrush = new PencilBrush(canvasObj.current);
        break;
      case 'CircleBrush':
        canvasObj.current.freeDrawingBrush = new CircleBrush(canvasObj.current);
        break;
      case 'SprayBrush':
        canvasObj.current.freeDrawingBrush = new SprayBrush(canvasObj.current);
        break;
      case 'PatternBrush':
        const vLinePatternBrush = new PatternBrush(canvasObj.current);
        vLinePatternBrush.getPatternSrc = function () {
          const patternCanvas = getFabricDocument().createElement('canvas');
          patternCanvas.width = patternCanvas.height = 10;
          const ctx = patternCanvas.getContext('2d');
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.moveTo(0, 5);
          ctx.lineTo(10, 5);
          ctx.stroke();
          return patternCanvas;
        };
        canvasObj.current.freeDrawingBrush = vLinePatternBrush;
        break;
      default:
        canvasObj.current.freeDrawingBrush = new PencilBrush(canvasObj.current);
    }
    updateBrushProperties(canvasObj.current, drawingColor, lineWidth, shadowWidth, shadowColor);
    //canvasObj.current.loadFromJSON(canvasData)
  };

  const updateBrushProperties = (canvas, color, width, shadowBlur, shadowColor) => {
    if (canvas && canvas.freeDrawingBrush) {
      setCanvasData(canvasObj.current.toJSON())
      const brush = canvas.freeDrawingBrush;
      brush.color = color;
      brush.width = width;
      brush.shadow = new Shadow({
        blur: shadowBlur,
        color: shadowColor,
      });

      if (brush.getPatternSrc) {
        brush.source = brush.getPatternSrc.call(brush);
      }
    }
  };

  // Save the current canvas state to history
const saveCanvasState = (canvas) => {
  const currentState = canvas.toJSON();
  
  // Keep history stack limited
  const updatedHistory = history.slice(0, historyIndex + 1); 
  updatedHistory.push(currentState);

  setHistory(updatedHistory);
  setHistoryIndex(updatedHistory.length - 1); // Update the current index to the latest
};

// Undo function to revert to the previous state
const undo = () => {
  if (historyIndex > 0) {
    const previousState = history[historyIndex - 1];
    canvasObj.current.loadFromJSON(previousState, () => {
      setHistoryIndex(historyIndex - 1); // Move the index back
      canvasObj.current.renderAll();
    });
  }
};

  const handleBrushChange = (event) => {
    setCanvasData(canvasObj.current.toJSON())
    const selectedBrushType = event.target.value;
    setSelectedBrush(selectedBrushType);
    setBrushType(selectedBrushType);
  };

  const generateBlueprint = async () => {
    try {
        const response = await api.post(
            `/blueprint/generate`,
            {}, // Empty body if no data is being sent
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
        console.log('Generated blueprint:', response.data);
        setCanvasData(response.data["drawing_data"])
        setCurrentBlueprintId(response.data["blueprint_id"]); // Save generated blueprint ID
    } catch (error) {
        console.error('Error generating blueprint:', error);
    }
};

// Keyboard event listener for undo
const handleKeyDown = (event) => {
  if (event.ctrlKey && event.key === 'z') {
    event.preventDefault();
    undo(); // Call undo function on Ctrl+Z
  }
};

window.addEventListener('keydown', handleKeyDown);

// The updated saveBlueprint function
const saveBlueprint = async () => {
  try {
    // Change button text to indicate saving
    setSaveButtonText('Saving...');

    const canvasData = canvasObj.current.toJSON();
    let blueprintData;
    let response;

    if (currentBlueprintId) {
      // Prepare data for updating an existing blueprint
      blueprintData = {
        name: 'My Blueprint', // Update this as needed to reflect your UI state
        description: 'Sample description', // Same for this field
        drawing_data: canvasData,
      };

      // Update the existing blueprint
      response = await api.put(`/blueprint/${currentBlueprintId}`, blueprintData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Blueprint updated:', response.data);
    } else {
      // Ask the user for a new blueprint name and description
      const name = prompt('Enter a name for the new blueprint:');
      if (!name) {
        alert('Blueprint name is required.');
        setSaveButtonText('Save'); // Reset button text
        return; // Exit if the user cancels or enters an empty name
      }

      const description = prompt('Enter a description for the new blueprint (optional):') || 'No description provided';

      // Prepare data for saving a new blueprint
      blueprintData = {
        name: name,
        description: description,
        drawing_data: canvasData,
      };

      // Save the new blueprint
      response = await api.post('/blueprint', blueprintData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Blueprint saved:', response.data);
      setCurrentBlueprintId(response.data.blueprint_id); // Store the new blueprint ID
    }

    // Change button text to indicate success
    setSaveButtonText('Saved!');
    setTimeout(() => {
      setSaveButtonText('Save'); // Reset button text after 2 seconds
    }, 2000);
  } catch (error) {
    console.error('Error saving blueprint:', error);
    setSaveButtonText('Save'); // Reset button text in case of an error
  }
};

  const loadBlueprint = async (blueprintId) => {
    try {
      const response = await api.get(`/blueprint/${blueprintId}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      console.log('Loaded blueprint:', response.data);
      canvasObj.current.loadFromJSON(response.data.drawing_data, () => {
        setCurrentBlueprintId(blueprintId);
      });
    } catch (error) {
      console.error('Error loading blueprint:', error);
    }
  };

  return (
    <div className="blueprint-editor">
      <h1>Edit Blueprint</h1>
      <canvas ref={canvasRef} className="canvas"></canvas>
      <div className="controls">
        <label>
          Color:
          <input
            type="color"
            value={drawingColor}
            onChange={(e) => {
              setDrawingColor(e.target.value);
              if (canvasRef) updateBrushProperties(canvasObj.current, e.target.value, lineWidth, shadowWidth, shadowColor);
            }}
          />
        </label>
        <label>
          Line Width:
          <input
            type="number"
            min="1"
            value={lineWidth}
            onChange={(e) => {
              const width = parseInt(e.target.value, 10);
              setLineWidth(width);
              if (canvasRef) updateBrushProperties(canvasObj.current, drawingColor, width, shadowWidth, shadowColor);
            }}
          />
        </label>
        <label>
          Shadow Blur:
          <input
            type="number"
            min="0"
            value={shadowWidth}
            onChange={(e) => {
              const blur = parseInt(e.target.value, 10);
              setShadowWidth(blur);
              if (canvasRef) updateBrushProperties(canvasObj.current, drawingColor, lineWidth, blur, shadowColor);
            }}
          />
        </label>
        <label>
          Shadow Color:
          <input
            type="color"
            value={shadowColor}
            onChange={(e) => {
              setShadowColor(e.target.value);
              if (canvasRef) updateBrushProperties(canvasObj.current, drawingColor, lineWidth, shadowWidth, e.target.value);
            }}
          />
        </label>
        <label>
          Brush Type:
          <select value={selectedBrush} onChange={handleBrushChange}>
            <option value="PencilBrush">Pencil Brush</option>
            <option value="CircleBrush">Circle Brush</option>
            <option value="SprayBrush">Spray Brush</option>
            <option value="PatternBrush">Pattern Brush</option>
            <option value="HatchBrush">Hatch Brush</option>
            <option value="DiamondBrush">Diamond Brush</option>
          </select>
        </label>
        <label>
          Drawing Mode:
          <input
            type="checkbox"
            checked={isDrawingMode}
            onChange={() => {
              if (canvasRef) {
                canvasObj.current.isDrawingMode = !canvasObj.current.isDrawingMode;
                setIsDrawingMode(canvasObj.current.isDrawingMode);
              }
            }}
          />
        </label>
      </div>
      <div className="button-container">
      <button
    onClick={() => {
      const circle = new Circle({
        left: 150,
        top: 150,
        radius: 50,
        fill: drawingColor,
        selectable: true,
      });
      canvasObj.current.add(circle);
      canvasObj.current.renderAll();
    }}
    className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
  >
    Add Circle
  </button>
  
  <button
    onClick={() => {
      const rectangle = new Rect({
        left: 200,
        top: 200,
        width: 100,
        height: 60,
        fill: drawingColor,
        selectable: true,
      });
      canvasObj.current.add(rectangle);
      canvasObj.current.renderAll();
    }}
    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
  >
    Add Rectangle
  </button>

  <button
    onClick={() => {
      const triangle = new Triangle({
        left: 250,
        top: 250,
        width: 100,
        height: 100,
        fill: drawingColor,
        selectable: true,
      });
      canvasObj.current.add(triangle);
      canvasObj.current.renderAll();
    }}
    className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
  >
    Add Triangle
  </button>
        <button onClick={generateBlueprint} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Generate Blueprint
        </button>
        <button onClick={saveBlueprint} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          {saveButtonText}
        </button>
        <button onClick={undo} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
  Undo
</button>
      </div>
    </div>
  );
};

export default BlueprintEditor;
