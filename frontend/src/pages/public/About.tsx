import { Link } from 'react-router-dom';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Icons, Icon } from '../../components/ui/Icons';
import { BLOOD_GROUPS } from '../../constants';
import { motion } from 'framer-motion';

export function About() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
            About LifeBlood
          </h1>
          <p className="text-lg text-muted-foreground">
            Our mission is to make blood donation simple, safe, and accessible for everyone.
          </p>
        </motion.div>

        <div className="space-y-8">
          {[
            {
              title: 'Our Mission',
              content: 'LifeBlood was founded with a simple belief: every drop of blood can save a life. We connect generous donors with patients in critical need, making the process seamless and efficient.',
              icon: 'heart',
            },
            {
              title: 'Why We Exist',
              content: 'Every two seconds, someone needs blood. Yet blood shortages are common. We bridge this gap by building a trusted community where donors and recipients can connect directly, with full medical oversight.',
              icon: 'users',
            },
            {
              title: 'Safety First',
              content: 'Every donation goes through rigorous screening. We partner with certified blood centers and hospitals to ensure all blood meets the highest safety standards before reaching patients.',
              icon: 'shield',
            },
            {
              title: 'Technology for Good',
              content: 'Our platform uses smart matching algorithms to connect compatible blood types instantly. Real-time notifications, eligibility tracking, and transparent processes make saving lives effortless.',
              icon: 'activity',
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex gap-6"
            >
              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Icon name={item.icon} className="h-7 w-7" aria-hidden="true" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.content}</p>
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="pt-8 border-t"
          >
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { title: 'Trust', description: 'Transparent processes and verified medical oversight' },
                { title: 'Compassion', description: 'Every donation is an act of human kindness' },
                { title: 'Excellence', description: 'Highest standards in safety and efficiency' },
              ].map((value) => (
                <Card key={value.title} className="p-6">
                  <CardContent>
                    <h3 className="font-semibold text-foreground mb-2">{value.title}</h3>
                    <p className="text-sm text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}