import { useState } from 'react';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Input';
import { Icons } from '../../components/ui/Icons';
import { motion } from 'framer-motion';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const contactInfo = [
    { icon: Icons.mail, title: 'Email', value: 'support@lifeblood.org', link: 'mailto:support@lifeblood.org' },
    { icon: Icons.phone, title: 'Phone', value: '+1 (800) 555-LIFE', link: 'tel:+1800555LIFE' },
    { icon: Icons.mapPin, title: 'Address', value: '123 LifeBlood Avenue, Health District, HC 10001', link: null },
    { icon: Icons.clock, title: 'Hours', value: 'Mon-Fri: 8am-8pm, Sat-Sun: 9am-5pm', link: null },
  ];

  return (
    <div className="py-16">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            Contact Us
          </h1>
          <p className="text-lg text-muted-foreground">
            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  {contactInfo.map((item, i) => (
                    <motion.div
                      key={item.title}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex gap-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <item.icon className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">{item.title}</h3>
                        {item.link ? (
                          <a href={item.link} className="text-primary hover:underline text-sm">{item.value}</a>
                        ) : (
                          <p className="text-sm text-muted-foreground">{item.value}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card>
              <CardContent className="p-6 lg:p-8">
                <h2 className="text-xl font-semibold text-foreground mb-6">Send us a Message</h2>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-6 p-4 rounded-lg bg-emerald-100 text-emerald-700 border border-emerald-200"
                  >
                    <div className="flex items-center gap-2">
                      <Icons.checkCircle className="h-5 w-5" aria-hidden="true" />
                      <span>Thank you! Your message has been sent successfully.</span>
                    </div>
                  </motion.div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                    />
                  </div>
                  <Input
                    label="Subject"
                    placeholder="How can we help you?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    required
                  />
                  <Textarea
                    label="Message"
                    placeholder="Tell us how we can help..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    required
                  />
                  <Button type="submit" variant="blood" size="lg" className="w-full">
                    <Icons.send className="mr-2 h-5 w-5" aria-hidden="true" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}