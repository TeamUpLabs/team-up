"use client";

import { useState, useEffect } from 'react';

export default function Stats() {
    const [counts, setCounts] = useState({
        developers: 0,
        projects: 0,
        mentors: 0,
        partners: 0
    });
    
    const targets = {
        developers: 5000,
        projects: 300,
        mentors: 120,
        partners: 50
    };
    
    useEffect(() => {
        const duration = 3000; // Animation duration in milliseconds
        const steps = 60; // Number of steps for animation
        const interval = duration / steps;
        
        let currentStep = 0;
        
        // Easing function - easeOutQuart: slows down as it approaches the end
        const easeOutQuart = (x: number): number => {
            return 1 - Math.pow(1 - x, 4);
        };
        
        const timer = setInterval(() => {
            currentStep += 1;
            const linearProgress = Math.min(currentStep / steps, 1);
            // Apply easing to the linear progress
            const easedProgress = easeOutQuart(linearProgress);
            
            setCounts({
                developers: Math.floor(easedProgress * targets.developers),
                projects: Math.floor(easedProgress * targets.projects),
                mentors: Math.floor(easedProgress * targets.mentors),
                partners: Math.floor(easedProgress * targets.partners)
            });
            
            if (currentStep >= steps) {
                clearInterval(timer);
            }
        }, interval);
        
        return () => clearInterval(timer);
    }, []);
    
    return (
        <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">{counts.developers >= targets.developers ? `${counts.developers/1000}K+` : counts.developers}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">개발자</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{counts.projects >= targets.projects ? `${counts.projects}+` : counts.projects}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">프로젝트</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-purple-400 mb-2">{counts.mentors >= targets.mentors ? `${counts.mentors}+` : counts.mentors}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">멘토</p>
            </div>
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-green-400 mb-2">{counts.partners >= targets.partners ? `${counts.partners}+` : counts.partners}</p>
              <p className="text-gray-400 text-sm uppercase tracking-wider">기업 파트너</p>
            </div>
          </div>
        </div>
      </section>
    )
}