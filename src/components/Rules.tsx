import '../App.css';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const standardVariant = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      bounce: 0.5,
      duration: 0.8
    }
  }
};

const standardHoverEffect = {
  scale: 1.05,
  filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"],
  transition: { duration: 1 }
};

export function Rules() {
  return (
    <div className="text-lg pt-4 font-comic">
      <h2 className="flex items-center justify-center gap-2 text-2xl font-bold mb-2 text-glow">
        <span className="material-icons text-header animate-bounce">gavel</span>
        Rules
      </h2>
      <div className="flex justify-center">
        <Separator className="my-2 w-2/3" />
      </div>
      <motion.ul 
        variants={container}
        initial="hidden"
        animate="show"
        className="list-none pl-6 text-foreground space-y-8"
      >
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold tracking-wider"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          DONT USE GOOGLE
        </motion.li>
        
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          CAN BE DEAD WOMEN
        </motion.li>
        
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          THEY MUST HAVE A WIKIPEDIA PAGE
        </motion.li>
        
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          No fictional characters must be a real ass women or a god
        </motion.li>
        
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          Capitalization and accent marks don't matter
        </motion.li>
        
        <motion.li 
          variants={standardVariant}
          className="text-foreground text-2xl font-bold"
          whileHover={standardHoverEffect}
          style={{ textShadow: '2px 2px 4px rgba(255,214,186,0.3)' }}
        >
          Press ENTER <span className="material-icons align-middle text-white">keyboard_return</span> or TAB <span className="material-icons align-middle text-white">keyboard_tab</span> to verify each name
        </motion.li>
      </motion.ul>
    </div>
  );
} 