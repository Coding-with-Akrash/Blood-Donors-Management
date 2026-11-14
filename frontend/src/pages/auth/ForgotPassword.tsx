import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { motion } from 'framer-motion';
import { forgotPasswordSchema, type ForgotPasswordData } from '../../schemas/validation';
import { useNotification } from '../../contexts/NotificationContext';

export function ForgotPassword() {
  const navigate = useNavigate();
  const { success: notifySuccess, error: notifyError } = useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitted(true);
      notifySuccess('If the email exists, a reset link has been sent');
    } catch (err) {
      notifyError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-3xl font-heading font-bold text-primary mb-4">
            <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            <span>LifeBlood</span>
          </Link>
          <h1 className="text-2xl font-heading font-bold text-foreground">Forgot Password?</h1>
          <p className="text-muted-foreground mt-2">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-foreground">Reset Password</h2>
            <p className="text-muted-foreground">We'll send a secure link to your email</p>
          </div>
          <CardContent>
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto mb-6 w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Check Your Email</h3>
                <p className="text-muted-foreground mb-6">
                  If an account exists for that email, you'll receive a password reset link shortly.
                </p>
                <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium" onClick={() => navigate('/login')}>
                  Back to Sign In
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    {...register('email')}
                    error={errors.email?.message}
                    disabled={isLoading}
                  />
                </div>

                <button type="submit" className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary-hover transition-colors font-medium" disabled={isLoading}>
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                  Send Reset Link
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{' '}
                  <Link to="/login" className="font-medium text-primary hover:underline">
                    Sign In
                  </Link>
                </p>
              </form>
            )}
          </CardContent>
        </div>
      </motion.div>
    </div>
  );
}