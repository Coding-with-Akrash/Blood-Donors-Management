import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Icons } from '../../components/ui/Icons';
import { motion } from 'framer-motion';

const mockSettings = {
  general: {
    appName: 'LifeBlood',
    tagline: 'Every Drop Can Save a Life',
    supportEmail: 'support@lifeblood.org',
    maintenanceMode: false,
    registrationEnabled: true,
  },
  auth: {
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireEmailVerification: true,
    enableTwoFactor: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    donationReminders: true,
    requestAlerts: true,
    marketingEmails: false,
  },
  blood: {
    minDonorAge: 18,
    maxDonorAge: 65,
    minWeight: 50,
    donationIntervalDays: 56,
    minHemoglobinMale: 13.5,
    minHemoglobinFemale: 12.5,
  },
  system: {
    apiRateLimit: 100,
    logRetentionDays: 90,
    backupFrequency: 'daily',
    maintenanceWindow: '02:00-04:00',
  },
};

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState(mockSettings);

  const updateSetting = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: { ...prev[category], [key]: value }
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground">Configure application settings and preferences</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          Save All Changes
        </button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="blood">Blood Parameters</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Application Info</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="appName">Application Name</Label>
                    <Input id="appName" value={settings.general.appName} onChange={(e) => updateSetting('general', 'appName', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="tagline">Tagline</Label>
                    <Input id="tagline" value={settings.general.tagline} onChange={(e) => updateSetting('general', 'tagline', e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="supportEmail">Support Email</Label>
                  <Input id="supportEmail" type="email" value={settings.general.supportEmail} onChange={(e) => updateSetting('general', 'supportEmail', e.target.value)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Maintenance Mode</Label>
                    <p className="text-sm text-muted-foreground">Disable access for non-admin users</p>
                  </div>
                  <Switch checked={settings.general.maintenanceMode} onCheckedChange={(checked) => updateSetting('general', 'maintenanceMode', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Registration Enabled</Label>
                    <p className="text-sm text-muted-foreground">Allow new user registrations</p>
                  </div>
                  <Switch checked={settings.general.registrationEnabled} onCheckedChange={(checked) => updateSetting('general', 'registrationEnabled', checked)} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="auth">
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Security Settings</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                    <Input id="sessionTimeout" type="number" min="5" max="1440" value={settings.auth.sessionTimeout} onChange={(e) => updateSetting('auth', 'sessionTimeout', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                    <Input id="maxLoginAttempts" type="number" min="1" max="10" value={settings.auth.maxLoginAttempts} onChange={(e) => updateSetting('auth', 'maxLoginAttempts', parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                  <Input id="passwordMinLength" type="number" min="6" max="32" value={settings.auth.passwordMinLength} onChange={(e) => updateSetting('auth', 'passwordMinLength', parseInt(e.target.value))} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">Users must verify email before login</p>
                  </div>
                  <Switch checked={settings.auth.requireEmailVerification} onCheckedChange={(checked) => updateSetting('auth', 'requireEmailVerification', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Enable 2FA for all users</p>
                  </div>
                  <Switch checked={settings.auth.enableTwoFactor} onCheckedChange={(checked) => updateSetting('auth', 'enableTwoFactor', checked)} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send email notifications for events</p>
                  </div>
                  <Switch checked={settings.notifications.emailNotifications} onCheckedChange={(checked) => updateSetting('notifications', 'emailNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send SMS notifications for critical alerts</p>
                  </div>
                  <Switch checked={settings.notifications.smsNotifications} onCheckedChange={(checked) => updateSetting('notifications', 'smsNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Send push notifications to mobile app</p>
                  </div>
                  <Switch checked={settings.notifications.pushNotifications} onCheckedChange={(checked) => updateSetting('notifications', 'pushNotifications', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Donation Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders for eligible donations</p>
                  </div>
                  <Switch checked={settings.notifications.donationReminders} onCheckedChange={(checked) => updateSetting('notifications', 'donationReminders', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Request Alerts</Label>
                    <p className="text-sm text-muted-foreground">Alert donors for compatible requests</p>
                  </div>
                  <Switch checked={settings.notifications.requestAlerts} onCheckedChange={(checked) => updateSetting('notifications', 'requestAlerts', checked)} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Send promotional and update emails</p>
                  </div>
                  <Switch checked={settings.notifications.marketingEmails} onCheckedChange={(checked) => updateSetting('notifications', 'marketingEmails', checked)} />
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="blood">
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Donation Parameters</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minDonorAge">Minimum Donor Age</Label>
                    <Input id="minDonorAge" type="number" min="16" max="25" value={settings.blood.minDonorAge} onChange={(e) => updateSetting('blood', 'minDonorAge', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="maxDonorAge">Maximum Donor Age</Label>
                    <Input id="maxDonorAge" type="number" max="75" min="55" value={settings.blood.maxDonorAge} onChange={(e) => updateSetting('blood', 'maxDonorAge', parseInt(e.target.value))} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minWeight">Minimum Weight (kg)</Label>
                    <Input id="minWeight" type="number" min="40" max="60" value={settings.blood.minWeight} onChange={(e) => updateSetting('blood', 'minWeight', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="donationIntervalDays">Donation Interval (days)</Label>
                    <Input id="donationIntervalDays" type="number" min="28" max="84" value={settings.blood.donationIntervalDays} onChange={(e) => updateSetting('blood', 'donationIntervalDays', parseInt(e.target.value))} />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="minHemoglobinMale">Min Hemoglobin (Male) g/dL</Label>
                    <Input id="minHemoglobinMale" type="number" step="0.1" min="11" max="15" value={settings.blood.minHemoglobinMale} onChange={(e) => updateSetting('blood', 'minHemoglobinMale', parseFloat(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="minHemoglobinFemale">Min Hemoglobin (Female) g/dL</Label>
                    <Input id="minHemoglobinFemale" type="number" step="0.1" min="11" max="15" value={settings.blood.minHemoglobinFemale} onChange={(e) => updateSetting('blood', 'minHemoglobinFemale', parseFloat(e.target.value))} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="system">
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">System Configuration</h3>
              <div className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="apiRateLimit">API Rate Limit (requests/minute)</Label>
                    <Input id="apiRateLimit" type="number" min="10" max="1000" value={settings.system.apiRateLimit} onChange={(e) => updateSetting('system', 'apiRateLimit', parseInt(e.target.value))} />
                  </div>
                  <div>
                    <Label htmlFor="logRetentionDays">Log Retention (days)</Label>
                    <Input id="logRetentionDays" type="number" min="30" max="365" value={settings.system.logRetentionDays} onChange={(e) => updateSetting('system', 'logRetentionDays', parseInt(e.target.value))} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select id="backupFrequency" value={settings.system.backupFrequency} onValueChange={(val) => updateSetting('system', 'backupFrequency', val)} options={['hourly', 'daily', 'weekly'].map(v => ({ value: v, label: v }))} />
                </div>
                <div>
                  <Label htmlFor="maintenanceWindow">Maintenance Window</Label>
                  <Input id="maintenanceWindow" placeholder="02:00-04:00" value={settings.system.maintenanceWindow} onChange={(e) => updateSetting('system', 'maintenanceWindow', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Danger Zone</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-red-800">Clear All Audit Logs</h4>
                      <p className="text-sm text-red-600">Permanently delete all audit log entries older than retention period</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Clear Logs</button>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-red-800">Reset System</h4>
                      <p className="text-sm text-red-600">Reset all system settings to defaults (cannot be undone)</p>
                    </div>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Reset System</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}