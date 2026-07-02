// src/app/pages/ContactPage.tsx
import { useState } from "react";

export function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");
    
    // Form data collect karna
    const formData = new FormData(e.currentTarget);
    
    // Web3Forms API Key add karna (TypeScript error fixed with 'as any')
    formData.append("access_key", (import.meta as any).env.VITE_WEB3FORMS_KEY);
    formData.append("subject", "New Contact from SinultWall"); // Email ka subject

    try {
      // Web3Forms API par data send karna
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setErrorMessage("Something went wrong. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Network error. Please check your connection.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-20 px-6 min-h-[70vh]">
      {submitted ? (
        <div className="text-center py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Thank you!</h2>
          <p className="text-gray-600">Your message has been sent. We'll get back to you shortly.</p>
          <button 
            onClick={() => setSubmitted(false)}
            className="mt-6 px-6 py-2 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors"
          >
            Send another message
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-gray-600 mb-8 leading-relaxed">
            Have questions, feedback, or a specific wallpaper request? We would love to hear from you. Please fill out the form below.
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                required
                placeholder="Name *"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow"
              />
              
              <input
                type="email"
                name="email"
                required
                placeholder="Email *"
                className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow"
              />
            </div>

            <input
              type="tel"
              name="phone"
              placeholder="Phone number"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow"
            />

            <textarea
              name="message"
              rows={5}
              required
              placeholder="Message *"
              className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-shadow resize-y"
            ></textarea>

            {errorMessage && (
              <p className="text-red-500 text-sm">{errorMessage}</p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-3 bg-black text-white font-medium rounded-md hover:bg-gray-800 transition-colors disabled:opacity-70"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}