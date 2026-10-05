import React, { useState } from 'react';
import { 
  Camera, 
  BarChart3, 
  Sparkles, 
  Recycle, 
  RotateCcw, 
  HeartHandshake, 
  Scissors, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight, 
  ChevronRight, 
  Zap, 
  Trees, 
  ShieldCheck, 
  Globe2,
  HelpCircle,
  Cpu,
  BatteryCharging,
  Smartphone,
  Shirt,
  Pill,
  Coffee
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LandingView: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeProblemTab, setActiveProblemTab] = useState('batteries');

  const problemExamples = [
    {
      id: 'batteries',
      title: 'Lithium & Alkaline Batteries',
      icon: <BatteryCharging className="w-5 h-5 text-rose-500" />,
      category: 'Hazardous / Batteries',
      commonMistake: 'Throwing into standard curbside trash causes compactor fires and heavy metal groundwater pollution.',
      rightAction: 'Safe Disposal: Tape terminals with electrical tape and bring to dedicated hazardous drop-off kiosk.',
      co2: '3.8 kg',
      points: '+35 pts',
      tagColor: 'bg-rose-50 text-rose-800 border-rose-200',
    },
    {
      id: 'chargers',
      title: 'Frayed Chargers & USB Cables',
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      category: 'E-Waste',
      commonMistake: 'Cables jam municipal single-stream conveyor sorting belts.',
      rightAction: 'E-Waste Hub: Strip copper or drop off in dedicated e-waste bin; reuse functional adapters as secondary desk plugs.',
      co2: '2.1 kg',
      points: '+25 pts',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
    },
    {
      id: 'devices',
      title: 'Smartphones & Tablets',
      icon: <Smartphone className="w-5 h-5 text-blue-500" />,
      category: 'Electronics',
      commonMistake: 'Hoarded in drawers or tossed, wasting rare earth neodymium, cobalt, and gold.',
      rightAction: 'Donate or Recycle: Erase data and donate to digital literacy non-profits or send for pyrometallurgical recovery.',
      co2: '14.5 kg',
      points: '+35 pts',
      tagColor: 'bg-blue-50 text-blue-800 border-blue-200',
    },
    {
      id: 'plastic',
      title: 'Single-Use Plastic Bottles',
      icon: <Recycle className="w-5 h-5 text-emerald-500" />,
      category: 'Plastics (PET #1)',
      commonMistake: 'Throwing bottles away with caps and half-full soda contaminates paper recycling streams.',
      rightAction: 'Recycle or Upcycle: Empty liquid, rinse clean, flatten, and deposit in clean PET bin.',
      co2: '0.65 kg',
      points: '+15 pts',
      tagColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    },
    {
      id: 'medicines',
      title: 'Expired Medications & Blister Packs',
      icon: <Pill className="w-5 h-5 text-purple-500" />,
      category: 'Pharmaceuticals',
      commonMistake: 'Flushing pills down the toilet contaminates municipal drinking water reservoirs.',
      rightAction: 'Safe Pharmacy Take-Back: Bring to pharmacy hazardous medication disposal bins.',
      co2: '1.8 kg',
      points: '+30 pts',
      tagColor: 'bg-purple-50 text-purple-800 border-purple-200',
    },
    {
      id: 'clothes',
      title: 'Worn Clothes & Textiles',
      icon: <Shirt className="w-5 h-5 text-teal-500" />,
      category: 'Textiles',
      commonMistake: '85% of old garments are landfilled despite being recyclable into insulation or rags.',
      rightAction: 'Donate or Upcycle: Give wearable apparel to community banks, or cut into cleaning rags.',
      co2: '6.8 kg',
      points: '+30 pts',
      tagColor: 'bg-teal-50 text-teal-800 border-teal-200',
    },
    {
      id: 'food_containers',
      title: 'Greasy Food Containers & Boxes',
      icon: <Coffee className="w-5 h-5 text-orange-500" />,
      category: 'Food Containers',
      commonMistake: 'Grease-soaked paper or unrinsed plastic ruins entire batches of cardboard pulp.',
      rightAction: 'Sort Correctly: Compost food-soiled cardboard; rinse plastics thoroughly before recycling.',
      co2: '0.45 kg',
      points: '+10 pts',
      tagColor: 'bg-orange-50 text-orange-800 border-orange-200',
    },
  ];

  const activeExample = problemExamples.find((e) => e.id === activeProblemTab) || problemExamples[0];

  return (
    <div className="space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        {/* Subtle decorative background gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                Hackathon 2026 • AI-Powered Waste Intelligence
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                EcoScan – <br />
                <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
                  Make the Right Waste Choice
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Scan any item with your phone camera. Our multimodal Gemini AI recognizes materials instantly and directs you to the optimal next circular action: <strong>Reuse, Donate, Upcycle, Recycle, or Safe Disposal</strong>.
              </p>

              {/* Primary CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <button
                  onClick={() => setCurrentView('scanner')}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Scan an Item Now</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </button>

                <button
                  onClick={() => setCurrentView('impact')}
                  className="px-6 py-3.5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-400 text-slate-800 font-bold text-sm shadow-xs transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4 text-emerald-600" />
                  <span>View My Impact</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" /> Verified hazardous warnings
                </span>
                <span className="flex items-center gap-1.5">
                  <Globe2 className="w-4 h-4 text-emerald-600" /> Open municipal map network
                </span>
                <span className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-emerald-600" /> Real-time EcoPoints
                </span>
              </div>
            </div>

            {/* Right Hero Graphic / Interactive Scanner Preview */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md">
                
                {/* Floating Eco-Score Badge */}
                <div className="absolute -top-4 -left-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-emerald-100 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                    ⚡
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700 tracking-wide">
                      Instant Reward
                    </span>
                    <div className="text-sm font-black text-slate-900">+35 EcoPoints Earned</div>
                  </div>
                </div>

                {/* Floating Carbon Badge */}
                <div className="absolute -bottom-4 -right-4 z-20 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-teal-100 shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
                    🌿
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-teal-700 tracking-wide">
                      Emissions Abated
                    </span>
                    <div className="text-sm font-black text-slate-900">~14.5 kg CO₂ Diverted</div>
                  </div>
                </div>

                {/* Main Mock Device Card */}
                <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xl overflow-hidden">
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    <img
                      src="https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?auto=format&fit=crop&w=600&q=80"
                      alt="Scanned Laptop Battery"
                      className="w-full h-full object-cover opacity-90"
                    />
                    {/* Scanner Radar Overlay */}
                    <div className="absolute inset-4 border border-emerald-400/80 rounded-2xl flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex justify-between items-center text-[10px] text-emerald-300 font-mono">
                        <span>[SCANNING AI: 96%]</span>
                        <span>[LI-ION CELL]</span>
                      </div>
                      <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#34d399] animate-pulse" />
                      <div className="text-[10px] text-emerald-300 font-mono">
                        GEO: 37.77 N, 122.41 W
                      </div>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-extrabold uppercase">
                        Hazardous E-Waste
                      </span>
                      <span className="text-xs font-bold text-emerald-700">96% Confidence</span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Lithium-Ion Battery Pack
                    </h3>
                    <p className="text-xs text-slate-500 leading-snug">
                      Identified Lithium Cobalt Oxide. Must be taped and dropped at certified battery kiosk.
                    </p>

                    <button
                      onClick={() => setCurrentView('scanner')}
                      className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      Try Live Scanner
                    </button>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. PROBLEM & SOLUTIONS SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-emerald-600" />
            The Disposal Dilemma
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            People Want to Do the Right Thing — But Often Don't Know How
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Wishcycling damages sorting facilities, battery fires cost millions in damage, and electronics linger in storage drawers. EcoScan replaces confusion with instant clarity.
          </p>
        </div>

        {/* Interactive Problem Item Switcher */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
          
          {/* Left item selectors */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Select an everyday item to see the contrast:
            </span>
            {problemExamples.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveProblemTab(item.id)}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  activeProblemTab === item.id
                    ? 'border-emerald-500 bg-emerald-50/70 font-semibold shadow-xs'
                    : 'border-slate-100 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block leading-tight">
                      {item.title}
                    </span>
                    <span className="text-[10px] text-slate-500">{item.category}</span>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${
                  activeProblemTab === item.id ? 'text-emerald-600 translate-x-1' : 'text-slate-300'
                }`} />
              </button>
            ))}
          </div>

          {/* Right Detailed Contrast Card */}
          <div className="lg:col-span-7 bg-slate-50 rounded-2xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-bold border uppercase ${activeExample.tagColor}`}>
                {activeExample.category}
              </span>
              <span className="text-xs font-black text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                Earn {activeExample.points}
              </span>
            </div>

            <h3 className="text-2xl font-black text-slate-900">
              {activeExample.title}
            </h3>

            {/* Contrast: The Common Mistake vs EcoScan Action */}
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-rose-50/80 border border-rose-200">
                <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  ✕ Common Mistake (Wishcycling / Landfill)
                </span>
                <p className="text-xs text-rose-900 leading-relaxed font-medium">
                  {activeExample.commonMistake}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wide flex items-center gap-1.5 mb-1">
                  ✓ The EcoScan Circular Path
                </span>
                <p className="text-xs text-emerald-950 leading-relaxed font-medium">
                  {activeExample.rightAction}
                </p>
                <div className="mt-3 pt-2 border-t border-emerald-200/60 flex items-center justify-between text-xs text-emerald-800">
                  <span>Carbon avoided: <strong>~{activeExample.co2}</strong></span>
                  <button
                    onClick={() => setCurrentView('scanner')}
                    className="font-bold underline hover:text-emerald-950"
                  >
                    Scan this item →
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. HOW IT WORKS 4-STEP CIRCULAR PIPELINE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold uppercase tracking-wider mb-2">
            <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
            Simple 4-Step Flow
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            How EcoScan Turns Uncertainty into Action
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Snap or Upload',
              desc: 'Point your camera at old gadgets, cords, bottles, garments, or blister packs.',
              icon: <Camera className="w-6 h-6 text-emerald-600" />,
            },
            {
              step: '02',
              title: 'AI Classification',
              desc: 'Gemini 3.8 Flash detects materials, hazards, and regional recyclability in under 1 second.',
              icon: <Sparkles className="w-6 h-6 text-emerald-600" />,
            },
            {
              step: '03',
              title: 'Pick Smart Action',
              desc: 'Choose from 5 verified paths: Reuse, Donate, Upcycle, Recycle, or Safe Disposal.',
              icon: <Recycle className="w-6 h-6 text-emerald-600" />,
            },
            {
              step: '04',
              title: 'Earn & Divert',
              desc: 'Accumulate EcoPoints, climb campus leaderboards, and track your CO₂ savings ledger.',
              icon: <BarChart3 className="w-6 h-6 text-emerald-600" />,
            },
          ].map((item, i) => (
            <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs relative">
              <span className="text-3xl font-black text-slate-200 block mb-2">
                {item.step}
              </span>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
                {item.icon}
              </div>
              <h3 className="font-bold text-base text-slate-900 mb-1">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900 text-white p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight">
              Ready to divert your first item from the landfill?
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Join thousands of eco-conscious creators, universities, and households. It takes less than 5 seconds to scan and find the right circular choice.
            </p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => setCurrentView('scanner')}
                className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm shadow-lg shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-2"
              >
                <Camera className="w-4 h-4" />
                Start AI Scan
              </button>
              <button
                onClick={() => setCurrentView('locations')}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-colors"
              >
                Explore Nearby Map
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
