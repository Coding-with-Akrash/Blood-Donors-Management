import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Progress } from '../../components/ui/Progress';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const eligibilityChecks = [
  { id: 'age', label: 'Age Requirement', description: '18-65 years old', status: 'passed' },
  { id: 'weight', label: 'Weight Requirement', description: 'At least 50 kg (110 lbs)', status: 'passed' },
  { id: 'hemoglobin', label: 'Hemoglobin Level', description: '≥ 12.5 g/dL (women) / ≥ 13.5 g/dL (men)', status: 'passed' },
  { id: 'interval', label: 'Donation Interval', description: 'At least 56 days since last donation', status: 'passed' },
  { id: 'health', label: 'General Health', description: 'Feeling well on donation day', status: 'passed' },
  { id: 'medical', label: 'Medical Screening', description: 'No disqualifying conditions', status: 'pending' },
  { id: 'travel', label: 'Travel History', description: 'No recent travel to restricted areas', status: 'passed' },
  { id: 'tattoo', label: 'Tattoos/Piercings', description: 'No new tattoos in last 6 months', status: 'passed' },
];

export function DonorEligibility() {
  const { user } = useAuth();
  const bloodGroup = user?.donorProfile?.bloodGroup || 'O+';
  const eligibilityStatus = user?.donorProfile?.eligibilityStatus || 'Eligible';
  const nextEligibleDate = user?.donorProfile?.nextEligibleDate || '2024-12-15';
  const lastDonationDate = user?.donorProfile?.lastDonationDate || '2024-11-15';

  const isEligible = eligibilityStatus === 'Eligible';
  const passedChecks = eligibilityChecks.filter(c => c.status === 'passed').length;
  const totalChecks = eligibilityChecks.length;
  const progress = Math.round((passedChecks / totalChecks) * 100);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donation Eligibility</h1>
          <p className="text-muted-foreground">Check your eligibility status and requirements</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="blood" size="lg">
            <a href="/donor/schedule">
              <Icons.calendar className="mr-2 h-5 w-5" aria-hidden="true" />
              Schedule Donation
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Main Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={isEligible ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10'}>
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${isEligible ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {isEligible ? <Icons.checkCircle className="h-10 w-10" /> : <Icons.clock className="h-10 w-10" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={bloodGroup} size="lg" />
                    <StatusBadge status={eligibilityStatus} size="lg" />
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {isEligible 
                      ? 'You are eligible to donate blood. Schedule your next donation!' 
                      : 'Your eligibility is being reviewed. Check back for updates.'
                    }
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icons.calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Last donation: {formatDate(lastDonationDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Next eligible: {formatDate(nextEligibleDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.droplet className="h-4 w-4" aria-hidden="true" />
                  <span>Blood type: {bloodGroup}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Progress & Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Eligibility Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Requirements Met</span>
                <span className="font-semibold text-foreground">{passedChecks} of {totalChecks}</span>
              </div>
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{progress}% Complete</span>
                <span>{totalChecks - passedChecks} remaining</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Next Donation</CardTitle>
          </CardHeader>
          <CardContent className="text-center py-4">
            <div className="text-3xl font-heading font-bold text-primary mb-1">{formatDate(nextEligibleDate)}</div>
            <p className="text-muted-foreground">Recommended next donation date</p>
            <Button asChild variant="outline" className="w-full mt-4" size="sm">
              <a href="/donor/schedule">Schedule Now</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Quick Facts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Blood Type</span>
              <span className="font-medium"><BloodGroupBadge bloodGroup={bloodGroup} size="sm" /></span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Donations</span>
              <span className="font-medium text-foreground">8</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Lives Saved</span>
              <span className="font-medium text-foreground">24</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Current Streak</span>
              <span className="font-medium text-foreground">3 donations</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Checks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Eligibility Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {eligibilityChecks.map((check) => (
                <motion.div
                  key={check.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${check.status === 'passed' ? 'bg-emerald-100 text-emerald-600' : check.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}>
                      {check.status === 'passed' ? <Icons.check className="h-5 w-5" /> : check.status === 'pending' ? <Icons.clock className="h-5 w-5" /> : <Icons.x className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{check.label}</p>
                      <p className="text-sm text-muted-foreground">{check.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {check.status === 'passed' ? (
                      <Icons.checkCircle className="h-5 w-5 text-emerald-500" aria-hidden="true" />
                    ) : check.status === 'pending' ? (
                      <Icons.clock className="h-5 w-5 text-amber-500" aria-hidden="true" />
                    ) : (
                      <Icons.xCircle className="h-5 w-5 text-red-500" aria-hidden="true" />
                    )}
                    <span className={`text-sm font-medium capitalize ${check.status === 'passed' ? 'text-emerald-600' : check.status === 'pending' ? 'text-amber-600' : 'text-red-600'}`}>
                      {check.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                <Icons.info className="mr-2 h-4 w-4 inline" aria-hidden="true" />
                <strong>Note:</strong> This is an automated preliminary assessment. Final eligibility is determined by medical staff at the time of donation. Always consult with healthcare professionals for medical advice.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Educational Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid md:grid-cols-2 gap-6"
      >
        <Card>
          <CardHeader>
            <CardTitle>Why Eligibility Matters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-muted-foreground">
              Eligibility criteria protect both donors and recipients. They ensure:
            </p>
            <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
              <li>Donor safety during and after donation</li>
              <li>Blood product quality for patients</li>
              <li>Prevention of transfusion-transmitted infections</li>
              <li>Adequate recovery time between donations</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Deferral Reasons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <ul className="space-y-2 text-muted-foreground pl-4 list-disc">
              <li>Low hemoglobin/iron levels</li>
              <li>Recent illness or infection</li>
              <li>Certain medications (blood thinners, antibiotics)</li>
              <li>Travel to malaria-endemic areas</li>
              <li>Recent tattoos or piercings (6 months)</li>
              <li>Pregnancy or recent childbirth</li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}