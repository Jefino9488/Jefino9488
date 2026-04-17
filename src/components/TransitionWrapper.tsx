import { useLocation } from 'react-router-dom';

export default function TransitionWrapper({ children }: { children: React.ReactNode }) {
    const location = useLocation();

    return (
        <div key={location.pathname} className="min-h-screen w-full text-white">
            {children}
        </div>
    );
}
