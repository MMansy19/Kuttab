"use client";

const GradientStyles = () => {
  return (
    <style dangerouslySetInnerHTML={{ __html: `
      .text-gradient {
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
      }
      
      .animate-float {
        animation: float 3s ease-in-out infinite;
      }
      
      @keyframes float {
        0% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-10px);
        }
        100% {
          transform: translateY(0px);
        }
      }
    `}} />
  );
};

export default GradientStyles;
