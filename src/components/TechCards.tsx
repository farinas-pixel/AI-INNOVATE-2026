import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Eye, Bot, Zap, ShieldCheck, ArrowRight, X } from 'lucide-react';
import { TechMini3D } from './TechMini3D.tsx';

interface TechItem {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  highlights: string[];
  icon: React.ElementType;
  colorClass: string;
}

export const TechCards: React.FC = () => {
  const [activeModal, setActiveModal] = useState<TechItem | null>(null);

  const technologies: TechItem[] = [
    {
      id: 'artificial-intelligence',
      title: 'Artificial Intelligence',
      description: 'Foundations of intelligent systems, machine learning models, and algorithmic problem-solving.',
      longDescription: 'Explore the core principles of artificial intelligence, covering supervised and unsupervised learning, mathematical optimization, and decision-making architectures.',
      highlights: ['Machine Learning Foundations', 'Mathematical Modeling', 'Pattern Recognition'],
      icon: Brain,
      colorClass: 'text-blue-400 bg-blue-600/10 border-blue-500/20',
    },
    {
      id: 'generative-ai',
      title: 'Generative AI',
      description: 'Large language models, multimodal synthesis, and context-aware generation architectures.',
      longDescription: 'Understand how transformer-based models process text, code, audio, and images to generate structured content and power creative toolchains.',
      highlights: ['Transformer Mechanics', 'Multimodal Synthesis', 'Context & Prompting'],
      icon: Sparkles,
      colorClass: 'text-purple-400 bg-purple-600/10 border-purple-500/20',
    },
    {
      id: 'computer-vision',
      title: 'Computer Vision',
      description: 'Visual representation learning, object detection, segmentation, and real-time video understanding.',
      longDescription: 'Study modern image processing techniques, convolutional feature extractors, and vision transformers applied to scene understanding.',
      highlights: ['Object Detection', 'Image Segmentation', 'Vision Transformers'],
      icon: Eye,
      colorClass: 'text-cyan-400 bg-cyan-600/10 border-cyan-500/20',
    },
    {
      id: 'robotics',
      title: 'Robotics',
      description: 'Kinematic control, sensor fusion, embodied intelligence, and autonomous navigation systems.',
      longDescription: 'Discover how robotic systems integrate perception and control loops to operate safely and effectively in physical environments.',
      highlights: ['Kinematics & Control', 'Sensor Fusion', 'Autonomous Navigation'],
      icon: Bot,
      colorClass: 'text-indigo-400 bg-indigo-600/10 border-indigo-500/20',
    },
    {
      id: 'edge-ai',
      title: 'Edge AI',
      description: 'On-device inference, lightweight model quantization, and low-latency deployment on constrained hardware.',
      longDescription: 'Examine techniques for running machine learning models efficiently on microcontrollers, mobile devices, and embedded boards.',
      highlights: ['Model Quantization', 'Embedded Inference', 'Low-Power Computing'],
      icon: Zap,
      colorClass: 'text-teal-400 bg-teal-600/10 border-teal-500/20',
    },
    {
      id: 'responsible-ai',
      title: 'Responsible AI',
      description: 'Fairness, interpretability, alignment safety protocols, and privacy-preserving data governance.',
      longDescription: 'Investigate ethical considerations, algorithmic bias mitigation, and safety principles essential for trustworthy AI deployment.',
      highlights: ['Algorithmic Fairness', 'Model Interpretability', 'Privacy & Data Governance'],
      icon: ShieldCheck,
      colorClass: 'text-emerald-400 bg-emerald-600/10 border-emerald-500/20',
    },
  ];

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && activeModal) {
        setActiveModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModal]);

  return (
    <section id="technologies" className="py-20 lg:py-28 relative bg-[#07111F] border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-16 text-left">
          <div className="text-xs sm:text-sm font-semibold text-cyan-400 uppercase tracking-widest mb-3">
            Technology Focus Areas
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Six foundational pillars of modern AI.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
            The symposium explores these complementary domains through keynote sessions, technical
            walkthroughs, and student project showcases.
          </p>
        </div>

        {/* 6 Clean Refined Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {technologies.map((tech) => {
            const Icon = tech.icon;
            return (
              <div
                key={tech.id}
                data-card="tech-card"
                className="group p-7 rounded-2xl bg-[#0B172A] border border-white/10 hover:border-cyan-500/40 hover:-translate-y-1 shadow-lg hover:shadow-cyan-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <div
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${tech.colorClass}`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    {/* Micro 3D Wireframe */}
                    <TechMini3D type={tech.id} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {tech.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed mb-6">
                    {tech.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setActiveModal(tech)}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                    aria-label={`Explore more about ${tech.title}`}
                  >
                    <span>Explore Track</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Accessible Detail Modal */}
      {activeModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="tech-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
          onClick={() => setActiveModal(null)}
        >
          <div
            className="relative w-full max-w-xl bg-[#0B172A] border border-white/15 rounded-2xl p-6 sm:p-8 shadow-2xl text-left"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-xs font-semibold text-cyan-400 uppercase tracking-widest mb-2">
              Technology Focus
            </div>
            <h3 id="tech-modal-title" className="text-2xl font-bold text-white mb-3">
              {activeModal.title}
            </h3>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              {activeModal.longDescription}
            </p>

            <div className="mb-6">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Key Topics Covered
              </div>
              <div className="flex flex-wrap gap-2">
                {activeModal.highlights.map((item, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-white/5 border border-white/10 rounded-lg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
