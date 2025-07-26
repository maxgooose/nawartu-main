import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';

const AdvancedForm = ({ 
  schema, 
  onSubmit, 
  defaultValues = {}, 
  fields, 
  submitText = 'Submit',
  loading = false,
  className = ''
}) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    reset
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data);
      reset();
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field) => {
    const { name, type, label, placeholder, options, validation } = field;
    const error = errors[name];

    const fieldVariants = {
      hidden: { opacity: 0, y: 10 },
      visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.3 }
      }
    };

    return (
      <motion.div
        key={name}
        variants={fieldVariants}
        className="space-y-2"
      >
        <label className="block text-sm font-medium text-gray-700">
          {label}
          {validation?.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        <Controller
          name={name}
          control={control}
          render={({ field: { onChange, value, ref } }) => {
            switch (type) {
              case 'textarea':
                return (
                  <textarea
                    {...field}
                    ref={ref}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                    rows={4}
                  />
                );

              case 'select':
                return (
                  <select
                    {...field}
                    ref={ref}
                    value={value || ''}
                    onChange={onChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">{placeholder}</option>
                    {options?.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                );

              case 'checkbox':
                return (
                  <div className="flex items-center space-x-2">
                    <input
                      {...field}
                      ref={ref}
                      type="checkbox"
                      checked={value || false}
                      onChange={onChange}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{placeholder}</span>
                  </div>
                );

              case 'radio':
                return (
                  <div className="space-y-2">
                    {options?.map((option) => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <input
                          {...field}
                          ref={ref}
                          type="radio"
                          value={option.value}
                          checked={value === option.value}
                          onChange={onChange}
                          className="w-4 h-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-sm text-gray-700">{option.label}</span>
                      </div>
                    ))}
                  </div>
                );

              default:
                return (
                  <input
                    {...field}
                    ref={ref}
                    type={type}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 ${
                      error ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                );
            }
          }}
        />

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm text-red-600"
          >
            {error.message}
          </motion.p>
        )}
      </motion.div>
    );
  };

  return (
    <motion.form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`space-y-6 ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {fields.map(renderField)}
      </motion.div>

      <motion.button
        type="submit"
        disabled={isSubmitting || loading}
        className={`w-full py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-200 ${
          (isSubmitting || loading) ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {isSubmitting || loading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Submitting...</span>
          </div>
        ) : (
          submitText
        )}
      </motion.button>
    </motion.form>
  );
};

// Predefined schemas for common forms
export const bookingSchema = yup.object({
  checkIn: yup.date().required('Check-in date is required'),
  checkOut: yup.date().required('Check-out date is required'),
  guests: yup.number().min(1, 'At least 1 guest required').required('Number of guests is required'),
  specialRequests: yup.string().max(500, 'Special requests must be less than 500 characters')
});

export const reviewSchema = yup.object({
  rating: yup.object({
    overall: yup.number().min(1).max(5).required('Overall rating is required'),
    cleanliness: yup.number().min(1).max(5),
    communication: yup.number().min(1).max(5),
    checkIn: yup.number().min(1).max(5),
    accuracy: yup.number().min(1).max(5),
    location: yup.number().min(1).max(5),
    value: yup.number().min(1).max(5)
  }),
  comment: yup.string().min(10, 'Review must be at least 10 characters').max(1000, 'Review must be less than 1000 characters').required('Review comment is required'),
  privateComment: yup.string().max(500, 'Private comment must be less than 500 characters')
});

export default AdvancedForm; 