export const TopHeader = () => {
  return (
    <div className="flex-1 text-left">
      {/* Brand Heading */}
      <h1 className="text-5xl font-extrabold tracking-tight text-white mb-3">
        GNH <span className="text-emerald-400">AGRI-TECH.</span>
      </h1>
      
      {/* Description with better line-height and color */}
      <p className="text-gray-200 text-lg font-medium max-w-sm leading-snug">
        Precision farming insights for a <br />
        <span className="text-white font-semibold">Gross National Happiness</span> future.
      </p>

      {/* Optional: Add the "Quick Action" pills below the text if they aren't in your Main file */}
      <div className="flex flex-wrap gap-2 mt-8">
        
      
      </div>
    </div>
  );
};