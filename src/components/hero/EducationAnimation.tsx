
import React, { useState, useEffect, useRef } from 'react';
import { useWindowSize } from '@/hooks/use-window-size';
import { ReactP5Wrapper } from 'react-p5-wrapper';

interface EducationAnimationProps {
  className?: string;
}

const EducationAnimation: React.FC<EducationAnimationProps> = ({ className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { isMobile } = useWindowSize();

  // Update dimensions when container size changes
  useEffect(() => {
    if (!containerRef.current) return;

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    // Initial dimensions
    updateDimensions();

    // Add resize listener
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // p5.js sketch
  const sketch = (p5: any) => {
    // Education-related elements
    interface EducationElement {
      x: number;
      y: number;
      type: 'book' | 'cap' | 'formula' | 'question' | 'building';
      rotation: number;
      scale: number;
      speed: number;
      color: number[];
      alpha: number;
    }

    let elements: EducationElement[] = [];

    // Initialize elements
    const generateElements = (count: number) => {
      const types = ['book', 'cap', 'formula', 'question', 'building'];
      const newElements: EducationElement[] = [];

      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(p5.random(types.length))] as 'book' | 'cap' | 'formula' | 'question' | 'building';
        const scale = p5.random(0.3, 1.2);
        
        // Enhanced color palette with better visibility on dark background
        const colorOptions = [
          [35, 35, 255], // Primary blue
          [255, 255, 255], // White
          [200, 200, 220], // Light gray
          [100, 200, 255], // Light blue
          [180, 180, 255], // Lighter purple-blue
        ];
        
        newElements.push({
          x: p5.random(dimensions.width),
          y: p5.random(dimensions.height),
          type,
          rotation: p5.random(p5.TWO_PI),
          scale,
          speed: p5.random(0.1, 0.8),
          color: colorOptions[Math.floor(p5.random(colorOptions.length))],
          alpha: p5.random(0.3, 0.8)
        });
      }
      
      return newElements;
    };

    // Element drawing functions with better visibility
    const drawBook = () => {
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 40, 30);
      p5.line(-20, -15, -20, 15);
      p5.line(-15, -15, -15, 15);
      // Add some detail lines
      for (let i = -10; i < 20; i += 5) {
        p5.line(-15, i, 15, i);
      }
    };

    const drawCap = () => {
      // Graduation cap with more detail
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 45, 45);
      p5.triangle(-22, -22, 22, -22, 0, -35);
      p5.line(0, -35, 0, -50);
      p5.ellipse(0, -50, 8, 8);
      // Add border details
      p5.noFill();
      p5.rect(0, 0, 45, 45);
    };

    const drawFormula = () => {
      // Math/science formula with better contrast
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(14);
      p5.text("E=mc²", 0, 0);
      p5.textSize(10);
      p5.text("∑∫∆", 0, 15);
    };

    const drawQuestion = () => {
      // Quiz/exam element
      p5.ellipse(0, 0, 35, 35);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.textSize(18);
      p5.text("?", 0, 0);
    };

    const drawBuilding = () => {
      // University building with more detail
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 40, 50);
      p5.triangle(-20, -25, 20, -25, 0, -45);
      p5.line(0, 25, 0, -25);
      // Windows
      p5.rect(-10, -5, 8, 8);
      p5.rect(10, -5, 8, 8);
      p5.rect(-10, 10, 8, 8);
      p5.rect(10, 10, 8, 8);
    };

    p5.setup = () => {
      p5.createCanvas(dimensions.width, dimensions.height);
      const elementCount = isMobile ? 20 : 35; // Increased count for better visibility
      elements = generateElements(elementCount);
    };

    p5.draw = () => {
      p5.clear();
      
      // Update and draw elements
      elements = elements.map(el => {
        // Move elements slowly upward
        const newY = el.y - el.speed;
        // Reset position if element moves out of view
        const resetY = newY < -100 ? dimensions.height + 100 : newY;
        
        // Draw the element based on its type
        p5.push();
        p5.translate(el.x, resetY);
        p5.rotate(el.rotation + p5.frameCount * 0.002);
        p5.scale(el.scale);
        
        // Enhanced stroke settings for better visibility
        p5.stroke(el.color[0], el.color[1], el.color[2], el.alpha * 255);
        p5.strokeWeight(2);
        p5.noFill();
        
        // Add subtle fill for some elements
        if (p5.random() > 0.7) {
          p5.fill(el.color[0], el.color[1], el.color[2], el.alpha * 100);
        }
        
        switch (el.type) {
          case 'book':
            drawBook();
            break;
          case 'cap':
            drawCap();
            break;
          case 'formula':
            p5.fill(el.color[0], el.color[1], el.color[2], el.alpha * 255);
            drawFormula();
            break;
          case 'question':
            drawQuestion();
            break;
          case 'building':
            drawBuilding();
            break;
        }
        
        p5.pop();
        
        return { ...el, y: resetY };
      });
    };

    p5.windowResized = () => {
      if (dimensions.width > 0 && dimensions.height > 0) {
        p5.resizeCanvas(dimensions.width, dimensions.height);
      }
    };
  };

  if (dimensions.width === 0 || dimensions.height === 0) {
    return <div className={className} ref={containerRef} />;
  }

  return (
    <div className={className} ref={containerRef}>
      {dimensions.width > 0 && dimensions.height > 0 && (
        <ReactP5Wrapper sketch={sketch} />
      )}
    </div>
  );
};

export default EducationAnimation;
