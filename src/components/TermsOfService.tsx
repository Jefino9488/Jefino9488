import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-gray-950 text-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 hover:bg-gray-800">
                        <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
                    </Button>
                </Link>
                <div className="bg-gray-800 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-3xl font-bold mb-4">Terms of Service</h1>
                    <p className="text-lg">
                        By using Jefino's Portfolio, you agree to the following terms:
                    </p>
                    <ul className="list-disc pl-6 mt-4 text-lg">
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
