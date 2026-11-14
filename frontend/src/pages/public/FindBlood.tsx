import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icon } from '../../components/ui/Icons';
import { BLOOD_GROUPS, URGENCY_LEVELS } from '../../constants';
import { motion } from 'framer-motion';

export function FindBlood() {
  const [bloodGroup, setBloodGroup] = useState('');
  const [location, setLocation] = useState('');
  const [urgency, setUrgency] = useState('Normal');
  const [results, setResults] = useState<Array<{ id: string; bloodGroup: string; location: string; available: boolean; distance: string }>>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearchPerformed(true);
    setTimeout(() => {
      setResults([
        { id: '1', bloodGroup, location: `${location} Blood Center`, available: true, distance: '2.3 km' },
        { id: '2', bloodGroup, location: `${location} General Hospital`, available: true, distance: '4.1 km' },
        { id: '3', bloodGroup, location: `${location} Medical Center`, available: false, distance: '5.7 km' },
      ]);
      setIsSearching(false);
    }, 1000);
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
            Search for compatible blood donors and availability in your area
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6 rounded-xl bg-background border border-primary/20">
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bloodGroup" className="block text-sm font-medium text-foreground mb-2">
                    Blood Group <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="bloodGroup"
                    value={bloodGroup}
                    onChange={(e) => setBloodGroup(e.target.value)}
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="">Select blood group</option>
                    {BLOOD_GROUPS.map((bg) => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-foreground mb-2">
                    Location <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="location"
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="City or area"
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                </div>
                <div className="flex items-end">
                  <label htmlFor="urgency" className="block text-sm font-medium text-foreground mb-2 w-full">
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full h-12 rounded-lg border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  >
                    <option value="Normal">Normal</option>
                    <option value="Urgent">Urgent</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="w-full px-4 py-3 bg-red-600 text-white rounded-lg text-base font-medium hover:bg-red-700 transition-colors" disabled={isSearching || !bloodGroup || !location}>
                {isSearching ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>
        </motion.div>

        {(results.length > 0 || isSearching) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8"
          >
            <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
              <svg className="h-5 w-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              {isSearching ? 'Searching...' : `Found ${results.length} result(s) for ${bloodGroup}`}
            </h2>
            <div className="grid gap-4">
              {isSearching ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="animate-pulse p-6 rounded-xl bg-background border border-border">
                    <div className="flex gap-4">
                      <div className="h-12 w-12 rounded-lg bg-muted" />
                      <div className="flex-1 space-y-3">
                        <div className="h-4 w-1/3 bg-muted rounded" />
                        <div className="h-4 w-1/4 bg-muted rounded" />
                        <div className="h-4 w-1/2 bg-muted rounded" />
                      </div>
                    </div>
                  </div>
                ))
              ) : results.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <h3 className="text-lg font-medium text-foreground mb-2">No donors found</h3>
                  <p className="text-muted-foreground mb-4">Try adjusting your search criteria or expand your location</p>
                  <button onClick={() => { setBloodGroup(''); setLocation(''); setSearchPerformed(false); }} className="px-4 py-2 border border-input rounded-lg text-sm hover:bg-muted">Clear Search</button>
                </div>
              ) : (
                results.map((result) => (
                  <div key={result.id} className="p-6 rounded-xl bg-background border border-border">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-red-100 text-red-600">
                          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{result.bloodGroup}</span>
                            <span className="font-medium text-foreground">{result.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${result.available ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                              {result.available ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">{result.location} • {result.distance} • Last donation: {result.lastDonation}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L12 21.942l-5.657-5.657" /></svg>
                          <span>{result.distance}</span>
                        </div>
                        <button className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${result.available ? 'bg-red-600 text-white hover:bg-red-700' : 'border border-input bg-background text-muted-foreground'}`} disabled={!result.available}>
                          {result.available ? 'Request' : 'Unavailable'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}