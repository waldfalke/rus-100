export default function TestEnhancedPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">Enhanced UI Test Page</h1>
      <p className="text-lg mb-4">
        This page confirms that the enhanced-ui branch is working correctly.
      </p>
      <div className="bg-blue-100 p-4 rounded-lg">
        <p className="text-blue-800">
          ✅ Enhanced UI branch is deployed and functional!
        </p>
        <p className="text-sm text-blue-600 mt-2">
          Timestamp: {new Date().toISOString()}
        </p>
      </div>
    </div>
  );
}