"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Container } from './Container';
import { FileAudio, Github } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Upload' },
    { href: '/notes', label: 'Past Notes' },
    { href: '/architecture', label: 'Architecture' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="bg-primary/20 p-2 rounded-lg">
              <FileAudio className="h-6 w-6 text-primary" />
            </div>
            <span className="font-bold text-xl tracking-tight text-white">AudioNotes</span>
          </Link>
          
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href} 
                  className={`relative transition-colors hover:text-primary ${
                    isActive ? 'text-white' : 'text-slate-300'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-gradient-to-r from-primary to-blue-500 rounded-t-full" />
                  )}
                </Link>
              );
            })}
            <a 
              href="https://github.com/prateek31-ops/Gnani_ai_project" 
              target="_blank" 
              rel="noreferrer"
              className="text-slate-300 hover:text-white transition-colors ml-4 border-l border-slate-700 pl-4"
            >
              <Github className="w-5 h-5" />
            </a>
          </nav>
        </div>
      </Container>
    </header>
  );
}
