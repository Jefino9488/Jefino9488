import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                    </Button>
                </Link>
                <div className="bg-[#1e1e2e] p-8 rounded-2xl shadow-lg border border-[#313244]">
                    <h1 className="text-3xl font-bold mb-4 text-[#cba6f7]">Privacy Policy</h1>
                    <p className="text-lg text-[#cdd6f4]">
                        At Jefino's Portfolio, we take your privacy seriously. We do not collect, store, or share any personal information.
                        The purpose of this site is purely to showcase the work and projects of the developer.
                    </p>
                    <p className="mt-4 text-lg text-[#cdd6f4]">
                        As a visitor, no personal information is required to browse the website, and there are no data collection forms on the site.
                    </p>
                </div>
            </div>
        </div>
    );
}
