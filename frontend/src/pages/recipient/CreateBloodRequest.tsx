import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Textarea } from '../../components/ui/Input';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { motion } from 'framer-motion';
import { bloodRequestSchema, type BloodRequestData } from '../../schemas/validation';
import { URGENCY_LEVELS, BLOOD_GROUPS } from '../../constants';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const steps = [
  { id: 'blood', label: 'Blood Requirement', icon: Icons.droplet },
  { id: 'location', label: 'Location', icon: Icons.mapPin },
  { id: 'details', label: 'Details', icon: Icons.clipboardList },
  { id: 'review', label: 'Review', icon: Icons.checkCircle },
];

export function CreateBloodRequest() {
  const { user } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<BloodRequestData>({
    resolver: zodResolver(bloodRequestSchema),
  });

  const watchedValues = watch();

  const onSubmit = async (data: BloodRequestData) => {
    setIsLoading(true);
    try {
      // await requestService.create(data);
      notifySuccess('Blood request created successfully!');
      reset();
      setCurrentStep(0);
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Failed to create request');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getCompatibility = (donorBg: string, recipientBg: string) => {
    const compatibility: Record<string, string[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'],
    };
    return compatibility[donorBg]?.includes(recipientBg) || false;
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Create Blood Request</h1>
          <p className="text-muted-foreground">Fill in the details to request blood</p>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className="relative flex items-center justify-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      index < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : index === currentStep
                        ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {index < currentStep ? <Icons.check className="h-5 w-5" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-5 w-full h-1 -translate-x-1/2 ${
                        index < currentStep ? 'bg-primary' : 'bg-border'
                      }`}
                    />
                  )}
                </div>
                <span className={`text-xs font-medium mt-2 ${index === currentStep ? 'text-primary' : 'text-muted-foreground'}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Step {currentStep + 1}: {steps[currentStep].label}</CardTitle>
            <CardDescription>
              {currentStep === 0 && 'Specify the blood type, units, and urgency'}
              {currentStep === 1 && 'Provide hospital and location details'}
              {currentStep === 2 && 'Add required date and additional information'}
              {currentStep === 3 && 'Review and submit your request'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="blood"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icons.droplet className="h-5 w-5 text-primary" aria-hidden="true" />
                        Blood Requirement
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="requiredBloodGroup">Blood Group *</Label>
                        <Select
                          id="requiredBloodGroup"
                          options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                          placeholder="Select blood group"
                          {...register('requiredBloodGroup')}
                          error={errors.requiredBloodGroup?.message}
                        />
                      </div>
                      <div>
                        <Label htmlFor="unitsRequired">Units Required *</Label>
                        <Input
                          id="unitsRequired"
                          type="number"
                          min="1"
                          max="10"
                          placeholder="2"
                          {...register('unitsRequired', { valueAsNumber: true })}
                          error={errors.unitsRequired?.message}
                        />
                      </div>
                      <div>
                        <Label htmlFor="urgency">Urgency *</Label>
                        <Select
                          id="urgency"
                          options={URGENCY_LEVELS.map(u => ({ value: u, label: u }))}
                          placeholder="Select urgency"
                          {...register('urgency')}
                          error={errors.urgency?.message}
                        />
                      </div>
                    </div>

                    {/* Compatibility Info */}
                    {watchedValues.requiredBloodGroup && (
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                        <h4 className="font-medium text-primary mb-2 flex items-center gap-2">
                          <Icons.info className="h-4 w-4" aria-hidden="true" />
                          Compatible Donor Blood Types
                        </h4>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'].filter(bg => {
                            const compatibility: Record<string, string[]> = {
                              'O-': ['O-'],
                              'O+': ['O+', 'O-'],
                              'A-': ['A-', 'O-'],
                              'A+': ['A+', 'A-', 'O+', 'O-'],
                              'B-': ['B-', 'O-'],
                              'B+': ['B+', 'B-', 'O+', 'O-'],
                              'AB-': ['AB-', 'A-', 'B-', 'O-'],
                              'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
                            };
                            return compatibility[watchedValues.requiredBloodGroup]?.includes(bg);
                          }).map((bg) => (
                            <BloodGroupBadge key={bg} bloodGroup={bg} size="sm" />
                          ))}
                        </div>
                      </div>
                    )}

                    <Button type="submit" variant="blood" className="w-full" size="lg" isLoading={isLoading}>
                      <Icons.arrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                      Continue
                    </Button>
                  </form>
                </motion.div>
              )}
              {currentStep === 1 && (
                <motion.div
                  key="location"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icons.mapPin className="h-5 w-5 text-primary" aria-hidden="true" />
                        Location Details
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="hospital">Hospital *</Label>
                        <Input
                          id="hospital"
                          placeholder="Wah General Hospital"
                          {...register('hospital')}
                          error={errors.hospital?.message}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="Wah Cantt"
                          {...register('city')}
                          error={errors.city?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="locationDetails">Exact Location / Ward</Label>
                      <Input
                        id="locationDetails"
                        placeholder="Ward 3, Emergency Department"
                        disabled
                      />
                    </div>
                  </form>
                </motion.div>
              )}
              {currentStep === 2 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icons.clipboardList className="h-5 w-5 text-primary" aria-hidden="true" />
                        Request Details
                      </h3>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="requiredDate">Required Date *</Label>
                        <Input
                          id="requiredDate"
                          type="date"
                          min={new Date().toISOString().split('T')[0]}
                          {...register('requiredDate')}
                          error={errors.requiredDate?.message}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="notes">Additional Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Any additional information for donors or medical staff..."
                        {...register('notes')}
                      />
                    </div>
                  </form>
                </motion.div>
              )}
              {currentStep === 3 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Icons.checkCircle className="h-5 w-5 text-primary" aria-hidden="true" />
                        Review & Submit
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle>Blood Requirement</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Blood Group</span>
                            <BloodGroupBadge bloodGroup={watchedValues.requiredBloodGroup || 'Not set'} size="md" />
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Units Required</span>
                            <span className="font-medium">{watchedValues.unitsRequired || 'Not set'} unit{watchedValues.unitsRequired > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Urgency</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${watchedValues.urgency === 'Critical' ? 'bg-red-100 text-red-700' : watchedValues.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                              {watchedValues.urgency || 'Not set'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Location</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Hospital</span>
                            <span className="font-medium">{watchedValues.hospital || 'Not set'}</span>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle>Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Required By</span>
                            <span className="font-medium">{watchedValues.requiredDate ? formatDate(watchedValues.requiredDate) : 'Not set'}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Notes</span>
                            <span className="font-medium">{watchedValues.notes || 'None'}</span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                      <p className="text-sm text-amber-800 dark:text-amber-200">
                        <Icons.alertTriangle className="mr-1 h-4 w-4 inline" aria-hidden="true" />
                        By submitting this request, you confirm that the information provided is accurate and that you understand this request will be visible to compatible donors and medical staff.
                      </p>
                    </div>

                    <Button type="submit" variant="blood" className="w-full" size="lg" isLoading={isLoading}>
                      <Icons.check className="mr-2 h-5 w-5" aria-hidden="true" />
                      Submit Blood Request
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      You can track this request in your dashboard after submission
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 pt-6 border-t">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <Icons.arrowLeft className="mr-2 h-5 w-5" aria-hidden="true" />
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="submit" form="create-request-form" variant="blood" size="lg" isLoading={isLoading}>
                  Continue
                  <Icons.arrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit" form="create-request-form" variant="blood" size="lg" isLoading={isLoading}>
                  <Icons.check className="mr-2 h-5 w-5" aria-hidden="true" />
                  Submit Request
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}