"use client";

import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const formRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const statusRef = useRef<HTMLParagraphElement | null>(null);
  const svgScribbleRef = useRef<SVGPathElement | null>(null);

  useGSAP(() => {
    if (formRef.current) {
      gsap.fromTo(formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    }

    if (svgScribbleRef.current) {
      const path = svgScribbleRef.current;
      const length = path.getTotalLength();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
        stroke: '#8B5CF6',
        strokeWidth: 3,
        fill: 'none',
      });

      gsap.to(path, {
        strokeDashoffset: 0,
        duration: 2.5,
        ease: 'power1.inOut',
        delay: 0.7,
      });
    }
  }, { scope: formRef });

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    gsap.to(e.target, {
      borderColor: '#6a6a6a',
      boxShadow: '0 0 0 3px rgba(106, 106, 106, 0.3)',
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    gsap.to(e.target, {
      borderColor: '#4a4a4a',
      boxShadow: 'none',
      duration: 0.2,
      ease: 'power2.out'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setStatus('Envoi en cours...');
    gsap.fromTo(statusRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 });

    try {
      const response = await fetch('https://formspree.io/f/mkgznjgo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Message envoyé avec succès !');
        gsap.fromTo(statusRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
        setFormData({ name: '', email: '', message: '' });
      } else {
        setStatus(`Erreur : ${data.message || 'Quelque chose a mal tourné.'}`);
        gsap.fromTo(statusRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus('Erreur réseau. Veuillez réessayer plus tard.');
      gsap.fromTo(statusRef.current, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, delay: 0.1 });
    }
  };

  const getStatusClasses = () => {
    if (status.includes('succès')) return 'bg-green-900/20 text-green-400 border-green-600';
    if (status.includes('Erreur')) return 'bg-red-900/20 text-red-400 border-red-600';
    if (status.includes('Envoi en cours')) return 'bg-blue-900/20 text-blue-400 border-blue-600';
    return '';
  };

  return (
    <section className="bg-[#1a1a1a] text-[#e0e0e0] py-20 px-4 flex justify-center items-center min-h-[calc(100vh-160px)] overflow-hidden font-inter relative">
      <div className="absolute inset-0 flex justify-center items-center z-0 pointer-events-none">
        <svg className="w-[800px] h-[950px] max-w-full max-h-full" viewBox="0 0 550 650" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            ref={svgScribbleRef}
            d="M 50 50 C 150 20, 350 80, 450 50 C 480 40, 520 100, 500 150 C 480 250, 520 350, 500 450 C 480 550, 520 610, 450 600 C 350 580, 150 620, 50 600 C 20 580, 80 480, 50 400 C 20 320, 80 220, 50 150 C 20 100, 80 60, 50 50 Z"
          />
        </svg>
      </div>

      <div ref={formRef} className="max-w-md w-full bg-[#282828] rounded-xl p-10 shadow-lg border border-[#333] text-left relative z-10">
        <h1 className="text-4xl font-bold text-[#f0f0f0] mb-10 tracking-tight text-center relative z-20">Contactez-moi</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label htmlFor="name" className="block text-[#b0b0b0] text-base font-semibold mb-2">
              Nom :
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className="w-full p-3 rounded-lg border border-[#4a4a4a] bg-[#3a3a3a] text-[#f0f0f0] text-base outline-none transition-all duration-300 ease-out"
            />
          </div>
          <div className="mb-5">
            <label htmlFor="email" className="block text-[#b0b0b0] text-base font-semibold mb-2">
              Email :
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className="w-full p-3 rounded-lg border border-[#4a4a4a] bg-[#3a3a3a] text-[#f0f0f0] text-base outline-none transition-all duration-300 ease-out"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-[#b0b0b0] text-base font-semibold mb-2">
              Message :
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              onFocus={handleFocus}
              onBlur={handleBlur}
              required
              className="w-full p-3 rounded-lg border border-[#4a4a4a] bg-[#3a3a3a] text-[#f0f0f0] text-base min-h-[120px] resize-y outline-none transition-all duration-300 ease-out"
            ></textarea>
          </div>
          <button
            type="submit"
            ref={buttonRef}
            className="block w-full bg-[#4a4a4a] text-[#f0f0f0] py-4 px-6 rounded-lg text-lg font-semibold transition-all duration-300 ease-out border-none cursor-pointer mt-8"
            onMouseEnter={(e) => gsap.to(e.currentTarget, { backgroundColor: '#6a6a6a', y: -2, duration: 0.2, ease: 'power2.out' })}
            onMouseLeave={(e) => gsap.to(e.currentTarget, { backgroundColor: '#4a4a4a', y: 0, duration: 0.2, ease: 'power2.out' })}
          >
            Envoyer
          </button>
        </form>

        {status && (
          <p ref={statusRef} className={`mt-5 p-4 rounded-lg text-center font-semibold text-base border ${getStatusClasses()}`}>
            {status}
          </p>
        )}
      </div>
    </section>
  );
}
