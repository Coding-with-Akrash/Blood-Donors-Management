import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch'
import { Calendar } from '../../components/ui/Calendar'
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { motion } from 'framer-motion';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = ['Morning (8am-12pm)', 'Afternoon (12pm-4pm)', 'Evening (4pm-8pm)'];

const mockAvailability = {
  monday: { morning: true, afternoon: false, evening: true },
  tuesday: { morning: false, afternoon: true, evening: false },
  wednesday: { morning: true, afternoon: true, evening: false },
  thursday: { morning: false, afternoon: false, evening: true },
  friday: { morning: true, afternoon: false, evening: true },
  saturday: { morning: true, afternoon: true, evening: false },
  sunday: { morning: false, afternoon: false, evening: false },
};

const mockScheduledDonations = [
  { id: '1', date: '2024-12-15', time: 'Morning (8am-12pm)', location: 'Wah Blood Center', status: 'Confirmed' },
  { id: '2', date: '2024-12-22', time: 'Afternoon (12pm-4pm)', location: 'Islamabad Medical Center', status: 'Pending' },
];

export function DonorAvailability() {
  const [availability, setAvailability] = useState(mockAvailability);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();

  const toggleSlot = (day: string, slot: string) => {
    setAvailability(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [slot.toLowerCase().replace(/[^a-z]/g, '')]: !availability[day as keyof typeof availability][slot.toLowerCase().replace(/[^a-z]/g, '') as keyof typeof availability.monday]
      }
    }));
  };

  const getSlotKey = (slot: string) => {
    return slot.toLowerCase().replace(/[^a-z]/g, '');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Availability</h1>
          <p className="text-muted-foreground">Manage when you're available to donate</p>
        </div>
        <Button variant="blood" size="lg" onClick={() => setShowCalendar(true)}>
          <Icons.calendar className="mr-2 h-5 w-5" aria-hidden="true" />
          Schedule Donation
        </Button>
      </motion.div>

      {/* Weekly Schedule */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Weekly Availability</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-6">
              Select the days and times you're typically available to donate. This helps blood centers match you with requests.
            </p>
            <div className="space-y-4">
              {daysOfWeek.map((day, index) => {
                const dayKey = day.toLowerCase();
                const slots = availability[dayKey as keyof typeof availability];
                return (
                  <motion.div
                    key={day}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <span className="w-24 font-medium text-foreground capitalize">{day}</span>
                        <div className="flex items-center gap-2">
                          {timeSlots.map((slot) => {
                            const slotKey = getSlotKey(slot);
                            const isActive = slots[slotKey as keyof typeof slots];
                            return (
                              <Button
                                key={slot}
                                variant={isActive ? 'blood' : 'outline'}
                                size="sm"
                                onClick={() => toggleSlot(dayKey, slot)}
                                className="whitespace-nowrap"
                              >
                                {slot.split(' ')[0]}
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={Object.values(slots).some(v => v)}
                          onCheckedChange={(checked) => {
                            if (!checked) {
                              setAvailability(prev => ({
                                ...prev,
                                [dayKey]: { morning: false, afternoon: false, evening: false }
                              }));
                            }
                          }}
                        />
                        <span className="text-sm text-muted-foreground">Available</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Preferred Centers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Preferred Donation Centers</CardTitle>
              <Button variant="outline" size="sm">
                <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Add Center
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { name: 'Wah Blood Center', address: 'Wah Cantt', distance: '3.2 km', preferred: true },
                { name: 'Islamabad Medical Center', address: 'Islamabad', distance: '28.7 km', preferred: false },
                { name: 'Rawalpindi Blood Bank', address: 'Rawalpindi', distance: '12.5 km', preferred: false },
              ].map((center, i) => (
                <motion.div
                  key={center.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10 text-primary">
                      <Icons.mapPin className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{center.name}</p>
                      <p className="text-sm text-muted-foreground">{center.address} • {center.distance}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {center.preferred && (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary">
                        Preferred
                      </span>
                    )}
                    <Button variant="ghost" size="sm">
                      <Icons.moreHorizontal className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Scheduled Donations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Scheduled Donations</CardTitle>
              <Button variant="blood" size="sm" onClick={() => setShowCalendar(true)}>
                <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
                Schedule New
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {mockScheduledDonations.length === 0 ? (
              <div className="text-center py-8">
                <Icons.calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
                <h3 className="font-medium text-foreground mb-1">No donations scheduled</h3>
                <p className="text-sm text-muted-foreground mb-4">Schedule your next donation appointment</p>
                <Button variant="blood" onClick={() => setShowCalendar(true)}>
                  <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Schedule Donation
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {mockScheduledDonations.map((donation) => (
                  <motion.div
                    key={donation.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Icons.calendar className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{formatDate(donation.date)} • {donation.time}</p>
                        <p className="text-sm text-muted-foreground">{donation.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {donation.status}
                      </span>
                      <Button variant="ghost" size="sm">
                        <Icons.moreHorizontal className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Calendar Dialog */}
      <Dialog open={showCalendar} onOpenChange={setShowCalendar}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Schedule Donation</DialogTitle>
            <DialogDescription>Select a date and time for your donation appointment</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="donationDate">Preferred Date</Label>
              <Input
                id="donationDate"
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={selectedDate ? formatDate(selectedDate) : ''}
                onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
              />
            </div>
            <div>
              <Label htmlFor="donationTime">Preferred Time</Label>
              <Select
                id="donationTime"
                options={timeSlots.map(s => ({ value: s, label: s }))}
                placeholder="Select time slot"
              />
            </div>
            <div>
              <Label htmlFor="donationLocation">Preferred Location</Label>
              <Select
                id="donationLocation"
                options={[
                  { value: 'wah', label: 'Wah Blood Center (3.2 km)' },
                  { value: 'islamabad', label: 'Islamabad Medical Center (28.7 km)' },
                  { value: 'rawalpindi', label: 'Rawalpindi Blood Bank (12.5 km)' },
                ]}
                placeholder="Select location"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCalendar(false)}>Cancel</Button>
            <Button variant="blood" onClick={() => { setShowCalendar(false); /* schedule */ }}>
              <Icons.calendar className="mr-2 h-4 w-4" aria-hidden="true" />
              Schedule Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}