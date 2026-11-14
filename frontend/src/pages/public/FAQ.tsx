import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '../../components/ui/Collapsible';
import { Icon } from '../../components/ui/Icons';
import { motion } from 'framer-motion';

const faqs = [
  {
    category: 'General Questions',
    items: [
      {
        question: 'What is LifeBlood?',
        answer: 'LifeBlood is a blood donation management platform that connects donors with patients in need. We make it easy to donate blood, request blood, and track the impact of your donations.',
      },
      {
        question: 'Is LifeBlood free to use?',
        answer: 'Yes, LifeBlood is completely free for donors and recipients. We are supported by partnerships with hospitals and blood centers.',
      },
      {
        question: 'How do I create an account?',
        answer: 'Click "Register" on the homepage and choose whether you want to donate blood or need blood. Follow the step-by-step registration process.',
      },
      {
        question: 'Is my personal information secure?',
        answer: 'Yes, we use industry-standard encryption and follow HIPAA guidelines to protect your health information. We never share your data without your consent.',
      },
    ],
  },
  {
    category: 'For Donors',
    items: [
      {
        question: 'Who can donate blood?',
        answer: 'Generally, you must be 18-65 years old, weigh at least 50kg (110lbs), be in good health, and meet hemoglobin requirements. Some medications or travel may temporarily defer you.',
      },
      {
        question: 'How often can I donate?',
        answer: 'You can donate whole blood every 56 days (8 weeks). Platelet donations can be made every 7 days, up to 24 times a year. Plasma can be donated every 28 days.',
      },
      {
        question: 'Does donating blood hurt?',
        answer: 'You may feel a brief pinch when the needle is inserted, but the process is generally painless. Most donors report minimal discomfort.',
      },
      {
        question: 'How long does donation take?',
        answer: 'The actual donation takes about 8-10 minutes. The entire process including screening and recovery takes about 45-60 minutes.',
      },
      {
        question: 'What happens to my blood after donation?',
        answer: 'Your blood is tested for safety, separated into components (red cells, plasma, platelets), and distributed to hospitals based on patient needs.',
      },
    ],
  },
  {
    category: 'For Recipients',
    items: [
      {
        question: 'How do I request blood?',
        answer: 'Create a recipient account, then use "Create Blood Request" to specify the blood type, units needed, urgency, and hospital location.',
      },
      {
        question: 'How quickly can I get blood?',
        answer: 'For critical requests, our system alerts compatible donors immediately. In urban areas, matches can be found within hours. Normal requests may take 24-48 hours.',
      },
      {
        question: 'Is the blood safe?',
        answer: 'All donated blood undergoes rigorous testing for infectious diseases and is processed in certified facilities following strict safety protocols.',
      },
      {
        question: 'Can I choose a specific donor?',
        answer: 'For privacy and safety reasons, donors and recipients are kept anonymous. Our system matches based on blood compatibility and location only.',
      },
    ],
  },
  {
    category: 'Technical & Account',
    items: [
      {
        question: 'I forgot my password. What should I do?',
        answer: 'Click "Forgot Password" on the login page, enter your email, and we\'ll send you a link to reset your password.',
      },
      {
        question: 'How do I update my profile?',
        answer: 'Log in and go to Settings → Profile. You can update your contact information, address, and preferences there.',
      },
      {
        question: 'Can I delete my account?',
        answer: 'Yes, go to Settings → Account → Delete Account. Note that donation history is retained for medical records as required by law.',
      },
      {
        question: 'The app isn\'t working. What should I do?',
        answer: 'Try refreshing the page or clearing your browser cache. If issues persist, contact support@lifeblood.org with details about the problem.',
      },
    ],
  },
];

export function FAQ() {
  const [openCategories, setOpenCategories] = useState<string[]>(['General Questions']);

  const toggleCategory = (category: string) => {
    setOpenCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-muted-foreground">
            Find answers to common questions about LifeBlood
          </p>
        </motion.div>

        <div className="space-y-6">
          {faqs.map((category, catIndex) => (
            <motion.div
              key={category.category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.5-4 3-2.051 0-3.372-1.343-4-3z" /></svg>
                {category.category}
              </h2>
              <div className="space-y-3">
                {category.items.map((faq, itemIndex) => (
                  <div key={faq.question} className="border border-border rounded-xl overflow-hidden">
                    <button
                      className="w-full p-6 text-left focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      onClick={() => toggleCategory(category.category)}
                    >
                      <div className="flex items-center justify-between gap-4">
                        <p className="font-medium text-foreground pr-8">{faq.question}</p>
                        <svg className={`h-5 w-5 text-muted-foreground transition-transform duration-200 ${openCategories.includes(category.category) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                      </div>
                    </button>
                    <div className="px-6 pb-6 pt-0">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground mb-4">Still have questions?</p>
          <button className="px-8 py-3 border border-input rounded-lg hover:bg-muted transition-colors">
            <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
            Contact Support
          </button>
        </motion.div>
      </div>
    </div>
  );
}