import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ContactPage() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSuccess(true);
    setLoading(false);
  };

  return (
    <main className=" py-16 px-4 min-h-[calc(100vh-64px)] bg-white dark:bg-zinc-900 dark:text-zinc-200">
      <div className="max-w-6xl w-full mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12 ">{t("contact.title", "Contact Us")}</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="rounded-2xl border border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-sm p-6 space-y-6 transition-all duration-300">
              <h2 className="text-2xl font-semibold">{t("contact.reachUs", "Reach Us")}</h2>
              
              <div className="space-y-4">
                <a
                  href="tel:+355691234567"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition group"
                >
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 group-hover:underline">
                    +355 68 364 8244
                  </span>
                </a>

                <a
                  href="mailto:permakinat@gmail.com"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition group"
                >
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 group-hover:underline">
                    permakinat@gmail.com
                  </span>
                </a>

                <a
                  href="https://wa.me/355683648244"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition group"
                >
                  <div className="p-2 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 group-hover:underline">
                    WhatsApp
                  </span>
                </a>

                <a
                  href="https://instagram.com/permakinat.al"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition group"
                >
                  <div className="p-2 rounded-full bg-pink-100 dark:bg-pink-900 text-pink-600 dark:text-pink-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 group-hover:underline">
                   @permakinat.al
                  </span>
                </a>

                <a
                  href="https://tiktok.com/@permakinat.al"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 transition group"
                >
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-gray-800 dark:text-gray-200 group-hover:underline">
                    @permakinat.al // @tesla.al
                  </span>
                </a>
              </div>
            </div>
          </div>         
          <div className="rounded-2xl border border-black/10 dark:border-white/20 bg-white/50 dark:bg-black/40 backdrop-blur-sm p-6 transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6">{t("contact.sendMessage", "Send us a Message")}</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.name", "Name")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.email", "Email")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t("contact.message", "Message")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent outline-none transition text-gray-900 dark:text-gray-100"
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="relative w-full px-6 py-3 text-sm font-semibold text-white bg-gray-900 dark:bg-zinc-800 rounded-lg hover:bg-gray-800 dark:hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-500 transition-all duration-200 overflow-hidden shine-metal-btn"
              >
                <span className="relative z-10">
                  {loading ? t("contact.sending", "Sending...") : t("contact.send", "Send Message")}
                </span>
                <div className="absolute inset-0 pointer-events-none z-0">
                  <span className="shine-metal-anim" />
                </div>
              </button>

              {success && (
                <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg text-sm">
                  {t("contact.success", "Message sent successfully! We'll get back to you soon.")}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
