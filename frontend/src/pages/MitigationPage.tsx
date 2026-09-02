import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataService } from '../services/dataService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { ShieldCheck, Sliders, CheckCircle2, ArrowRight, ListChecks } from 'lucide-react';
import { MitigationRecommendation } from '../types';

export const MitigationPage: React.FC = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState<MitigationRecommendation[]>(
    DataService.getRecommendations()
  );
  const [selectedPlanModal, setSelectedPlanModal] = useState<MitigationRecommendation | null>(null);
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastNotice(msg);
    setTimeout(() => setToastNotice(null), 3000);
  };

  const handleToggleReviewed = (id: string) => {
    const updated = DataService.toggleRecommendationReview(id);
    setRecommendations([...updated]);
    showToast('Updated recommendation review status');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Toast Notice */}
      {toastNotice && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E3E62] border border-cyan-500 text-slate-100 text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastNotice}</span>
        </div>
      )}

      {/* Action Plan Modal */}
      <Modal
        isOpen={!!selectedPlanModal}
        onClose={() => setSelectedPlanModal(null)}
        title={selectedPlanModal?.title || 'Action Plan'}
        subtitle={`Target Location: ${selectedPlanModal?.locationName}`}
        footer={
          <button
            onClick={() => {
              setSelectedPlanModal(null);
              navigate('/what-if');
            }}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5"
          >
            <Sliders className="w-4 h-4" />
            <span>Simulate In Intervention Engine</span>
          </button>
        }
      >
        {selectedPlanModal && (
          <div className="space-y-4">
            <div className="p-3.5 rounded-xl bg-[#0B192C] border border-slate-800 text-xs space-y-1">
              <p className="font-semibold text-cyan-400">Impact Analysis:</p>
              <p className="text-slate-300">{selectedPlanModal.explanation}</p>
            </div>

            <div className="space-y-2">
              <p className="font-bold text-slate-100 flex items-center gap-1.5">
                <ListChecks className="w-4 h-4 text-emerald-400" /> Step-by-Step Municipal Execution Plan:
              </p>
              <div className="space-y-2 font-mono text-xs">
                {selectedPlanModal.actionPlan.map((step, idx) => (
                  <div key={idx} className="p-3 rounded-lg bg-[#0B192C] border border-slate-800 flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-950 text-cyan-300 font-bold flex items-center justify-center shrink-0 border border-cyan-700/50 text-[10px]">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 mt-0.5">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <span>Recommended Next Actions</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Prioritized by potential risk point reduction and affected population benefit.
          </p>
        </div>

        <button
          onClick={() => navigate('/what-if')}
          className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-950/50"
        >
          <Sliders className="w-4 h-4" />
          <span>Launch What-If Simulator</span>
        </button>
      </div>

      {/* Recommendations Cards Grid */}
      <div className="space-y-4">
        {recommendations.map(rec => (
          <Card key={rec.id} className="border-slate-700/80">
            <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 border-b border-slate-700/60 pb-3">
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <Badge level={rec.priority} />
                  <h3 className="text-base font-bold text-slate-100">{rec.title}</h3>
                  <Badge level={rec.category} variant="mode" />
                </div>
                <p className="text-xs text-slate-400">
                  Target Location: <strong className="text-slate-200">{rec.locationName}</strong> • Timeline: <span className="font-mono text-cyan-400">{rec.timeline}</span>
                </p>
              </div>

              {/* Impact Metrics Badges */}
              <div className="flex items-center gap-3 font-mono text-xs">
                <div className="p-2 rounded-lg bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
                  Estimated Impact: <strong>{rec.estimatedImpactPoints} pts</strong>
                </div>
                <div className="p-2 rounded-lg bg-[#0B192C] border border-slate-800 text-slate-200">
                  Population Benefit: <strong>{rec.populationBenefit.toLocaleString()}</strong>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div className="py-3 text-xs text-slate-300 leading-relaxed">
              {rec.explanation}
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>Complexity: <strong className="text-slate-200">{rec.complexity}</strong></span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedPlanModal(rec)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                >
                  View Action Plan
                </button>

                <button
                  onClick={() => navigate('/what-if')}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950 text-cyan-300 border border-cyan-700/50 hover:bg-cyan-900 font-semibold text-xs flex items-center gap-1 transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Simulate Action</span>
                </button>

                <button
                  onClick={() => handleToggleReviewed(rec.id)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                    rec.reviewed
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/50'
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {rec.reviewed ? 'Reviewed' : 'Mark Reviewed'}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
