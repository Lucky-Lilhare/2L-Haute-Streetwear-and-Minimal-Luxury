import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const SizeGuideModal = () => {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useStore();
  const [unit, setUnit] = useState('inches');
  const [activeTab, setActiveTab] = useState('tops');

  if (!isSizeGuideOpen) return null;

  const topsMeasurements = [
    { size: 'XS', chestIn: '36-38', lengthIn: '27.5', shoulderIn: '19.5', chestCm: '91-96', lengthCm: '70', shoulderCm: '49.5' },
    { size: 'S', chestIn: '38-40', lengthIn: '28.5', shoulderIn: '20.5', chestCm: '96-101', lengthCm: '72', shoulderCm: '52' },
    { size: 'M', chestIn: '41-43', lengthIn: '29.5', shoulderIn: '21.5', chestCm: '104-109', lengthCm: '75', shoulderCm: '54.5' },
    { size: 'L', chestIn: '44-46', lengthIn: '30.5', shoulderIn: '22.5', chestCm: '112-117', lengthCm: '77', shoulderCm: '57' },
    { size: 'XL', chestIn: '47-49', lengthIn: '31.5', shoulderIn: '23.5', chestCm: '119-124', lengthCm: '80', shoulderCm: '60' },
    { size: '2XL (Plus)', chestIn: '50-53', lengthIn: '32.5', shoulderIn: '24.5', chestCm: '127-135', lengthCm: '82.5', shoulderCm: '62', highlight: true },
    { size: '3XL (Plus)', chestIn: '54-57', lengthIn: '33.5', shoulderIn: '25.5', chestCm: '137-145', lengthCm: '85', shoulderCm: '65', highlight: true },
  ];

  const denimMeasurements = [
    { size: '28', waistIn: '29', hipIn: '37', riseIn: '12.0', inseamIn: '32', waistCm: '74', hipCm: '94', riseCm: '30.5', inseamCm: '81' },
    { size: '30', waistIn: '31', hipIn: '39', riseIn: '12.5', inseamIn: '32', waistCm: '79', hipCm: '99', riseCm: '31.5', inseamCm: '81' },
    { size: '32', waistIn: '33', hipIn: '41', riseIn: '13.0', inseamIn: '33', waistCm: '84', hipCm: '104', riseCm: '33.0', inseamCm: '84' },
    { size: '34', waistIn: '35', hipIn: '43', riseIn: '13.5', inseamIn: '33', waistCm: '89', hipCm: '109', riseCm: '34.0', inseamCm: '84' },
    { size: '36', waistIn: '37', hipIn: '45', riseIn: '14.0', inseamIn: '34', waistCm: '94', hipCm: '114', riseCm: '35.5', inseamCm: '86' },
    { size: '2XL (38-40)', waistIn: '40', hipIn: '48', riseIn: '14.5', inseamIn: '34', waistCm: '102', hipCm: '122', riseCm: '37.0', inseamCm: '86', highlight: true },
    { size: '3XL (42-44)', waistIn: '44', hipIn: '52', riseIn: '15.0', inseamIn: '34', waistCm: '112', hipCm: '132', riseCm: '38.0', inseamCm: '86', highlight: true },
  ];

  const shoeMeasurements = [
    { us: 'US 7', uk: 'UK 6', eu: 'EU 40', cm: '25.0 cm' },
    { us: 'US 8', uk: 'UK 7', eu: 'EU 41', cm: '26.0 cm' },
    { us: 'US 9', uk: 'UK 8', eu: 'EU 42.5', cm: '27.0 cm' },
    { us: 'US 10', uk: 'UK 9', eu: 'EU 44', cm: '28.0 cm' },
    { us: 'US 11', uk: 'UK 10', eu: 'EU 45', cm: '29.0 cm' },
    { us: 'US 12', uk: 'UK 11', eu: 'EU 46', cm: '30.0 cm' },
    { us: 'US 13', uk: 'UK 12', eu: 'EU 47.5', cm: '31.0 cm' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-3xl bg-[#111116] border border-white/10 rounded-2xl shadow-dark-xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#14141A]">
          <div className="flex items-center space-x-2.5">
            <Ruler size={18} className="text-white" />
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Size Guide
              </h3>
              <p className="text-xs text-neutral-400">
                Standard & Plus Sizing (XS to 3XL)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white bg-neutral-800/80 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div className="px-6 py-3 bg-[#131317] border-b border-white/[0.06] flex flex-wrap items-center justify-between gap-3 font-medium">
          <div className="flex bg-neutral-900 p-0.5 rounded-xl border border-white/10">
            <button
              onClick={() => setActiveTab('tops')}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
                activeTab === 'tops' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tops & Outerwear
            </button>
            <button
              onClick={() => setActiveTab('denim')}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
                activeTab === 'denim' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Denim & Trousers
            </button>
            <button
              onClick={() => setActiveTab('footwear')}
              className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider transition-all ${
                activeTab === 'footwear' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Footwear
            </button>
          </div>

          {activeTab !== 'footwear' && (
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-neutral-400 font-medium">Unit:</span>
              <div className="flex bg-neutral-900 rounded-lg p-0.5 border border-white/10">
                <button
                  onClick={() => setUnit('inches')}
                  className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                    unit === 'inches' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Inches
                </button>
                <button
                  onClick={() => setUnit('cm')}
                  className={`px-2.5 py-0.5 rounded text-xs transition-colors ${
                    unit === 'cm' ? 'bg-white text-black font-semibold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  CM
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Content Table */}
        <div className="p-6 overflow-y-auto flex-1 font-sans">
          {activeTab === 'tops' && (
            <div>
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px] uppercase tracking-wider font-medium">
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Chest Width</th>
                    <th className="py-2 px-3">Body Length</th>
                    <th className="py-2 px-3">Shoulder</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-neutral-200">
                  {topsMeasurements.map((row) => (
                    <tr
                      key={row.size}
                      className={`hover:bg-white/5 transition-colors ${
                        row.highlight ? 'bg-white/5 font-semibold text-white' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium flex items-center space-x-1.5">
                        <span>{row.size}</span>
                        {row.highlight && (
                          <span className="text-[10px] bg-white/15 text-white px-1.5 py-0.2 rounded uppercase">
                            Plus
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.chestIn}"` : `${row.chestCm} cm`}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.lengthIn}"` : `${row.lengthCm} cm`}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.shoulderIn}"` : `${row.shoulderCm} cm`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <p className="mt-4 text-xs text-neutral-400">
                Silhouettes are intentionally cut with architectural dropped shoulders. Order standard size for boxy drape, or size down for tailored fit.
              </p>
            </div>
          )}

          {activeTab === 'denim' && (
            <div>
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px] uppercase tracking-wider font-medium">
                    <th className="py-2 px-3">Size</th>
                    <th className="py-2 px-3">Waist</th>
                    <th className="py-2 px-3">Hip</th>
                    <th className="py-2 px-3">Rise</th>
                    <th className="py-2 px-3">Inseam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-neutral-200">
                  {denimMeasurements.map((row) => (
                    <tr
                      key={row.size}
                      className={`hover:bg-white/5 transition-colors ${
                        row.highlight ? 'bg-white/5 font-semibold text-white' : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium">{row.size}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.waistIn}"` : `${row.waistCm} cm`}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.hipIn}"` : `${row.hipCm} cm`}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.riseIn}"` : `${row.riseCm} cm`}</td>
                      <td className="py-2.5 px-3">{unit === 'inches' ? `${row.inseamIn}"` : `${row.inseamCm} cm`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'footwear' && (
            <div>
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-neutral-400 text-[11px] uppercase tracking-wider font-medium">
                    <th className="py-2 px-3">US Size</th>
                    <th className="py-2 px-3">UK</th>
                    <th className="py-2 px-3">EU</th>
                    <th className="py-2 px-3">Footbed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.06] text-neutral-200">
                  {shoeMeasurements.map((row) => (
                    <tr key={row.us} className="hover:bg-white/5 transition-colors">
                      <td className="py-2.5 px-3 font-semibold text-white">{row.us}</td>
                      <td className="py-2.5 px-3">{row.uk}</td>
                      <td className="py-2.5 px-3">{row.eu}</td>
                      <td className="py-2.5 px-3 text-white">{row.cm}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#131317] border-t border-white/[0.06] flex items-center justify-between text-xs text-neutral-400">
          <span>Free size exchange within 30 days.</span>
          <button
            onClick={() => setIsSizeGuideOpen(false)}
            className="px-4 py-1.5 bg-white text-black font-semibold rounded-lg hover:bg-neutral-200 transition-colors text-xs uppercase tracking-wider"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
