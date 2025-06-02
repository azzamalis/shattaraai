
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
    }

    let elements: EducationElement[] = [];

    // Initialize elements
    const generateElements = (count: number) => {
      const types = ['book', 'cap', 'formula', 'question', 'building'];
      const newElements: EducationElement[] = [];

      for (let i = 0; i < count; i++) {
        const type = types[Math.floor(p5.random(types.length))] as 'book' | 'cap' | 'formula' | 'question' | 'building';
        const scale = p5.random(0.5, 1.5);
        
        // Color palette based on the design (primary blue, whites, grays)
        const colorOptions = [
          [35, 35, 255], // Primary blue
          [255, 255, 255], // White
          [200, 200, 220], // Light gray
          [35, 35, 255, 150], // Semi-transparent blue
        ];
        
        newElements.push({
          x: p5.random(dimensions.width),
          y: p5.random(dimensions.height),
          type,
          rotation: p5.random(p5.TWO_PI),
          scale,
          speed: p5.random(0.2, 1) * 0.5,
          color: colorOptions[Math.floor(p5.random(colorOptions.length))],
        });
      }
      
      return newElements;
    };

    // Element drawing functions
    const drawBook = () => {
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 40, 30);
      p5.line(-20, -15, -20, 15);
      p5.line(-15, -15, -15, 15);
    };

    const drawCap = () => {
      // Graduation cap
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 40, 40);
      p5.line(-20, -20, 0, -35);
      p5.line(20, -20, 0, -35);
      p5.line(0, -35, 0, -45);
      p5.ellipse(0, -45, 10, 10);
    };

    const drawFormula = () => {
      // Math/science formula
      p5.textSize(16);
      p5.text("E=mc²", -20, 0);
    };

    const drawQuestion = () => {
      // Quiz/exam element
      p5.ellipse(0, 0, 30, 30);
      p5.textSize(20);
      p5.text("?", -5, 5);
    };

    const drawBuilding = () => {
      // University building
      p5.rectMode(p5.CENTER);
      p5.rect(0, 0, 40, 50);
      p5.triangle(-20, -25, 20, -25, 0, -45);
      p5.line(0, 25, 0, -25);
      p5.rect(-10, 0, 5, 10);
      p5.rect(10, 0, 5, 10);
    };

    p5.setup = () => {
      p5.createCanvas(dimensions.width, dimensions.height);
      const elementCount = isMobile ? 15 : 25;
      elements = generateElements(elementCount);
    };

    p5.draw = () => {
      p5.clear();
      
      // Update and draw elements
      elements = elements.map(el => {
        // Move elements slowly upward
        const newY = el.y - el.speed;
        // Reset position if element moves out of view
        const resetY = newY < -50 ? dimensions.height + 50 : newY;
        
        // Draw the element based on its type
        p5.push();
        p5.translate(el.x, resetY);
        p5.rotate(el.rotation + p5.frameCount * 0.001);
        p5.scale(el.scale);
        
        p5.noFill();
        p5.stroke(el.color);
        p5.strokeWeight(1);
        
        switch (el.type) {
          case 'book':
            drawBook();
            break;
          case 'cap':
            drawCap();
            break;
          case 'formula':
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
