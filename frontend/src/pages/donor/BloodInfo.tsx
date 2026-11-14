import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Icons } from '../../components/ui/Icons';
import { BLOOD_COMPATIBILITY } from '../../constants';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const bloodFacts = [
  { title: 'Blood Volume', value: '~5 liters', description: 'Average adult has about 5 liters of blood' },
  { title: 'Donation Amount', value: '450-500ml', description: 'Standard whole blood donation' },
  { title: 'Regeneration', value: '24-48 hours', description: 'Plasma volume replenishes quickly' },
  { title: 'Red Cells', value: '4-6 weeks', description: 'Red blood cells take longer to regenerate' },
];

const compatibleGroups = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  'AB-': ['A-', 'B-', 'AB-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-'],
};

export function DonorBloodInfo() {
  const { user } = useAuth();
  const bloodGroup = user?.donorProfile?.bloodGroup || 'O+';
  const rhFactor = user?.donorProfile?.rhFactor || 'Positive';
  const canDonateTo = compatibleGroups[bloodGroup as keyof typeof compatibleGroups] || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">My Blood Information</h1>
          <p className="text-muted-foreground">View your blood type details and compatibility</p>
        </div>
        <BloodGroupBadge bloodGroup={bloodGroup} size="xl" />
      </motion.div>

      {/* Main Blood Info Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Blood Type Details</CardTitle>
            <div className="p-4 rounded-2xl bg-primary/10 text-primary">
              <Icons.droplet className="h-6 w-6" aria-hidden="true" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <BloodGroupBadge bloodGroup={bloodGroup} size="xl" className="mb-3" />
                <p className="text-sm text-muted-foreground">Your Blood Type</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <div className="text-3xl font-heading font-bold text-foreground mb-1">{rhFactor}</div>
                <p className="text-sm text-muted-foreground">Rh Factor</p>
              </div>
              <div className="text-center p-6 rounded-xl bg-muted/30">
                <div className="text-3xl font-heading font-bold text-primary mb-1">
                  {canDonateTo.length} Types
                </div>
                <p className="text-sm text-muted-foreground">Can Donate To</p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-4">Compatibility</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Your {bloodGroup} blood can be donated to the following blood types:
              </p>
              <div className="flex flex-wrap gap-2">
                {canDonateTo.map((bg) => (
                  <BloodGroupBadge key={bg} bloodGroup={bg} size="md" className={bg === bloodGroup ? 'ring-2 ring-primary' : ''} />
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                {bg === bloodGroup ? 'Highlighted: your exact match' : ''}
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Blood Facts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {bloodFacts.map((fact, i) => (
          <motion.div
            key={fact.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="text-2xl font-heading font-bold text-primary mb-1">{fact.value}</div>
                <p className="font-medium text-foreground mb-1">{fact.title}</p>
                <p className="text-sm text-muted-foreground">{fact.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Compatibility Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Full Compatibility Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full" role="table">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-semibold text-foreground">Recipient Blood Type</th>
                    <th className="text-left p-4 font-semibold text-foreground">Can Receive From</th>
                    <th className="text-left p-4 font-semibold text-foreground">Your Compatibility</th>
                  </tr>
                </thead>
                <tbody>
                  {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((recipient) => (
                    <tr key={recipient} className="border-b border-border/50 hover:bg-muted/30">
                      <td className="p-4">
                        <BloodGroupBadge bloodGroup={recipient} size="md" />
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {BLOOD_COMPATIBILITY[recipient as keyof typeof BLOOD_COMPATIBILITY].map((bg) => (
                            <BloodGroupBadge key={bg} bloodGroup={bg} size="sm" />
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {canDonateTo.includes(recipient) ? (
                            <>
                              <Icons.checkCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                              <span className="text-emerald-600 font-medium">Compatible</span>
                            </>
                          ) : (
                            <>
                              <Icons.xCircle className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                              <span className="text-muted-foreground">Not compatible</span>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Educational Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>About Your Blood Type</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {bloodGroup === 'O-' && (
              <>
                <p className="text-muted-foreground">
                  You have the <strong className="text-foreground">universal donor</strong> blood type.
                  Your red blood cells can be given to anyone in emergency situations.
                </p>
                <p className="text-muted-foreground">
                  Only about 7% of the population has O- blood, making it rare and valuable.
                </p>
              </>
            )}
            {bloodGroup === 'O+' && (
              <>
                <p className="text-muted-foreground">
                  You have the <strong className="text-foreground">most common</strong> blood type.
                  About 37% of the population has O+ blood.
                </p>
                <p className="text-muted-foreground">
                  You can donate to all Rh-positive blood types (A+, B+, AB+, O+).
                </p>
              </>
            )}
            {bloodGroup === 'AB+' && (
              <>
                <p className="text-muted-foreground">
                  You have the <strong className="text-foreground">universal recipient</strong> blood type.
                  You can receive red blood cells from any blood type.
                </p>
                <p className="text-muted-foreground">
                  However, your red blood cells can only be given to other AB+ patients.
                </p>
              </>
            )}
            {bloodGroup === 'AB-' && (
              <>
                <p className="text-muted-foreground">
                  You have one of the <strong className="text-foreground">rarest</strong> blood types.
                  Only about 1% of the population has AB- blood.
                </p>
                <p className="text-muted-foreground">
                  You can donate to AB+ and AB- patients.
                </p>
              </>
            )}
            {['A+', 'A-', 'B+', 'B-'].includes(bloodGroup) && (
              <>
                <p className="text-muted-foreground">
                  Your blood type is <strong className="text-foreground">{bloodGroup}</strong>.
                  You can donate to {canDonateTo.length} different blood types.
                </p>
                <p className="text-muted-foreground">
                  {bloodGroup.startsWith('A') 
                    ? 'Type A blood has A antigens on red cells and B antibodies in plasma.'
                    : 'Type B blood has B antigens on red cells and A antibodies in plasma.'
                  }
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Donation Eligibility</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {[
                { label: 'Age', value: '18-65 years', met: true },
                { label: 'Weight', value: '≥ 50 kg (110 lbs)', met: true },
                { label: 'Hemoglobin', value: '≥ 12.5 g/dL (women) / ≥ 13.5 g/dL (men)', met: true },
                { label: 'Last Donation', value: '≥ 56 days ago', met: true },
                { label: 'Health Status', value: 'Good general health', met: true },
                { label: 'No Recent Tattoos', value: '≥ 6 months', met: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <span className="text-sm text-muted-foreground">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{item.value}</span>
                    {item.met ? (
                      <Icons.checkCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                    ) : (
                      <Icons.xCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}