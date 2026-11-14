import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

export function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-md"
      >
        <div className="mb-8">
          <span className="text-9xl font-heading font-bold text-red-600/20">404</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-heading font-bold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild variant="blood" size="lg">
            <Link to="/">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/contact">
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              Contact Support
            </Link>
          </Button>
        </div>
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Or try one of these links:
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-4 text-sm">
            <Link to="/about" className="text-red-600 hover:underline">About Us</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/find-blood" className="text-red-600 hover:underline">Find Blood</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/login" className="text-red-600 hover:underline">Login</Link>
            <span className="text-muted-foreground">•</span>
            <Link to="/register" className="text-red-600 hover:underline">Register</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}