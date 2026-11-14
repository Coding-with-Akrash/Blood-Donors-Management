import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Avatar } from '../../components/ui/Avatar';
import { Icons } from '../../components/ui/Icons';
import { recipientProfileSchema, type RecipientProfileData } from '../../schemas/validation';
import { GENDERS } from '../../constants';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export function RecipientProfile() {
  const { user } = useAuth();
  const { success: notifySuccess } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RecipientProfileData>({
    resolver: zodResolver(recipientProfileSchema),
    defaultValues: {
      fullName: user?.recipientProfile?.fullName || '',
      dateOfBirth: user?.recipientProfile?.dateOfBirth || '',
      gender: user?.recipientProfile?.gender || 'Male',
      phone: user?.recipientProfile?.phone || '',
      city: user?.recipientProfile?.city || '',
      hospital: user?.recipientProfile?.hospital || '',
      emergencyContact: user?.recipientProfile?.emergencyContact || '',
    },
  });

  const onSubmit = async (data: RecipientProfileData) => {
    // await recipientService.update(user!.id, data);
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
        <Button variant={isEditing ? 'outline' : 'outline'} onClick={toggleEdit} size="lg">
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
                    <Label htmlFor="hospital">Hospital (Optional)</Label>
                    <Input
                      id="hospital"
                      placeholder="Wah General Hospital"
                      {...register('hospital')}
                      disabled={!isEditing}
                    />
                  </div>
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