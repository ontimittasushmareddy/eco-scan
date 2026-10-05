import React, { useState, useRef, useEffect } from 'react';
import { 
  Camera, 
  Upload, 
  Sparkles, 
  AlertTriangle, 
  ShieldAlert, 
  Recycle, 
  RotateCcw, 
  HeartHandshake, 
  Scissors, 
  AlertOctagon, 
  CheckCircle2, 
  MapPin, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight,
  Info,
  Maximize2,
  Zap,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { ScanResult, ActionType, WasteCategory } from '../types';

export const ScannerView: React.FC = () => {
  const { 
    activeScan, 
    setActiveScan, 
    openConfirmAction, 
    setCurrentView, 
    setFilterLocationCategory,
    addToast 
  } = useApp();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [cameraActive, setCameraActive] = useState(false);
  const [customItemNote, setCustomItemNote] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Preset sample items for instant demonstration
  const samplePresets = [
    {
      id: 'phone',
      label: 'Old Smartphone',
      category: 'electronics',
      icon: '📱',
      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'battery',
      label: 'Laptop Battery',
      category: 'batteries',
      icon: '🔋',
      img: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'charger',
      label: 'USB-C Charger',
      category: 'electronics',
      icon: '🔌',
      img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'bottle',
      label: 'PET Plastic Bottle',
      category: 'plastic',
      icon: '🥤',
      img: 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'jeans',
      label: 'Denim Jeans',
      category: 'textiles',
      icon: '👖',
      img: 'https://images.unsplash.com/photo-1542272604-780c96856592?auto=format&fit=crop&w=400&q=80',
    },
    {
      id: 'medicine',
      label: 'Blister Pack Pills',
      category: 'medicines',
      icon: '💊',
      img: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=400&q=80',
    },
  ];

  // Stop camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      setCameraActive(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable, using fallback upload.', err);
      setCameraActive(false);
      addToast({
        type: 'warning',
        title: 'Camera Unavailable',
        message: 'Could not access webcam. You can upload an image or choose a demo sample!',
      });
      fileInputRef.current?.click();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const capturePhoto = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setImagePreview(dataUrl);
      setImageBase64(dataUrl);
      setMimeType('image/jpeg');
    }
    stopCamera();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageBase64(result);
      setMimeType(file.type || 'image/jpeg');
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleSampleClick = (preset: typeof samplePresets[0]) => {
    setImagePreview(preset.img);
    setImageBase64(null);
    setCustomItemNote(preset.label);
    handleAnalyze(preset.id);
  };

  const handleAnalyze = async (samplePresetId?: string) => {
    if (!imageBase64 && !imagePreview && !samplePresetId) {
      addToast({
        type: 'warning',
        title: 'Image Required',
        message: 'Please take a photo, upload an image, or click one of the quick test presets.',
      });
      return;
    }

    setAnalyzing(true);
    setAnalysisStep(1);

    const stepInterval = setInterval(() => {
      setAnalysisStep((prev) => (prev < 3 ? prev + 1 : prev));
    }, 600);

    try {
      const response = await api.scanItem({
        imageBase64: imageBase64 ? imageBase64 : undefined,
        mimeType,
        sampleId: samplePresetId,
        textPrompt: customItemNote || undefined,
      });

      clearInterval(stepInterval);
      setAnalysisStep(4);

      if (response.success && response.result) {
        // If image was preset or uploaded, preserve preview
        if (imagePreview && !response.result.imageUrl) {
          response.result.imageUrl = imagePreview;
        }
        setActiveScan(response.result);

        addToast({
          type: 'success',
          title: `Identified: ${response.result.itemName}`,
          message: `Recommended: ${response.result.recommendedAction.toUpperCase()} (${response.result.confidence}% confidence)`,
        });
      }
    } catch (err: any) {
      clearInterval(stepInterval);
      addToast({
        type: 'error',
        title: 'Scan Analysis Failed',
        message: err?.message || 'Could not analyze item. Please try again.',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setActiveScan(null);
    setCustomItemNote('');
    stopCamera();
  };

  const handleViewNearbyLocations = (category: WasteCategory) => {
    setFilterLocationCategory(category);
    setCurrentView('locations');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
          Powered by Gemini 3.8 Multimodal AI
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          AI Item Scanner & Waste Classifier
        </h1>
        <p className="text-base text-slate-600 mt-2">
          Upload a photo or point your camera. EcoScan immediately identifies the materials, flags hazardous risks, and determines the most sustainable circular action: <strong>Reuse, Donate, Upcycle, Recycle, or Safe Disposal</strong>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Image Uploader / Camera Capture / Quick Presets */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Main Scanner Box */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <span className="font-semibold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-600" />
                Item Capture Area
              </span>
              {(imagePreview || cameraActive) && (
                <button
                  onClick={handleReset}
                  className="text-xs text-slate-500 hover:text-rose-600 font-medium flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset
                </button>
              )}
            </div>

            <div className="p-5">
              {/* Camera Live View */}
              {cameraActive ? (
                <div className="relative rounded-xl overflow-hidden bg-black aspect-4/3 flex items-center justify-center">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  {/* Camera Reticle Overlay */}
                  <div className="absolute inset-8 border-2 border-emerald-400/80 rounded-2xl pointer-events-none flex items-center justify-center">
                    <div className="w-12 h-12 border border-white/50 rounded-full animate-ping" />
                  </div>
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 px-4">
                    <button
                      onClick={capturePhoto}
                      className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg flex items-center gap-2"
                    >
                      <Camera className="w-4 h-4" />
                      Take Photo
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-4 py-2.5 rounded-full bg-slate-800 text-slate-200 hover:bg-slate-700 font-semibold text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : imagePreview ? (
                /* Image Preview with Retake */
                <div className="relative rounded-xl overflow-hidden bg-slate-100 aspect-4/3 border border-slate-200 flex items-center justify-center group">
                  <img
                    src={imagePreview}
                    alt="Scanned Item Preview"
                    className="w-full h-full object-contain"
                  />
                  {analyzing && (
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-4">
                      {/* Scanning Line Animation */}
                      <div className="w-full max-w-[200px] h-1 bg-emerald-400 shadow-[0_0_15px_#10b981] animate-pulse mb-6" />
                      <div className="w-12 h-12 rounded-full border-3 border-emerald-400 border-t-transparent animate-spin mb-3" />
                      <span className="font-bold text-base tracking-wide">
                        AI Analyzing Item...
                      </span>
                      <p className="text-xs text-emerald-200 mt-1">
                        {analysisStep === 1 && 'Detecting shape & object contours...'}
                        {analysisStep === 2 && 'Examining material compositions...'}
                        {analysisStep === 3 && 'Evaluating circular & safety paths...'}
                        {analysisStep >= 4 && 'Finalizing eco recommendations...'}
                      </p>
                    </div>
                  )}
                  {!analyzing && (
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={startCamera}
                        className="px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        Retake
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Drag and drop upload zone */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOver(true);
                  }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                    dragOver
                      ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]'
                      : 'border-slate-300 hover:border-emerald-400 bg-slate-50/50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4 shadow-xs">
                    <Upload className="w-7 h-7" />
                  </div>

                  <h4 className="font-bold text-slate-800 text-base mb-1">
                    Upload or Snap Item Photo
                  </h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mb-5 leading-relaxed">
                    Drag and drop your image here, or choose an option below to get started.
                  </p>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-emerald-500 text-slate-700 text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-4 h-4 text-emerald-600" />
                      Browse Device
                    </button>
                    <button
                      type="button"
                      onClick={startCamera}
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all"
                    >
                      <Camera className="w-4 h-4" />
                      Use Live Camera
                    </button>
                  </div>
                </div>
              )}

              {/* Optional Text context hint */}
              <div className="mt-4">
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Optional clarification (e.g. brand, broken screen, battery type):
                </label>
                <input
                  type="text"
                  value={customItemNote}
                  onChange={(e) => setCustomItemNote(e.target.value)}
                  placeholder="e.g. Broken laptop charger, blister pack pills, plastic jar..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>

              {/* Action Button: Analyze */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleAnalyze()}
                  disabled={analyzing || (!imagePreview && !customItemNote)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-600/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {analyzing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Classifying with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Analyze Item Lifecycle</span>
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>

          {/* Quick Demo Sample Items */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Quick Test Samples (1-Click Demo)
              </span>
              <span className="text-[11px] text-emerald-700 font-medium">Try any item</span>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
              {samplePresets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => handleSampleClick(preset)}
                  className="flex flex-col items-center p-2.5 rounded-xl border border-slate-200 hover:border-emerald-400 hover:bg-emerald-50/50 transition-all text-center group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden mb-1.5 border border-slate-100">
                    <img
                      src={preset.img}
                      alt={preset.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-800 leading-tight">
                    {preset.label}
                  </span>
                  <span className="text-[9px] text-slate-600 capitalize mt-0.5">
                    {preset.category}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: AI Analysis Results & Smart Action Cards */}
        <div className="lg:col-span-7">
          {activeScan ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
              
              {/* Primary Detected Item Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                
                {/* Confidence & Category Top Ribbon */}
                <div className="px-6 py-3.5 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold tracking-wider uppercase text-emerald-400">
                      AI Recognition Verified
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5 text-xs text-slate-300">
                      <span>Confidence:</span>
                      <span className="font-extrabold text-emerald-400">{activeScan.confidence}%</span>
                    </div>
                    <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-md bg-emerald-950 text-emerald-300 border border-emerald-700">
                      {activeScan.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  
                  {/* Uncertain Verification Alert if Confidence is Low */}
                  {activeScan.isUncertain && (
                    <div className="mb-5 p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-bold text-amber-900">
                          AI Uncertainty Notice – Please Confirm
                        </h4>
                        <p className="text-xs text-amber-800 mt-1">
                          {activeScan.uncertaintyReason || 
                            'The image is slightly ambiguous or reflective. Please review the item material carefully before selecting a disposal action.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Hazardous Warning Banner */}
                  {activeScan.safetyInstructions && (
                    <div className="mb-5 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3">
                      <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-rose-900">Safety Precaution</h4>
                          <span className="px-1.5 py-0.2 bg-rose-200 text-rose-900 text-[10px] font-extrabold rounded-sm uppercase">
                            Hazard: {activeScan.hazardLevel || 'Medium'}
                          </span>
                        </div>
                        <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                          {activeScan.safetyInstructions}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Item Headline & Details */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                        Detected Object
                      </span>
                      <h2 className="text-2xl font-extrabold text-slate-900 mt-0.5">
                        {activeScan.itemName}
                      </h2>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-xs text-slate-500 font-medium">
                          Material: <strong className="text-slate-700 font-semibold">{activeScan.material}</strong>
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          Recyclability: <strong className="text-emerald-700 font-semibold">{activeScan.recyclability}</strong>
                        </span>
                      </div>
                    </div>

                    {/* Impact Tag Badges */}
                    <div className="flex sm:flex-col gap-2 shrink-0">
                      <div className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-right">
                        <span className="text-[10px] text-emerald-700 font-medium block">CO₂ Savings</span>
                        <span className="text-sm font-bold text-emerald-900">~{activeScan.co2SavingsEstimateKg} kg</span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-teal-50 border border-teal-200 text-right">
                        <span className="text-[10px] text-teal-700 font-medium block">Diverted</span>
                        <span className="text-sm font-bold text-teal-900">{activeScan.wasteDivertedEstimateKg} kg</span>
                      </div>
                    </div>
                  </div>

                  {/* Recommended Primary Action Box */}
                  <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 border border-emerald-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        Recommended Circular Step: <span className="underline uppercase">{activeScan.recommendedAction}</span>
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 bg-emerald-600 text-white rounded-md">
                        Best Choice
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 mb-3 font-medium leading-relaxed">
                      Follow these verified instructions to maximize resource recovery and prevent landfill contamination:
                    </p>

                    <div className="space-y-2">
                      {activeScan.recommendedSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-800">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                            {idx + 1}
                          </div>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>

                    {/* Button to confirm recommended action directly */}
                    <div className="mt-4 pt-3 border-t border-emerald-200/60 flex items-center justify-between flex-wrap gap-2">
                      <button
                        onClick={() => openConfirmAction(activeScan, activeScan.recommendedAction)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        I'm doing this! Claim EcoPoints
                      </button>

                      <button
                        onClick={() => handleViewNearbyLocations(activeScan.category)}
                        className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" />
                        Find centers that accept this item
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                </div>
              </div>

              {/* All 4 Smart Actions Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-lg text-slate-900">
                    Smart Lifecycle Options
                  </h3>
                  <span className="text-xs text-slate-500">
                    Select an action to earn points & record your impact
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* 1. REUSE */}
                  {activeScan.actions.reuse && (
                    <div className="p-4 rounded-2xl bg-white border border-blue-100 hover:border-blue-300 shadow-xs flex flex-col justify-between transition-all group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                              <RotateCcw className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-blue-900">Reuse</span>
                          </div>
                          <span className="text-xs font-extrabold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                            +{activeScan.actions.reuse.points} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeScan.actions.reuse.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeScan.actions.reuse.description}
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmAction(activeScan, 'reuse')}
                        className="mt-4 w-full py-2 rounded-xl bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 text-xs font-bold border border-blue-200 transition-colors"
                      >
                        I'll Reuse This (+{activeScan.actions.reuse.points} pts)
                      </button>
                    </div>
                  )}

                  {/* 2. DONATE */}
                  {activeScan.actions.donate && (
                    <div className="p-4 rounded-2xl bg-white border border-amber-100 hover:border-amber-300 shadow-xs flex flex-col justify-between transition-all group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                              <HeartHandshake className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-amber-900">Donate</span>
                          </div>
                          <span className="text-xs font-extrabold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                            +{activeScan.actions.donate.points} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeScan.actions.donate.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeScan.actions.donate.description}
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmAction(activeScan, 'donate')}
                        className="mt-4 w-full py-2 rounded-xl bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-700 text-xs font-bold border border-amber-200 transition-colors"
                      >
                        I'll Donate This (+{activeScan.actions.donate.points} pts)
                      </button>
                    </div>
                  )}

                  {/* 3. UPCYCLE */}
                  {activeScan.actions.upcycle && (
                    <div className="p-4 rounded-2xl bg-white border border-purple-100 hover:border-purple-300 shadow-xs flex flex-col justify-between transition-all group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center">
                              <Scissors className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-purple-900">Upcycle DIY</span>
                          </div>
                          <span className="text-xs font-extrabold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
                            +{activeScan.actions.upcycle.points} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeScan.actions.upcycle.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeScan.actions.upcycle.description}
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmAction(activeScan, 'upcycle')}
                        className="mt-4 w-full py-2 rounded-xl bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 text-xs font-bold border border-purple-200 transition-colors"
                      >
                        I'll Upcycle This (+{activeScan.actions.upcycle.points} pts)
                      </button>
                    </div>
                  )}

                  {/* 4. RECYCLE */}
                  {activeScan.actions.recycle && (
                    <div className="p-4 rounded-2xl bg-white border border-emerald-100 hover:border-emerald-300 shadow-xs flex flex-col justify-between transition-all group">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                              <Recycle className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-emerald-900">Recycle</span>
                          </div>
                          <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            +{activeScan.actions.recycle.points} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeScan.actions.recycle.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeScan.actions.recycle.description}
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmAction(activeScan, 'recycle')}
                        className="mt-4 w-full py-2 rounded-xl bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 text-xs font-bold border border-emerald-200 transition-colors"
                      >
                        I'll Recycle This (+{activeScan.actions.recycle.points} pts)
                      </button>
                    </div>
                  )}

                  {/* 5. SAFE DISPOSAL */}
                  {activeScan.actions.safe_disposal && (
                    <div className="p-4 rounded-2xl bg-white border border-rose-100 hover:border-rose-300 shadow-xs flex flex-col justify-between transition-all group md:col-span-2">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
                              <AlertOctagon className="w-4 h-4" />
                            </div>
                            <span className="font-bold text-sm text-rose-900">Safe Chemical / E-Waste Disposal</span>
                          </div>
                          <span className="text-xs font-extrabold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                            +{activeScan.actions.safe_disposal.points} pts
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-slate-900 mb-1">
                          {activeScan.actions.safe_disposal.title}
                        </h4>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {activeScan.actions.safe_disposal.description}
                        </p>
                      </div>
                      <button
                        onClick={() => openConfirmAction(activeScan, 'safe_disposal')}
                        className="mt-4 w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <ShieldAlert className="w-4 h-4" />
                        Take to Hazardous Drop-Off Point (+{activeScan.actions.safe_disposal.points} pts)
                      </button>
                    </div>
                  )}

                </div>
              </div>

            </div>
          ) : (
            /* Empty State with Explanatory Card */
            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <Recycle className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">
                Ready to Scan Your First Item
              </h3>
              <p className="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mb-6">
                Point your camera at any consumer item, cord, lithium battery, beverage container, or piece of clothing. Our Gemini AI analyzes material composition and directs you to the safest, greenest circular action.
              </p>

              {/* Category Showcase Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
                {[
                  { title: 'Electronics', desc: 'Phones, chargers, PCBs', color: 'border-blue-200 bg-blue-50/50' },
                  { title: 'Batteries', desc: 'Li-ion, alkaline cells', color: 'border-rose-200 bg-rose-50/50' },
                  { title: 'Plastics', desc: 'PET bottles, jars', color: 'border-emerald-200 bg-emerald-50/50' },
                  { title: 'Textiles', desc: 'Garments, shoes, denim', color: 'border-purple-200 bg-purple-50/50' },
                ].map((item, i) => (
                  <div key={i} className={`p-3 rounded-xl border ${item.color}`}>
                    <div className="font-bold text-xs text-slate-800">{item.title}</div>
                    <div className="text-[11px] text-slate-500">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
