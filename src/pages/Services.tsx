const Services = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Our Services
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Service Card 1 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Wellness Assessment
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Comprehensive evaluation of your current health status and wellness goals.
            </p>
          </div>

          {/* Service Card 2 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Personalized Plans
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Custom wellness plans tailored to your specific needs and preferences.
            </p>
          </div>

          {/* Service Card 3 */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Progress Tracking
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Monitor your progress and adjust your plan as needed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services; 