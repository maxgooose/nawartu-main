import React from 'react';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  className = '', 
  hover = true, 
  delay = 0,
  onClick,
  ...props 
}) => {
  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    },
    hover: hover ? {
      y: -8,
      scale: 1.02,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    } : {}
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export const PropertyCard = ({ property, onClick }) => {
  return (
    <AnimatedCard 
      onClick={onClick}
      className="group"
      delay={Math.random() * 0.2}
    >
      <div className="relative overflow-hidden">
        <motion.img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300'}
          alt={property.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.3 }}
        />
        <motion.div
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </motion.div>
      </div>
      
      <div className="p-4">
        <motion.h3 
          className="font-semibold text-gray-900 mb-1 line-clamp-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {property.title}
        </motion.h3>
        
        <motion.p 
          className="text-sm text-gray-600 mb-2 line-clamp-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {property.location.address}
        </motion.p>
        
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="text-yellow-400">★</span>
            <span className="text-sm text-gray-600">
              {property.rating?.average?.toFixed(1) || 'New'}
            </span>
            <span className="text-sm text-gray-500">
              ({property.rating?.count || 0})
            </span>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
          >
            <span className="font-bold text-gray-900">${property.price}</span>
            <span className="text-sm text-gray-500"> / night</span>
          </motion.div>
        </div>
      </div>
    </AnimatedCard>
  );
};

export default AnimatedCard; 