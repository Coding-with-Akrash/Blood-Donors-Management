import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { donorProfileSchema, type DonorProfileData } from '../../schemas/validation';
import { GENDERS } from '../../constants';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export function DonorProfile() {
  const { user } = useAuth();
  const { success: notifySuccess } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<DonorProfileData>({
    resolver: zodResolver(donorProfileSchema),
    defaultValues: {
      fullName: user?.donorProfile?.fullName || '',
      dateOfBirth: user?.donorProfile?.dateOfBirth || '',
      gender: user?.donorProfile?.gender || 'Male',
      phone: user?.donorProfile?.phone || '',
      address: user?.donorProfile?.address || '',
      city: user?.donorProfile?.city || '',
      bloodGroup: user?.donorProfile?.bloodGroup || 'O+',
      rhFactor: user?.donorProfile?.rhFactor || 'Positive',
      weight: user?.donorProfile?.weight?.toString() || '',
      height: user?.donorProfile?.height?.toString() || '',
      emergencyContact: user?.donorProfile?.emergencyContact || '',
      lastDonationDate: user?.donorProfile?.lastDonationDate || '',
    },
  });

  const onSubmit = async (data: DonorProfileData) => {
    // await donorService.update(user!.id, data);
    notifySuccess('Profile updated successfully');
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      reset();
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information</p>
        </div>
        <Button variant={isEditing ? 'blood' : 'outline'} onClick={toggleEdit} size="lg">
          {isEditing ? (
            <>
              <Icons.x className="mr-2 h-5 w-5" aria-hidden="true" />
              Cancel
            </>
          ) : (
            <>
              <Icons.edit className="mr-2 h-5 w-5" aria-hidden="true" />
              Edit Profile
            </>
          )}
        </Button>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex flex-col items-center lg:items-start gap-4 lg:w-48 flex-shrink-0">
                <Avatar
                  name={user?.username || 'User'}
                  size="2xl"
                  src={avatarUrl || undefined}
                />
                <Button variant="outline" size="sm" className="w-full" disabled={!isEditing}>
                  <Icons.camera className="mr-2 h-4 w-4" aria-hidden="true" />
                  Change Photo
                </Button>
              </div>
              <div className="flex-1 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      placeholder="John Doe"
                      {...register('fullName')}
                      error={errors.fullName?.message}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      {...register('dateOfBirth')}
                      error={errors.dateOfBirth?.message}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      id="gender"
                      options={GENDERS.map(g => ({ value: g, label: g }))}
                      placeholder="Select gender"
                      {...register('gender')}
                      error={errors.gender?.message}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('phone')}
                      error={errors.phone?.message}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    placeholder="123 Main Street"
                    {...register('address')}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Wah Cantt"
                      {...register('city')}
                      error={errors.city?.message}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="emergencyContact">Emergency Contact</Label>
                    <Input
                      id="emergencyContact"
                      type="tel"
                      placeholder="+1 (555) 000-0000"
                      {...register('emergencyContact')}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Blood Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bloodGroup">Blood Group</Label>
                  <Select
                    id="bloodGroup"
                    options={[
                      'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
                    ].map(bg => ({ value: bg, label: bg }))}
                    placeholder="Select blood group"
                    {...register('bloodGroup')}
                    error={errors.bloodGroup?.message}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="rhFactor">Rh Factor</Label>
                  <Select
                    id="rhFactor"
                    options={[
                      { value: 'Positive', label: 'Positive' },
                      { value: 'Negative', label: 'Negative' },
                    ]}
                    placeholder="Select Rh factor"
                    {...register('rhFactor')}
                    error={errors.rhFactor?.message}
                    disabled={!isEditing}
                  />
                </div>
                <div className="sm:col-span-2 flex items-end">
                  <BloodGroupBadge
                    bloodGroup={watch('bloodGroup') || user?.donorProfile?.bloodGroup || 'O+'}
                    size="lg"
                    className="mt-8"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Physical Information</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="weight">Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    placeholder="70"
                    {...register('weight', { valueAsNumber: true })}
                    error={errors.weight?.message}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    {...register('height', { valueAsNumber: true })}
                    error={errors.height?.message}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="lastDonationDate">Last Donation Date</Label>
                  <Input
                    id="lastDonationDate"
                    type="date"
                    {...register('lastDonationDate')}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 border-t pt-6">
                <Button type="button" variant="outline" onClick={toggleEdit}>
                  Cancel
                </Button>
                <Button type="submit" variant="blood">
                  <Icons.save className="mr-2 h-5 w-5" aria-hidden="true" />
                  Save Changes
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}