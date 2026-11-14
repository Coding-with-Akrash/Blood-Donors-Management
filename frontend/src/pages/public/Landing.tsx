import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Icons } from '../../components/ui/Icons';
import { BloodGroupBadge } from '../../components/ui/Badge';
import { BLOOD_GROUPS, ROLES, ROLE_LABELS, ROLE_DESCRIPTIONS, ROLE_ICONS, ROLE_COLORS_INLINE, ROLE_STAT_COLORS, STAT_COLORS } from '../../constants';
import { motion } from 'framer-motion';

export function Landing() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-light to-background py-20 lg:py-32">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" aria-hidden="true" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6"
            >
              <Icons.droplet className="h-4 w-4" aria-hidden="true" />
              <span>Every Drop Can Save a Life</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl lg:text-6xl font-heading font-bold tracking-tight text-foreground mb-6"
            >
              Give Blood.<br />
              <span className="text-primary">Save Lives.</span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mx-auto max-w-2xl text-lg text-muted-foreground mb-10"
            >
              Connect donors with people who need blood — quickly, safely, and efficiently.
              Join thousands of donors making a difference every day.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button asChild variant="default" size="xl" className="w-full sm:w-auto">
                <Link to="/register">
                  <Icons.heart className="mr-2 h-5 w-5" aria-hidden="true" />
                  Become a Donor
                </Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="w-full sm:w-auto">
                <Link to="/find-blood">
                  <Icons.search className="mr-2 h-5 w-5" aria-hidden="true" />
                  Need Blood?
                </Link>
              </Button>
            </motion.div>
          </div>

          {/* Hero Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="relative mx-auto max-w-4xl">
              <div className="aspect-square relative">
                <svg viewBox="0 0 400 400" className="w-full h-full" aria-hidden="true">
                  <defs>
                    <linearGradient id="bloodGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                      <stop offset="50%" stopColor="hsl(var(--primary-hover))" stopOpacity="0.05" />
                      <stop offset="100%" stopColor="hsl(var(--primary-light))" stopOpacity="0" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>
                  
                  {/* Background circles */}
                  <circle cx="200" cy="200" r="180" fill="url(#bloodGradient)" filter="url(#glow)" />
                  
                  {/* Pulsing heart path */}
                  <path
                    d="M200 100 C200 60, 260 60, 260 100 C260 140, 200 220, 200 220 C200 220, 140 140, 140 100 C140 60, 200 60, 200 100"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray="10,5"
                    className="animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                  
                  {/* Inner circles */}
                  <circle cx="200" cy="200" r="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" strokeDasharray="5,5" opacity="0.5" />
                  <circle cx="200" cy="200" r="40" fill="hsl(var(--primary))" opacity="0.1" />
                  
                  {/* Blood drops around */}
                  {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                    <g key={i} transform={`rotate(${angle} 200 200)`}>
                      <ellipse cx="200" cy="60" rx="12" ry="20" fill="hsl(var(--primary))" opacity="0.3">
                        <animateTransform
                          attributeName="transform"
                          type="rotate"
                          from={`${angle} 200 200`}
                          to={`${angle + 360} 200 200`}
                          dur={`${20 + i * 2}s`}
                          repeatCount="indefinite"
                        />
                      </ellipse>
                    </g>
                  ))}
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Donors', value: '12,847', icon: Icons.users, colorKey: 'primary' },
              { label: 'Lives Saved', value: '38,241', icon: Icons.heart, colorKey: 'primary' },
              { label: 'Blood Units', value: '8,932', icon: Icons.droplet, colorKey: 'success' },
              { label: 'Partner Hospitals', value: '156', icon: Icons.hospital, colorKey: 'info' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 ${STAT_COLORS[stat.colorKey as keyof typeof STAT_COLORS]}`}>
                  <stat.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="text-3xl lg:text-4xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Active Donors', value: '12,847', icon: Icons.users, color: 'text-red-500' },
              { label: 'Lives Saved', value: '38,241', icon: Icons.heart, color: 'text-red-600' },
              { label: 'Blood Units', value: '8,932', icon: Icons.droplet, color: 'text-red-700' },
              { label: 'Partner Hospitals', value: '156', icon: Icons.hospital, color: 'text-red-800' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4 ${stat.color}`}>
                  <stat.icon className="h-8 w-8" aria-hidden="true" />
                </div>
                <p className="text-3xl lg:text-4xl font-heading font-bold text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect donors with those in need
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Create Your Account',
                description: 'Register as a donor or recipient in minutes. Secure, private, and free.',
                icon: Icons.user,
              },
              {
                step: '02',
                title: 'Donate or Request',
                description: 'Schedule donations or create blood requests. Our system matches compatible donors instantly.',
                icon: Icons.heartHandshake,
              },
              {
                step: '03',
                title: 'Save a Life',
                description: 'Your donation reaches patients in need. Track your impact and earn recognition.',
                icon: Icons.award,
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="text-2xl lg:text-3xl font-heading font-bold text-primary/20">{item.step}</span>
                </div>
                <Card className="h-full border-primary/10 hover:border-primary/30 transition-colors">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 text-primary mb-4">
                      <item.icon className="h-8 w-8" aria-hidden="true" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blood Groups */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Blood Groups We Support
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              All eight blood types are critical. Find your match and help save lives.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {BLOOD_GROUPS.map((bloodGroup, i) => (
              <motion.div
                key={bloodGroup}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <Link
                  to="/blood-compatibility"
                  className="group block p-4 text-center rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all"
                >
                  <BloodGroupBadge bloodGroup={bloodGroup} size="lg" className="mx-auto mb-3" />
                  <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                    {bloodGroup}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Find Blood Search */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mx-auto max-w-3xl text-center mb-10"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Need Blood Right Now?
            </h2>
            <p className="text-lg text-muted-foreground">
              Search for compatible donors in your area
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl"
          >
            <Card className="border-primary/20">
              <CardContent className="p-6 lg:p-8">
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="bloodGroup" className="block text-sm font-medium text-foreground mb-2">
                        Blood Group
                      </label>
                      <select
                        id="bloodGroup"
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
                        Location
                      </label>
                      <input
                        id="location"
                        type="text"
                        placeholder="City or area"
                        className="w-full h-12 rounded-lg border border-input bg-background px-4 py-3 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button type="submit" variant="blood" size="xl" className="w-full">
                        <Icons.search className="mr-2 h-5 w-5" aria-hidden="true" />
                        Search
                      </Button>
                    </div>
                  </div>
                </form>
                <p className="text-center text-sm text-muted-foreground mt-4">
                  <Link to="/find-blood" className="text-primary hover:underline">
                    Advanced search →
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Role Selection */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Who Are You?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose your role to get started with LifeBlood
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {ROLES.map((role, i) => (
              <motion.div
                key={role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Link
                  to="/register"
                  className="group block p-8 rounded-2xl bg-background border border-border hover:border-primary/50 hover:shadow-xl transition-all"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${ROLE_STAT_COLORS[role as keyof typeof ROLE_STAT_COLORS]}`}>
                      <Icon name={ROLE_ICONS[role as keyof typeof ROLE_ICONS]} className="h-7 w-7" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{ROLE_LABELS[role as keyof typeof ROLE_LABELS]}</h3>
                      <p className="text-sm text-muted-foreground">{ROLE_DESCRIPTIONS[role as keyof typeof ROLE_DESCRIPTIONS]}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Get Started →
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Requests */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
              Urgent Blood Requests
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Critical patients need your help now
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { bloodGroup: 'O-', urgency: 'Critical', location: 'Wah Cantt', time: '2 hours ago' },
              { bloodGroup: 'B+', urgency: 'Urgent', location: 'Rawalpindi', time: '4 hours ago' },
              { bloodGroup: 'AB-', urgency: 'Critical', location: 'Islamabad', time: '1 hour ago' },
            ].map((request, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className={`border-l-4 ${request.urgency === 'Critical' ? 'border-destructive' : 'border-warning'} hover:shadow-lg transition-shadow`}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <BloodGroupBadge bloodGroup={request.bloodGroup} size="lg" />
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${request.urgency === 'Critical' ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning'}`}>
                        {request.urgency}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Icons.mapPin className="h-4 w-4" aria-hidden="true" />
                        <span>{request.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Icons.clock className="h-4 w-4" aria-hidden="true" />
                        <span>{request.time}</span>
                      </div>
                    </div>
                    <Button asChild variant="outline" className="w-full mt-4" size="sm">
                      <Link to="/find-blood">View Request</Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Button asChild variant="outline" size="lg">
              <Link to="/find-blood">
                View All Requests
                <Icons.arrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl lg:text-4xl font-heading font-bold mb-4"
          >
            Ready to Save Lives?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg opacity-90 mb-8"
          >
            Join thousands of donors making a difference every day
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button asChild variant="secondary" size="xl" className="w-full sm:w-auto">
              <Link to="/register">
                <Icons.heart className="mr-2 h-5 w-5" aria-hidden="true" />
                Register as Donor
              </Link>
            </Button>
            <Button asChild variant="outline" size="xl" className="w-full sm:w-auto border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/register?role=recipient">
                <Icons.droplet className="mr-2 h-5 w-5" aria-hidden="true" />
                Register as Recipient
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}