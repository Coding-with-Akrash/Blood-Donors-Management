import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { Icons, Icon } from '../../components/ui/Icons';
import { BLOOD_GROUPS, BLOOD_COMPATIBILITY } from '../../constants';
import { motion } from 'framer-motion';

const compatibilityData = {
  'O-': { canDonateTo: BLOOD_GROUPS, canReceiveFrom: ['O-'] },
  'O+': { canDonateTo: ['O+', 'A+', 'B+', 'AB+'], canReceiveFrom: ['O+', 'O-'] },
  'A-': { canDonateTo: ['A+', 'A-', 'AB+', 'AB-'], canReceiveFrom: ['A-', 'O-'] },
  'A+': { canDonateTo: ['A+', 'AB+'], canReceiveFrom: ['A+', 'A-', 'O+', 'O-'] },
  'B-': { canDonateTo: ['B+', 'B-', 'AB+', 'AB-'], canReceiveFrom: ['B-', 'O-'] },
  'B+': { canDonateTo: ['B+', 'AB+'], canReceiveFrom: ['B+', 'B-', 'O+', 'O-'] },
  'AB-': { canDonateTo: ['AB+', 'AB-'], canReceiveFrom: ['AB-', 'A-', 'B-', 'O-'] },
  'AB+': { canDonateTo: ['AB+'], canReceiveFrom: BLOOD_GROUPS },
};

export function BloodCompatibility() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Blood Compatibility Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understanding which blood types are compatible helps you know who you can help and who can help you.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-600">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">How Blood Compatibility Works</h3>
                <p className="text-sm text-muted-foreground">
                  Blood types are determined by the presence or absence of certain antigens (A, B) and the Rh factor (+/-). 
                  You can only receive blood that doesn't have antigens your immune system will attack.
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Universal Donor: O-
                </h4>
                <p className="text-muted-foreground">O- blood has no A, B, or Rh antigens. Can be given to anyone in emergencies.</p>
              </div>
              <div className="p-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800">
                <h4 className="font-semibold text-emerald-800 mb-2 flex items-center gap-2">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Universal Recipient: AB+
                </h4>
                <p className="text-muted-foreground">AB+ blood has all antigens. Can receive from any blood type.</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
            Compatibility Chart
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full" role="table">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground">Your Blood Type</th>
                  <th className="text-left p-4 font-medium text-foreground">Can Donate To</th>
                  <th className="text-left p-4 font-medium text-foreground">Can Receive From</th>
                </tr>
              </thead>
              <tbody>
                {BLOOD_GROUPS.map((bloodGroup) => (
                  <tr key={bloodGroup} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="p-4 font-mono text-lg font-semibold">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{bloodGroup}</span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {compatibilityData[bloodGroup as keyof typeof compatibilityData].canDonateTo.map((bg) => (
                          <span key={bg} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{bg}</span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {compatibilityData[bloodGroup as keyof typeof compatibilityData].canReceiveFrom.map((bg) => (
                          <span key={bg} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{bg}</span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Key Facts</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: 'Rh Factor Matters',
                description: 'Rh-negative blood can be given to Rh-positive patients, but Rh-positive cannot be given to Rh-negative patients.',
                icon: 'alertTriangle',
              },
              {
                title: 'Plasma Compatibility is Reversed',
                description: 'AB plasma can be given to anyone (universal plasma donor), while O plasma can only go to O patients.',
                icon: 'droplets',
              },
              {
                title: 'Component Transfusions',
                description: 'Modern medicine often transfuses specific components (red cells, plasma, platelets) rather than whole blood, allowing more precise matching.',
                icon: 'flaskConical',
              },
            ].map((fact, i) => (
              <motion.div
                key={fact.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-muted/30"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-2">{fact.title}</h3>
                    <p className="text-sm text-muted-foreground">{fact.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}