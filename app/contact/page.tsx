
'use client'
import React, { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(''); // Pour afficher le statut de l'envoi (succès, erreur, envoi en cours)

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement par défaut de la page

    setStatus('Envoi en cours...'); // Indique que l'envoi est en cours

    try {
      const response = await fetch('https://formspree.io/f/mkgznjgo', { // Cible l'API Route que nous allons créer
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Récupère la réponse de l'API

      if (response.ok) {
        setStatus('Message envoyé avec succès !');
        setFormData({ name: '', email: '', message: '' }); // Réinitialise les champs du formulaire
      } else {
        setStatus(`Erreur : ${data.message || 'Quelque chose a mal tourné.'}`);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du formulaire:', error);
      setStatus('Erreur réseau. Veuillez réessayer plus tard.');
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md mx-auto my-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Contactez-moi</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-5">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">
            Nom :
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email :
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">
            Message :
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            value={formData.message}
            onChange={handleChange}
            required
            className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 ease-in-out transform hover:scale-105"
        >
          Envoyer
        </button>
      </form>

      {/* Affichage du statut du formulaire */}
      {status && (
        <p
          className={`mt-6 p-3 rounded-md text-center font-semibold
            ${status.includes('succès') ? 'bg-green-100 text-green-700 border border-green-400' : ''}
            ${status.includes('Erreur') ? 'bg-red-100 text-red-700 border border-red-400' : ''}
            ${status.includes('Envoi en cours') ? 'bg-blue-100 text-blue-700 border border-blue-400' : ''}
          `}
        >
          {status}
        </p>
      )}
    </div>
  );
}