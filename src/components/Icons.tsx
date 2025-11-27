// Colored tech stack icons with brand colors

export const ReactIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="2" fill="#61DAFB" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1.5" fill="none" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="8" ry="3" stroke="#61DAFB" strokeWidth="1.5" fill="none" transform="rotate(120 12 12)" />
    </svg>
);

export const NodeIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L4 6.5V17.5L12 22L20 17.5V6.5L12 2Z" fill="#339933" stroke="#339933" strokeWidth="1.5" />
        <path d="M12 12V22" stroke="#fff" strokeWidth="1" opacity="0.8" />
        <path d="M4 6.5L12 12L20 6.5" stroke="#fff" strokeWidth="1" opacity="0.8" />
    </svg>
);

export const ExpressIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="3" y="3" width="18" height="18" rx="2" fill="#FFFFFF" />
        <path d="M7 12H17M7 12L10 9M7 12L10 15" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

export const SpringIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="10" fill="#6DB33F" />
        <path d="M8 12C8 12 10 8 12 8C14 8 16 12 16 12C16 12 14 16 12 16C10 16 8 12 8 12Z" fill="#FFFFFF" />
        <circle cx="12" cy="12" r="2" fill="#6DB33F" />
    </svg>
);

export const JavaIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="5" y="5" width="14" height="14" rx="2" fill="#007396" />
        <path d="M10 10V14C10 14 10 15 11 15H13C14 15 14 14 14 14V10" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="9" y1="17" x2="15" y2="17" stroke="#F89820" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const NotionIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <rect x="4" y="4" width="16" height="16" rx="2" fill="#FFFFFF" stroke="#000000" strokeWidth="1.5" />
        <path d="M8 8L16 16M8 16L16 8" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const GitIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M21.62 11.11L12.89 2.38C12.4 1.89 11.6 1.89 11.11 2.38L9.27 4.22L11.54 6.49C12.04 6.31 12.62 6.42 13.01 6.81C13.4 7.2 13.51 7.78 13.33 8.28L15.5 10.45C16 10.27 16.58 10.38 16.97 10.77C17.55 11.35 17.55 12.28 16.97 12.86C16.39 13.44 15.46 13.44 14.88 12.86C14.46 12.44 14.37 11.81 14.6 11.31L12.56 9.27V15.57C12.72 15.65 12.87 15.76 13 15.89C13.58 16.47 13.58 17.4 13 17.98C12.42 18.56 11.49 18.56 10.91 17.98C10.33 17.4 10.33 16.47 10.91 15.89C11.08 15.72 11.28 15.6 11.5 15.52V9.17C11.28 9.09 11.08 8.97 10.91 8.8C10.49 8.38 10.4 7.75 10.63 7.25L8.39 5.01L2.38 11.11C1.89 11.6 1.89 12.4 2.38 12.89L11.11 21.62C11.6 22.11 12.4 22.11 12.89 21.62L21.62 12.89C22.11 12.4 22.11 11.6 21.62 11.11Z" fill="#F05032" />
    </svg>
);

export const GitHubIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12C2 16.42 4.865 20.165 8.839 21.489C9.339 21.579 9.521 21.269 9.521 21C9.521 20.759 9.512 20.049 9.507 19.099C6.726 19.694 6.139 17.68 6.139 17.68C5.685 16.52 5.03 16.211 5.03 16.211C4.121 15.599 5.097 15.611 5.097 15.611C6.101 15.681 6.629 16.631 6.629 16.631C7.521 18.161 8.97 17.721 9.539 17.461C9.631 16.821 9.889 16.381 10.175 16.131C7.955 15.879 5.62 15.039 5.62 11.199C5.62 10.099 6.01 9.199 6.649 8.499C6.546 8.246 6.203 7.251 6.747 5.881C6.747 5.881 7.586 5.609 9.496 6.879C10.294 6.659 11.147 6.549 12 6.545C12.853 6.549 13.706 6.659 14.504 6.879C16.414 5.609 17.251 5.881 17.251 5.881C17.797 7.251 17.454 8.246 17.351 8.499C17.991 9.199 18.38 10.099 18.38 11.199C18.38 15.049 16.04 15.875 13.813 16.123C14.172 16.433 14.491 17.045 14.491 18.001C14.491 19.371 14.48 20.479 14.48 20.999C14.48 21.271 14.659 21.583 15.167 21.487C19.137 20.161 22 16.418 22 12C22 6.477 17.523 2 12 2Z" fill="#FFFFFF" />
    </svg>
);

export const VercelIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 3L3 21H21L12 3Z" fill="#FFFFFF" />
    </svg>
);

export const NetlifyIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <path d="M12 2L4 7V17L12 22L20 17V7L12 2Z" fill="#00C7B7" />
        <path d="M12 8V16M8 12H16" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

export const RenderIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
        <circle cx="12" cy="12" r="10" fill="#46E3B7" />
        <path d="M9 12L12 9L15 12M12 15V9" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);
