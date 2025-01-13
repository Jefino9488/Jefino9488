import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                    </Button>
                </Link>
                <div className="bg-[#1e1e2e] p-8 rounded-2xl shadow-lg border border-[#313244]">
                    <h1 className="text-3xl font-bold mb-4 text-[#cba6f7]">Terms of Service</h1>
                    <p className="text-lg text-[#cdd6f4]">
                        By using Jefino's Portfolio, you agree to the following terms:
                    </p>
                    <ul className="list-disc pl-6 mt-4 text-lg text-[#cdd6f4]">
                        <li>This is a personal portfolio website and does not collect any personal data.</li>
                        <li>All content on this website is for informational and demonstration purposes only.</li>
                        <li>By browsing the site, you acknowledge that no warranty or support is offered for any of the projects listed here.</li>
                        <li>Jefino's Portfolio reserves the right to modify or update the content of the website at any time without notice.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

