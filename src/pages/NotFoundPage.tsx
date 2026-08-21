import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/common/Card';
import { AlertCircle, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-16 max-w-lg mx-auto text-center space-y-4 animate-fadeIn">
      <Card className="p-8">
        <AlertCircle className="w-16 h-16 text-cyan-400 mx-auto mb-3 opacity-80" />
        <h2 className="text-2xl font-bold text-slate-100">404 — Route Not Found</h2>
        <p className="text-xs text-slate-400 mt-2 leading-relaxed">
          The requested environmental intelligence workspace route does not exist or has been moved.
        </p>

        <button
          onClick={() => navigate('/')}
          className="mt-6 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center justify-center gap-2 mx-auto transition-colors shadow-lg shadow-cyan-950/50"
        >
          <Home className="w-4 h-4" />
          <span>Return to Risk Overview</span>
        </button>
      </Card>
    </div>
  );
};
