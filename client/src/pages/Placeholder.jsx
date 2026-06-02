import { useParams, useLocation } from 'react-router-dom';

export default function Placeholder() {
  const location = useLocation();
  return (
    <div className="p-8 flex flex-col items-center justify-center h-full text-center">
      <h1 className="text-3xl font-bold text-industrial-orange mb-4">Under Construction</h1>
      <p className="text-gray-400">The page for <span className="text-white font-mono">{location.pathname}</span> is currently being built.</p>
    </div>
  );
}
