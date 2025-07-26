import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { motion, AnimatePresence } from 'framer-motion';

const InfiniteScroll = ({ 
  items, 
  renderItem, 
  loadMore, 
  hasMore, 
  loading = false,
  className = '',
  threshold = 0.1
}) => {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: false
  });

  useEffect(() => {
    if (inView && hasMore && !loading) {
      loadMore();
    }
  }, [inView, hasMore, loading, loadMore]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div className={className}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <AnimatePresence>
          {items.map((item, index) => (
            <motion.div
              key={item._id || index}
              variants={itemVariants}
              layout
            >
              {renderItem(item, index)}
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Loading indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-8"
        >
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </motion.div>
      )}

      {/* Intersection observer target */}
      {hasMore && (
        <div ref={ref} className="h-10" />
      )}
    </div>
  );
};

export default InfiniteScroll; 