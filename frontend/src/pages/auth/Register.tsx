import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Icon } from '../../components/ui/Icons';
import { motion } from 'framer-motion';
import { ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_ICONS, ROLE_COLORS_INLINE, ROLE_STAT_COLORS } from '../../constants';
import { registerStep1Schema, type RegisterStep1Data } from '../../schemas/validation';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

const steps = [
  { id: 'account', label: 'Account', icon: 'user' },
  { id: 'profile', label: 'Profile', icon: 'user' },
  { id: 'blood', label: 'Blood Info', icon: 'droplet' },
  { id: 'health', label: 'Health', icon: 'shield' },
  { id: 'review', label: 'Review', icon: 'clipboardList' },
];

export function Register() {
  const navigate = useNavigate();
  const { register: registerUser } = useAuth();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [currentStep, setCurrentStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<RegisterStep1Data>({
    resolver: zodResolver(registerStep1Schema),
    defaultValues: {
      role: 'donor',
    },
  });

  const watchedRole = watch('role');

  const onSubmit = async (data: RegisterStep1Data) => {
    setIsLoading(true);
    try {
      await registerUser({
        ...data,
        fullName: '',
        dateOfBirth: '',
        gender: 'Male',
        phone: '',
        city: '',
      });
      notifySuccess('Account created successfully!');
      navigate('/donor/profile');
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Registration failed');
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

  const handleRoleChange = (role: 'donor' | 'recipient') => {
    setValue('role', role);
  };

  const getRoleIcon = (role: string) => {
    if (role === 'donor') {
      return (
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    return (
      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
      </svg>
    );
  };

  const getEyeIcon = (show: boolean) => {
    if (show) {
      return (
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.066 9.066 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      );
    }
    return (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-heading font-bold text-primary mb-4">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span>LifeBlood</span>
          </Link>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Create Your Account
          </h1>
          <p className="text-muted-foreground">Join the community saving lives</p>
        </motion.div>

        <div className="p-4 rounded-xl bg-background border border-border mb-8">
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
                    {index < currentStep ? (
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                    ) : (
                      index + 1
                    )}
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
        </div>

        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Step {currentStep + 1}: {steps[currentStep].label}</h2>
            <p className="text-muted-foreground">
              {currentStep === 0 && 'Create your login credentials'}
              {currentStep === 1 && 'Enter your personal information'}
              {currentStep === 2 && 'Provide your blood details'}
              {currentStep === 3 && 'Complete health screening'}
              {currentStep === 4 && 'Review and submit your registration'}
            </p>
          </div>
          <CardContent>
            <AnimatePresence mode="wait">
              {currentStep === 0 && (
                <motion.div
                  key="account"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <fieldset>
                      <legend className="text-sm font-medium text-foreground mb-4">I want to</legend>
                      <div className="grid grid-cols-2 gap-4">
                        {ROLES.slice(0, 2).map((role) => (
                          <button
                            key={role}
                            type="button"
                            onClick={() => handleRoleChange(role as 'donor' | 'recipient')}
                            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
                              watchedRole === role
                                ? `border-primary bg-primary/10`
                                : 'border-border hover:border-primary/50'
                            }`}
                          >
                            <input
                              type="radio"
                              name="role"
                              value={role}
                              checked={watchedRole === role}
                              onChange={() => handleRoleChange(role as 'donor' | 'recipient')}
                              className="sr-only"
                            />
                            <div className="flex items-center gap-4">
                              <div className={`p-3 rounded-xl ${ROLE_COLORS_INLINE[role as keyof typeof ROLE_COLORS_INLINE]}`}>
                                {getRoleIcon(role)}
                              </div>
                              <div>
                                <h4 className="font-semibold text-foreground">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</h4>
                                <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </fieldset>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          placeholder="johndoe"
                          autoComplete="username"
                          {...register('username')}
                          error={errors.username?.message}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          autoComplete="email"
                          {...register('email')}
                          error={errors.email?.message}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...register('password')}
                            error={errors.password?.message}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            aria-label={showPassword ? 'Hide password' : 'Show password'}
                          >
                            {getEyeIcon(showPassword)}
                          </button>
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm Password</Label>
                        <Input
                          id="confirmPassword"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          autoComplete="new-password"
                          {...register('confirmPassword')}
                          error={errors.confirmPassword?.message}
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button type="submit" variant="default" className="flex-1" size="lg" isLoading={isLoading}>
                        <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        Continue
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}
              {currentStep === 4 && (
                <motion.div
                  key="review"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                    <div className="space-y-4">
                      <h4 className="font-semibold text-foreground">Account Information</h4>
                      <dl className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Username</dt>
                          <dd className="font-medium">{'username'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Email</dt>
                          <dd className="font-medium">{'email@example.com'}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-muted-foreground">Role</dt>
                          <dd className="font-medium">{'Donor'}</dd>
                        </div>
                      </dl>
                    </div>

                    <Button type="submit" variant="default" className="w-full" size="lg" isLoading={isLoading}>
                      <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                      Complete Registration
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      By creating an account, you agree to our{' '}
                      <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between mt-6 pt-6 border-t">
              {currentStep > 0 && (
                <Button type="button" variant="outline" onClick={prevStep}>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                  Back
                </Button>
              )}
              {currentStep < steps.length - 1 && (
                <Button type="submit" form="register-form" variant="default" size="lg" isLoading={isLoading}>
                  Continue
                  <svg className="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                </Button>
              )}
              {currentStep === steps.length - 1 && (
                <Button type="submit" form="register-form" variant="default" size="lg" isLoading={isLoading}>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                  Complete Registration
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </div>
    </div>
  );
}