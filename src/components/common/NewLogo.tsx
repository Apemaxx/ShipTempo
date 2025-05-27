import React from "react";

interface NewLogoProps {
  width?: number;
  height?: number;
  className?: string;
}

const NewLogo = ({
  width = 300,
  height = 100,
  className = "",
}: NewLogoProps) => {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <img
        src="/amass_cwn_logo.jpg"
        alt="AMASS CargoWorld Network"
        width={width}
        height={height}
        className="object-contain"
      />
    </div>
  );
};

export default NewLogo;
