import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icons';
import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Create Your Account',
    description: 'Register as a donor or recipient in minutes. Provide basic information and verify your identity.',
    details: [
      'Choose your role: Donor or Recipient',
      'Fill in personal and contact details',
      'Verify email and phone number',
      'Complete medical screening (donors only)',
    ],
    icon: 'user',
  },
  {
    number: '02',
    title: 'Donate or Request Blood',
    description: 'Schedule a donation appointment or create a blood request. Our system finds compatible matches instantly.',
    details: [
      'Donors: Book appointments at nearby centers',
      'Recipients: Specify blood type, units, urgency',
      'Smart matching finds compatible donors',
      'Real-time status updates',
    ],
    icon: 'heartHandshake',
  },
  {
    number: '03',
    title: 'Save a Life',
    description: 'Your donation reaches patients in need. Track your impact and earn recognition for your generosity.',
    details: [
      'Donations tested and processed safely',
      'Blood delivered to hospitals in need',
      'Receive updates on your donation impact',
      'Earn badges and certificates',
    ],
    icon: 'award',
  },
];

export function HowItWorks() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            How It Works
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to connect donors with people who need blood
          </p>
        </motion.div>

        <div className="space-y-12">
          {steps.map((step, i) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`flex flex-col lg:flex-row gap-8 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary lg:self-center">
                <Icon name={step.icon} className="h-10 w-10" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl lg:text-4xl font-heading font-bold text-primary/20">{step.number}</span>
                  <h2 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">{step.title}</h2>
                </div>
                <p className="text-lg text-muted-foreground mb-6">{step.description}</p>
                <ul className="space-y-2">
                  {step.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-3 text-muted-foreground">
                      <svg className="h-5 w-5 text-red-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center pt-8 border-t"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of people saving lives through LifeBlood
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button className="px-8 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Become a Donor
              </button>
              <button className="px-8 py-3 border border-input rounded-lg hover:bg-muted transition-colors font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                Need Blood?
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}