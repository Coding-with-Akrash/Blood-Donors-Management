import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Icons } from '../../components/ui/Icons';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../constants';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '../../utils/cn';

const mockDonors = [
  { id: '1', name: 'Ahmed Khan', bloodGroup: 'O+', location: 'Wah Cantt', distance: '2.3 km', available: true, lastDonation: '2024-11-15' },
  { id: '2', name: 'Ali Hassan', bloodGroup: 'O-', location: 'Wah Cantt', distance: '4.1 km', available: true, lastDonation: '2024-10-20' },
  { id: '3', name: 'Sara Ahmed', bloodGroup: 'O+', location: 'Rawalpindi', distance: '12.5 km', available: false, lastDonation: '2024-09-10' },
  { id: '4', name: 'Fatima Ali', bloodGroup: 'A-', location: 'Islamabad', distance: '28.7 km', available: true, lastDonation: '2024-11-05' },
  { id: '5', name: 'Hassan Raza', bloodGroup: 'O-', location: 'Taxila', distance: '8.4 km', available: true, lastDonation: '2024-10-01' },
];

export function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [results, setResults] = useState<Array<typeof mockDonors[0]>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bloodGroup || !location) return;
    
    setIsSearching(true);
    setSearchPerformed(true);
    
    setTimeout(() => {
      const filtered = mockDonors.filter(d => 
        (!bloodGroup || d.bloodGroup === bloodGroup) &&
        (!location || d.location.toLowerCase().includes(location.toLowerCase()))
      );
      setResults(filtered);
      setIsSearching(false);
    }, 1000);
  };

  const getCompatibility = (donorBg: string, recipientBg: string) => {
    const compatibility: Record<string, string[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'O-'],
      'A+': ['A+', 'A-', 'O+', 'O-'],
      'B-': ['B-', 'O-'],
      'B+': ['B+', 'B-', 'O+', 'O-'],
      'AB-': ['AB-', 'A-', 'B-', 'O-'],
      'AB+': BLOOD_GROUPS,
    };
    return compatibility[bloodGroup]?.includes(donorBg) || false;
  };

  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Find Blood
          </h1>
          <p className="text-lg text-muted-foreground">
            Search for compatible blood donors in your area
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-primary/20">
            <CardContent className="p-6 lg:p-8">
              <form onSubmit={handleSearch} className="space-y-4">
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="bloodGroup" className="block text-sm font-medium text-foreground mb-2">
                      Blood Group <span className="text-destructive">*</span>
                    </label>
                    <Select
                      id="bloodGroup"
                      value={bloodGroup}
                      onValueChange={setBloodGroup}
                      placeholder="Select blood group"
                      options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))}
                    />
                  </div>
                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                      Location <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="City or area"
                    />
                  </div>
                  <div className="flex items-end">
                    <label htmlFor="urgency" className="block text-sm font-medium text-foreground mb-2 w-full">
                      Urgency
                    </label>
                    <Select
                      id="urgency"
                      value={urgency}
                      onValueChange={setUrgency}
                      placeholder="Urgency level"
                      options={URGENCY_LEVELS.map(u => ({ value: u, label: u }))}
                    />
                  </div>
                </div>
                <Button type="submit" variant="blood" size="xl" className="w-full" disabled={isSearching || !bloodGroup || !location}>
                  {isSearching ? (
                    <>
                      <Icons.loader className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Icons.search className="mr-2 h-5 w-5" aria-hidden="true" />
                      Search
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        {(searchPerformed || isSearching) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                <Icons.droplet className="h-5 w-5 text-primary" aria-hidden="true" />
                {isSearching ? 'Searching...' : `Found ${results.length} donor(s) for ${bloodGroup}`}
              </h2>
              {results.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  Showing compatible donors near {location}
                </span>
              )}
            </div>

            <div className="grid gap-4">
              {isSearching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="flex gap-4">
                        <div className="h-12 w-12 rounded-lg bg-muted" />
                        <div className="flex-1 space-y-3">
                          <div className="h-4 w-1/3 bg-muted rounded" />
                          <div className="h-4 w-1/4 bg-muted rounded" />
                          <div className="h-4 w-1/2 bg-muted rounded" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <Icons.search className="mx-auto h-12 w-12 text-muted-foreground mb-4" aria-hidden="true" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No donors found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria or expand your location</p>
                  <Button variant="outline" onClick={() => { setBloodGroup(''); setLocation(''); setSearchPerformed(false); }}>
                    Clear Search
                  </Button>
                </div>
              ) : (
                results.map((donor) => {
                  const isCompatible = getCompatibility(donor.bloodGroup, bloodGroup);
                  return (
                    <motion.div
                      key={donor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 }}
                    >
                      <Card className={`border-l-4 ${isCompatible ? 'border-emerald-500' : 'border-gray-300'} ${!isCompatible ? 'opacity-50' : ''}`}>
                        <CardContent className="p-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                                <Icons.user className="h-6 w-6" aria-hidden="true" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <BloodGroupBadge bloodGroup={donor.bloodGroup} size="md" />
                                  <span className="font-medium text-foreground">{donor.name}</span>
                                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${donor.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                                    {donor.available ? 'Available' : 'Unavailable'}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {donor.location} \u2022 {donor.distance} \u2022 Last donation: {donor.lastDonation}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Icons.mapPin className="h-4 w-4" aria-hidden="true" />
                                <span>{donor.distance}</span>
                              </div>
                              <Button
                                variant={isCompatible && donor.available ? 'blood' : 'outline'}
                                size="sm"
                                disabled={!isCompatible || !donor.available}
                              >
                                {isCompatible && donor.available ? 'Request' : 'Unavailable'}
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}