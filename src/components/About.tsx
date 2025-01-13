import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';

export default function About() {
    return (
        <div className="min-h-screen bg-[#11111b] text-[#cdd6f4] py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/">
                    <Button variant="ghost" className="mb-8 hover:bg-[#313244] hover:text-[#cdd6f4] transition-colors">
                        <ArrowLeft className="mr-2 h-5 w-5 text-[#89b4fa]" /> Back to Home
                    </Button>
                </Link>
                <div className="bg-[#1e1e2e] p-8 rounded-2xl shadow-lg border border-[#313244]">
                    <h1 className="text-3xl font-bold mb-4 text-[#cba6f7]">About Me</h1>
                    <p className="text-lg mb-6">
                        Welcome to my portfolio! I am Jefino, a passionate Full Stack Developer with experience in creating modern, dynamic, and efficient web applications. This site serves as a showcase for my skills, projects, and experience in the software development industry.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 text-[#f5c2e7]">What This Site Is For</h2>
                    <p className="text-lg mb-6">
                        This website is my personal portfolio and serves several purposes:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-lg">
                        <li>Showcase my skills and the technologies I work with, such as Python, Java, JavaScript, React, Tailwind CSS, Flask, and more.</li>
                        <li>Highlight my ongoing and completed projects that demonstrate my expertise in full-stack development.</li>
                        <li>Provide you with insights into my approach to building intuitive, user-friendly, and high-performance web applications.</li>
                        <li>Offer a glimpse into my thought process through blog posts, where I share my knowledge on software development and technology trends.</li>
                    </ul>
                    <h2 className="text-2xl font-semibold mb-4 text-[#f5c2e7]">My Journey as a Developer</h2>
                    <p className="text-lg mb-6">
                        I started my journey in software development with a deep interest in building efficient and scalable applications. Over the years, I have honed my skills across various technologies and platforms, from backend development with Flask and Python to creating responsive frontends using React and Tailwind CSS.
                    </p>
                    <p className="text-lg mb-6">
                        I am always eager to learn new things, whether it be the latest development tools, frameworks, or programming paradigms. My goal is to combine my love for technology with my passion for solving complex problems and delivering seamless user experiences.
                    </p>
                    <h2 className="text-2xl font-semibold mb-4 text-[#f5c2e7]">Technologies & Tools I Use</h2>
                    <p className="text-lg mb-6">
                        I work with a wide range of technologies to create full-stack applications, such as:
                    </p>
                    <ul className="list-disc pl-6 mb-6 text-lg">
                        <li>Frontend: React, Tailwind CSS, JavaScript, TypeScript</li>
                        <li>Backend: Python, Flask, Node.js</li>
                        <li>Database: MySQL, MongoDB</li>
                        <li>Version Control: Git, GitHub</li>
                        <li>Cloud: AWS, Docker, Firebase</li>
                    </ul>
                    <p className="text-lg">
                        Whether building scalable backend systems or crafting intuitive user interfaces, I always aim to write clean, maintainable, and efficient code. I am constantly pushing myself to improve and grow as a developer, and this portfolio represents my journey and the work I am most proud of.
                    </p>
                </div>
            </div>
        </div>
    );
}
