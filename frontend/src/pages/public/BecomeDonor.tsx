import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons, Icon } from '../../components/ui/Icons';
import { BLOOD_GROUPS } from '../../constants';
import { motion } from 'framer-motion';

export function BecomeDonor() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Become a Donor
          </h1>
          <p className="text-lg text-muted-foreground">
            Your donation can save up to three lives. Join our community of life-savers today.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl bg-background border border-primary-muted">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
              Why Donate Blood?
            </h2>
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {[
                { title: 'Save Lives', description: 'One donation can help up to three patients in critical condition.' },
                { title: 'Health Benefits', description: 'Regular donation reduces iron overload and stimulates new blood cell production.' },
                { title: 'Free Health Check', description: 'Every donation includes a mini health screening and blood type testing.' },
                { title: 'Community Impact', description: 'Help maintain a stable blood supply for your local hospitals.' },
              ].map((benefit, i) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="text-center">
              <Button variant="default" size="lg" asChild>
                <Link to="/register/donor">Register as Donor Now</Link>
              </Button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6 text-center">
            Who Can Donate?
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              'Age 18-65 years (17 with parental consent)',
              'Weight at least 50 kg (110 lbs)',
              'In good general health',
              'No recent tattoos or piercings (6 months)',
              'No high-risk behaviors',
              'Hemoglobin level ≥ 12.5 g/dL (women) / ≥ 13.5 g/dL (men)',
            ].map((req, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-start gap-3 p-4 rounded-lg bg-muted/30"
              >
                <svg className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                <p className="text-sm text-muted-foreground">{req}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <div className="p-8 rounded-xl bg-primary text-primary-foreground">
            <h3 className="text-2xl font-heading font-bold mb-2">Ready to Make a Difference?</h3>
            <p className="opacity-90 mb-6">Register now and start your journey as a life-saver</p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/register/donor">Start Registration</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}