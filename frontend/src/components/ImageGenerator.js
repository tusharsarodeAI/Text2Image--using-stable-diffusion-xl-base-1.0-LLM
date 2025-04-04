"use client";
import { useState } from "react";
import Image from "next/image";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("Standard");
  const [selectedPreference, setSelectedPreference] = useState("Speed");
  const [selectedStyle, setSelectedStyle] = useState("None");
  const [showAllStyles, setShowAllStyles] = useState(false);

  const styles = [
    "None", "Fantasy World", "Cyberpunk", "Anime", "Renaissance Painting",
    "3D Model", "Watercolor", "Pixel Art", "Abstract Art", "Ukiyo-e",
    "Comic Book", "HDR Photography", "Gothic Art", "Steampunk",
    "Neon Punk", "Isometric"
  ];

  const visibleStyles = showAllStyles ? styles : styles.slice(0, 6);
  const downloadImage = () => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${image}`;
    link.download = "generated_image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://47f8-130-211-245-3.ngrok-free.app/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          model: selectedModel.toLowerCase(),
          preference: selectedPreference.toLowerCase(),
          style: selectedStyle.toLowerCase(),
        }),
      });

      const data = await response.json();
      if (data.image) setImage(`data:image/png;base64,${data.image}`);
    } catch (error) {
      console.error("Error:", error);
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0F172A] text-[#E2E8F0] p-6">
      {/* Left Section (Controls) */}
      <div className="bg-[#1E293B] p-6 rounded-lg shadow-lg w-[550px]">
        <h1 className="text-2xl font-bold text-center mb-4">Create an Image</h1>

        <input
          type="text"
          placeholder="Enter a prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full p-3 rounded text-white"
        />

        {/* Model Selection */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Choose a Model</h2>
          <div className="flex gap-2">
            {["Standard", "HD"].map((model) => (
              <button
                key={model}
                onClick={() => setSelectedModel(model)}
                className={`w-full px-4 py-3 rounded transition-all ${
                  selectedModel === model
                    ? "bg-[#0EA5E9] text-white"
                    : "bg-[#334155] text-[#CBD5E1] hover:bg-[#475569]"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Preferences</h2>
          <div className="flex gap-2">
            {["Speed", "Quality"].map((pref) => (
              <button
                key={pref}
                onClick={() => setSelectedPreference(pref)}
                className={`w-full px-4 py-3 rounded transition-all ${
                  selectedPreference === pref
                    ? "bg-[#0EA5E9] text-white"
                    : "bg-[#334155] text-[#CBD5E1] hover:bg-[#475569]"
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        {/* Style Selection */}
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Choose a Style</h2>
          <div className="grid grid-cols-2 gap-2">
            {visibleStyles.map((style) => (
              <button
                key={style}
                onClick={() => setSelectedStyle(style)}
                className={`px-4 py-2 rounded transition-all ${
                  selectedStyle === style
                    ? "bg-[#14B8A6] text-white"
                    : "bg-[#334155] text-[#CBD5E1] hover:bg-[#475569]"
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          {/* Show More Button */}
          {styles.length > 9 && (
            <button
              onClick={() => setShowAllStyles(!showAllStyles)}
              className="mt-3 text-[#0EA5E9] hover:text-[#0284C7] transition-all"
            >
              {showAllStyles ? "Show Less" : "View More Styles"}
            </button>
          )}
        </div>

        <button
          onClick={handleGenerate}
          className="bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-bold py-3 px-6 rounded w-full mt-4 transition-all"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* Right Section (White Space → Image) */}
<div className="w-[550px] h-[90vh] ml-10 flex flex-col justify-between items-center border-2 border-[#334155] rounded-lg p-4">
  <div className="flex-grow flex items-center justify-center w-full">
    {image ? (
      <Image
        src={image}
        alt="Generated"
        width={450}
        height={450}
        className="rounded-lg"
      />
    ) : (
      <div className="text-[#CBD5E1] text-lg text-center">
        Generated image will appear here
      </div>
    )}
  </div>

  <button
    onClick={downloadImage}
    className="mb-2 bg-green-500 text-white px-4 py-2 rounded"
  >
    Download Image
  </button>
</div>

    </div>
  );
}
