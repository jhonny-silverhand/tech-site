'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';

interface PCComponent {
  id: string;
  category: 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case';
  vendor: string;
  model: string;
  specs: Record<string, any>;
  performance_tier?: string;
  use_cases?: string[];
  notes?: string;
}

interface CompatibilityResult {
  compatible: boolean;
  issues: Array<{ type: string; severity: string; message: string }>;
  warnings: Array<{ type: string; severity: string; message: string }>;
}

const CATEGORIES = [
  { id: 'cpu', label: 'CPU', icon: '🔲', description: 'Processor' },
  { id: 'motherboard', label: 'Motherboard', icon: '📋', description: 'Main board' },
  { id: 'ram', label: 'RAM', icon: '💾', description: 'Memory' },
  { id: 'gpu', label: 'GPU', icon: '🎮', description: 'Graphics Card' },
  { id: 'storage', label: 'Storage', icon: '💿', description: 'SSD/HDD' },
  { id: 'psu', label: 'PSU', icon: '⚡', description: 'Power Supply' },
  { id: 'case', label: 'Case', icon: '📦', description: 'PC Case' },
] as const;

const TIER_COLORS: Record<string, string> = {
  entry: 'bg-green-100 text-green-800',
  mid: 'bg-blue-100 text-blue-800',
  high: 'bg-purple-100 text-purple-800',
  flagship: 'bg-red-100 text-red-800',
};

export default function PCBuilderPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [build, setBuild] = useState<Record<string, PCComponent>>({});
  const [components, setComponents] = useState<PCComponent[]>([]);
  const [compatibility, setCompatibility] = useState<CompatibilityResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterTier, setFilterTier] = useState<string>('');
  const [filterVendor, setFilterVendor] = useState<string>('');

  const currentCategory = CATEGORIES[currentStep];

  // Fetch components for current category
  useEffect(() => {
    async function fetchComponents() {
      setLoading(true);
      const params = new URLSearchParams({ category: currentCategory.id });
      if (filterTier) params.set('tier', filterTier);
      if (filterVendor) params.set('vendor', filterVendor);
      
      const res = await fetch(`/api/pc-builder/components?${params}`);
      const data = await res.json();
      setComponents(data.components || []);
      setLoading(false);
    }
    fetchComponents();
  }, [currentCategory.id, filterTier, filterVendor]);

  // Check compatibility whenever build changes
  useEffect(() => {
    async function checkCompatibility() {
      const componentList = Object.values(build);
      if (componentList.length < 2) {
        setCompatibility(null);
        return;
      }

      const res = await fetch('/api/pc-builder/compatibility', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ components: componentList }),
      });
      const data = await res.json();
      setCompatibility(data);
    }
    checkCompatibility();
  }, [build]);

  const selectComponent = (component: PCComponent) => {
    setBuild(prev => ({
      ...prev,
      [currentCategory.id]: component,
    }));
  };

  const removeComponent = (category: string) => {
    setBuild(prev => {
      const next = { ...prev };
      delete next[category];
      return next;
    });
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
    setFilterTier('');
    setFilterVendor('');
  };

  const buildComplete = Object.keys(build).length === CATEGORIES.length;

  // Calculate total price
  const totalPrice = Object.values(build).reduce((sum, comp) => {
    // Estimate price based on category and tier
    const basePrices: Record<string, Record<string, number>> = {
      cpu: { entry: 15000, mid: 25000, high: 40000, flagship: 60000 },
      motherboard: { entry: 8000, mid: 15000, high: 25000, flagship: 40000 },
      ram: { entry: 4000, mid: 8000, high: 15000, flagship: 25000 },
      gpu: { entry: 15000, mid: 30000, high: 60000, flagship: 150000 },
      storage: { entry: 3000, mid: 6000, high: 12000, flagship: 25000 },
      psu: { entry: 3000, mid: 6000, high: 10000, flagship: 18000 },
      case: { entry: 3000, mid: 6000, high: 10000, flagship: 20000 },
    };
    const tier = comp.performance_tier || 'mid';
    return sum + (basePrices[comp.category]?.[tier] || 10000);
  }, 0);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-[11px] uppercase tracking-wide text-muted mb-2">
          <Link href="/" className="hover:text-ink transition-colors">
            tech<span className="text-accent">//</span>site
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink">PC Builder</span>
        </p>
        <h1 className="font-display text-4xl sm:text-5xl leading-[1.1] text-ink">
          Build Your PC
        </h1>
        <p className="mt-4 text-[17px] leading-relaxed text-muted">
          Select components step by step. We&apos;ll validate compatibility in real-time.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Step Navigation */}
          <div className="flex flex-wrap gap-2 mb-8">
            {CATEGORIES.map((cat, index) => (
              <button
                key={cat.id}
                onClick={() => goToStep(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-[13px] transition-colors ${
                  currentStep === index
                    ? 'bg-ink text-white'
                    : build[cat.id]
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-paper border border-line hover:border-ink/30'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
                {build[cat.id] && <span className="text-green-600">✓</span>}
              </button>
            ))}
          </div>

          {/* Current Step */}
          <div className="rounded-folder border border-line bg-paper p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-2xl text-ink">
                  Select {currentCategory.label}
                </h2>
                <p className="text-[14px] text-muted">{currentCategory.description}</p>
              </div>
              {build[currentCategory.id] && (
                <button
                  onClick={() => removeComponent(currentCategory.id)}
                  className="text-[13px] text-red-600 hover:text-red-700"
                >
                  Remove
                </button>
              )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3 mb-6">
              <select
                value={filterTier}
                onChange={(e) => setFilterTier(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-line bg-white text-[13px]"
              >
                <option value="">All Tiers</option>
                <option value="entry">Entry</option>
                <option value="mid">Mid</option>
                <option value="high">High</option>
                <option value="flagship">Flagship</option>
              </select>
              <select
                value={filterVendor}
                onChange={(e) => setFilterVendor(e.target.value)}
                className="px-3 py-1.5 rounded-md border border-line bg-white text-[13px]"
              >
                <option value="">All Brands</option>
                <option value="AMD">AMD</option>
                <option value="Intel">Intel</option>
                <option value="NVIDIA">NVIDIA</option>
                <option value="ASUS">ASUS</option>
                <option value="MSI">MSI</option>
                <option value="Gigabyte">Gigabyte</option>
              </select>
            </div>

            {/* Component List */}
            {loading ? (
              <div className="text-center py-12 text-muted">Loading components...</div>
            ) : components.length === 0 ? (
              <div className="text-center py-12 text-muted">
                No components found. Try different filters.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {components.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => selectComponent(comp)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      build[currentCategory.id]?.id === comp.id
                        ? 'border-accent bg-accent/5'
                        : 'border-line hover:border-ink/30 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[12px] text-muted">{comp.vendor}</span>
                          {comp.performance_tier && (
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase ${TIER_COLORS[comp.performance_tier] || ''}`}>
                              {comp.performance_tier}
                            </span>
                          )}
                        </div>
                        <h3 className="font-display text-[16px] text-ink">{comp.model}</h3>
                        {comp.notes && (
                          <p className="mt-1 text-[13px] text-muted line-clamp-2">{comp.notes}</p>
                        )}
                      </div>
                      {build[currentCategory.id]?.id === comp.id && (
                        <span className="text-accent text-xl">✓</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar - Build Summary */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 rounded-folder border border-line bg-paper p-6">
            <h3 className="font-mono text-[11px] uppercase tracking-wide text-muted mb-4">
              Your Build
            </h3>

            {/* Selected Components */}
            <div className="space-y-3 mb-6">
              {CATEGORIES.map((cat) => {
                const comp = build[cat.id];
                return (
                  <div
                    key={cat.id}
                    className={`p-3 rounded-lg border ${
                      comp ? 'border-green-200 bg-green-50' : 'border-line bg-white/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span>{cat.icon}</span>
                        <span className="font-mono text-[12px] text-muted">{cat.label}</span>
                      </div>
                      {comp && (
                        <button
                          onClick={() => removeComponent(cat.id)}
                          className="text-[11px] text-red-500 hover:text-red-600"
                        >
                          ×
                        </button>
                      )}
                    </div>
                    {comp ? (
                      <p className="mt-1 text-[13px] text-ink truncate">{comp.model}</p>
                    ) : (
                      <p className="mt-1 text-[13px] text-muted italic">Not selected</p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Price Estimate */}
            <div className="border-t border-line pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-muted">Estimated Total</span>
                <span className="font-display text-2xl text-ink">
                  ₹{totalPrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Compatibility Status */}
            {compatibility && (
              <div className={`p-4 rounded-lg border mb-6 ${
                compatibility.compatible
                  ? 'border-green-300 bg-green-50'
                  : 'border-red-300 bg-red-50'
              }`}>
                <h4 className={`font-mono text-[11px] uppercase tracking-wide mb-2 ${
                  compatibility.compatible ? 'text-green-700' : 'text-red-700'
                }`}>
                  {compatibility.compatible ? '✓ Compatible' : '✗ Issues Found'}
                </h4>
                {compatibility.issues.length > 0 && (
                  <div className="space-y-1">
                    {compatibility.issues.map((issue, i) => (
                      <p key={i} className="text-[12px] text-red-600">
                        {issue.message}
                      </p>
                    ))}
                  </div>
                )}
                {compatibility.warnings.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {compatibility.warnings.map((warn, i) => (
                      <p key={i} className="text-[12px] text-yellow-600">
                        ⚠ {warn.message}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button
                  variant="secondary"
                  onClick={() => goToStep(currentStep - 1)}
                  className="flex-1"
                >
                  ← Back
                </Button>
              )}
              {currentStep < CATEGORIES.length - 1 && (
                <Button
                  variant="primary"
                  onClick={() => goToStep(currentStep + 1)}
                  className="flex-1"
                >
                  Next →
                </Button>
              )}
            </div>

            {/* Build Complete */}
            {buildComplete && (
              <div className="mt-4 p-4 rounded-lg bg-accent/10 border border-accent/30">
                <p className="text-[13px] text-accent font-medium">
                  Build complete! {compatibility?.compatible ? 'All components are compatible.' : 'Check compatibility issues above.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
