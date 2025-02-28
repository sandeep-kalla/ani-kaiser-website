// eslint-disable-next-line no-unused-vars
import {  motion, AnimatePresence } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-6 mt-auto">
      <div className="container mx-auto px-4">
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-3"
          >
            <div className="flex items-center justify-center gap-2 text-lg flex-wrap">
              <span>Made with</span>
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  repeatDelay: 1,
                  ease: "easeInOut"
                }}
                className="text-red-500 inline-flex items-center justify-center w-6 h-6"
              >
                ❤️
              </motion.div>
              <span>for all the</span>
              <span className="text-purple-500 font-semibold">Otaku</span>
              <span>fans</span>
              <motion.span
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 0.5
                }}
                className="text-yellow-500"
              >
                🌟
              </motion.span>
            </div>
            
            <div className="flex items-center justify-center gap-2 flex-wrap">
              <span>Crafted by</span>
              <span className="text-purple-400 font-medium">Sandeep</span>
              <span>with</span>
              <motion.span
                animate={{ rotate: [0, 360] }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="text-yellow-500 inline-block"
              >
                ✨
              </motion.span>
              <span className="text-blue-400">passion</span>
              <span className="text-pink-500">🎭</span>
            </div>

            <div className="text-sm text-gray-400 flex items-center justify-center gap-2 flex-wrap">
              <span>Keep watching anime</span>
              <motion.span
                animate={{ y: [0, -3, 0] }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-yellow-500"
              >
                🍜
              </motion.span>
              <span>Stay awesome</span>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="inline-flex items-center"
              >
                <img 
                  src="https://flagcdn.com/w20/in.png"
                  alt="Indian flag"
                  className="w-6 h-4"
                />
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </footer>
  );
};

export default Footer; 