import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import * as math from 'mathjs';


interface CalculatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type UnitType = 'length' | 'mass' | 'temperature' | 'volume' | 'time';

// Unit conversion factors (relative to base unit)
const unitConversions = {
  length: {
    mm: 0.001,
    cm: 0.01,
    m: 1,
    km: 1000,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344
  },
  mass: {
    mg: 0.001,
    g: 1,
    kg: 1000,
    oz: 28.3495,
    lb: 453.592
  },
  volume: {
    ml: 0.001,
    l: 1,
    gal: 3.78541,
    qt: 0.946353,
    pt: 0.473176,
    cup: 0.236588
  },
  time: {
    s: 1,
    min: 60,
    h: 3600,
    d: 86400,
    week: 604800,
    month: 2592000,
    year: 31536000
  }
};

// Temperature needs special conversion formulas
const convertTemperature = (value: number, from: string, to: string): number => {
  // First convert to Celsius
  let celsius;
  switch (from) {
    case 'C':
      celsius = value;
      break;
    case 'F':
      celsius = (value - 32) * 5/9;
      break;
    case 'K':
      celsius = value - 273.15;
      break;
    default:
      return value;
  }

  // Then convert from Celsius to target
  switch (to) {
    case 'C':
      return celsius;
    case 'F':
      return (celsius * 9/5) + 32;
    case 'K':
      return celsius + 273.15;
    default:
      return celsius;
  }
};

// Unit categories and their units
const unitCategories: Record<UnitType, string[]> = {
  length: ['mm', 'cm', 'm', 'km', 'in', 'ft', 'yd', 'mi'],
  mass: ['mg', 'g', 'kg', 'oz', 'lb'],
  temperature: ['C', 'F', 'K'],
  volume: ['ml', 'l', 'gal', 'qt', 'pt', 'cup'],
  time: ['s', 'min', 'h', 'd', 'week', 'month', 'year'],
};

export function CalculatorModal({ open, onOpenChange }: CalculatorModalProps) {
  // Standard Calculator State
  const [standardInput, setStandardInput] = useState('');
  const [standardResult, setStandardResult] = useState('');

  // Scientific Calculator State
  const [scientificInput, setScientificInput] = useState('');
  const [scientificResult, setScientificResult] = useState('');
  const [isRadianMode, setIsRadianMode] = useState(true);

  // Unit Converter State
  const [unitCategory, setUnitCategory] = useState<UnitType>('length');
  const [fromUnit, setFromUnit] = useState(unitCategories.length[0]);
  const [toUnit, setToUnit] = useState(unitCategories.length[1]);
  const [unitValue, setUnitValue] = useState('');
  const [convertedValue, setConvertedValue] = useState('');

  // Handle keyboard input for calculators
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key === 'Enter') {
        e.preventDefault();
        calculateResult();
      }
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, standardInput, scientificInput]);

  // Standard Calculator Functions - using mathjs (secure alternative to expr-eval)
  const calculateStandard = () => {
    try {
      const result = math.evaluate(standardInput);
      setStandardResult(result.toString());
    } catch (error) {
      setStandardResult('Error');
    }
  };

  // Scientific Calculator Functions
  const calculateScientific = () => {
    try {
      let expression = scientificInput
        .replace(/π/g, 'pi')
        .replace(/√/g, 'sqrt');

      if (!isRadianMode) {
        // Convert degree inputs to radians for trig functions
        expression = expression
          .replace(/sin\((.*?)\)/g, 'sin($1 * pi/180)')
          .replace(/cos\((.*?)\)/g, 'cos($1 * pi/180)')
          .replace(/tan\((.*?)\)/g, 'tan($1 * pi/180)');
      }

      const result = math.evaluate(expression);
      setScientificResult(result.toString());
    } catch (error) {
      setScientificResult('Error');
    }
  };

  // Unit Converter Functions
  const convertUnit = () => {
    try {
      const value = parseFloat(unitValue);
      if (isNaN(value)) {
        setConvertedValue('Invalid input');
        return;
      }

      let result: number;
      if (unitCategory === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
      } else {
        const conversions = unitConversions[unitCategory];
        const fromFactor = conversions[fromUnit as keyof typeof conversions];
        const toFactor = conversions[toUnit as keyof typeof conversions];
        result = (value * fromFactor) / toFactor;
      }

      setConvertedValue(result.toFixed(4));
    } catch (error) {
      setConvertedValue('Error');
    }
  };

  const calculateResult = () => {
    switch (activeTab) {
      case 'standard':
        calculateStandard();
        break;
      case 'scientific':
        calculateScientific();
        break;
      case 'converter':
        convertUnit();
        break;
    }
  };

  const [activeTab, setActiveTab] = useState('standard');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[calc(100vw-2rem)] sm:max-w-[450px] bg-card border-border p-4 sm:p-5 rounded-xl shadow-lg">
        <div className="flex flex-col space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium text-foreground">Calculator</h2>
          </div>

          <Tabs defaultValue="standard" className="w-full" onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-muted rounded-lg overflow-hidden p-1">
              <TabsTrigger 
                value="standard" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
              >
                Standard
              </TabsTrigger>
              <TabsTrigger 
                value="scientific" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
              >
                Scientific
              </TabsTrigger>
              <TabsTrigger 
                value="converter" 
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-muted-foreground ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0 focus:ring-0"
              >
                Converter
              </TabsTrigger>
            </TabsList>

            {/* Standard Calculator */}
            <TabsContent value="standard">
              <div className="space-y-2">
                <Input
                  type="text"
                  value={standardInput}
                  onChange={(e) => setStandardInput(e.target.value)}
                  placeholder="Enter expression..."
                  className="text-right text-lg bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground rounded-lg"
                />
                <div className="text-right text-2xl font-semibold min-h-[2rem] text-foreground">
                  {standardResult}
                </div>
                <div className="grid grid-cols-4 gap-2 sm:gap-3">
                  {['7', '8', '9', '/'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setStandardInput(standardInput + key)}
                      className="h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {key}
                    </Button>
                  ))}
                  {['4', '5', '6', '*'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setStandardInput(standardInput + key)}
                      className="h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {key}
                    </Button>
                  ))}
                  {['1', '2', '3', '-'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setStandardInput(standardInput + key)}
                      className="h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {key}
                    </Button>
                  ))}
                  {['0', '.', '=', '+'].map((key) => (
                    <Button
                      key={key}
                      variant={key === '=' ? 'default' : 'secondary'}
                      onClick={() => key === '=' ? calculateStandard() : setStandardInput(standardInput + key)}
                      className={key === '=' ? 
                        "h-12 sm:h-10 text-base sm:text-sm bg-primary hover:bg-primary/90 text-primary-foreground" : 
                        "h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                      }
                    >
                      {key}
                    </Button>
                  ))}
                  <Button
                    className="col-span-2 h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                    variant="secondary"
                    onClick={() => setStandardInput('')}
                  >
                    Clear
                  </Button>
                  <Button
                    className="col-span-2 h-12 sm:h-10 text-base sm:text-sm bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                    variant="secondary"
                    onClick={() => setStandardInput(standardInput.slice(0, -1))}
                  >
                    ←
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Scientific Calculator */}
            <TabsContent value="scientific">
              <div className="space-y-2">
                <div className="flex justify-end items-center gap-2 mb-2">
                  <span className="text-sm text-muted-foreground">Mode:</span>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsRadianMode(!isRadianMode)}
                    className="bg-muted text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    {isRadianMode ? 'RAD' : 'DEG'}
                  </Button>
                </div>
                <Input
                  type="text"
                  value={scientificInput}
                  onChange={(e) => setScientificInput(e.target.value)}
                  placeholder="Enter expression..."
                  className="text-right text-lg bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground rounded-lg"
                />
                <div className="text-right text-2xl font-semibold min-h-[2rem] text-foreground">
                  {scientificResult}
                </div>
                <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
                  {['sin', 'cos', 'tan', 'π', '^'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setScientificInput(scientificInput + key + (key === 'π' ? '' : '('))}
                      className="h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                    >
                      {key}
                    </Button>
                  ))}
                  {['√', 'log', 'ln', '(', ')'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setScientificInput(scientificInput + key + (key === '√' ? '(' : ''))}
                      className="h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                    >
                      {key}
                    </Button>
                  ))}
                  {['7', '8', '9', '/', '%'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setScientificInput(scientificInput + key)}
                      className="h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                    >
                      {key}
                    </Button>
                  ))}
                  {['4', '5', '6', '*', 'e'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => setScientificInput(scientificInput + key)}
                      className="h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                    >
                      {key}
                    </Button>
                  ))}
                  {['1', '2', '3', '-', '='].map((key) => (
                    <Button
                      key={key}
                      variant={key === '=' ? 'default' : 'secondary'}
                      onClick={() => key === '=' ? calculateScientific() : setScientificInput(scientificInput + key)}
                      className={key === '=' ? 
                        "h-11 sm:h-9 text-sm sm:text-xs bg-primary hover:bg-primary/90 text-primary-foreground px-1" : 
                        "h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                      }
                    >
                      {key}
                    </Button>
                  ))}
                  {['0', '.', 'Clear', '+', '←'].map((key) => (
                    <Button
                      key={key}
                      variant="secondary"
                      onClick={() => {
                        switch (key) {
                          case 'Clear':
                            setScientificInput('');
                            break;
                          case '←':
                            setScientificInput(scientificInput.slice(0, -1));
                            break;
                          default:
                            setScientificInput(scientificInput + key);
                        }
                      }}
                      className="h-11 sm:h-9 text-sm sm:text-xs bg-muted text-foreground hover:bg-accent hover:text-accent-foreground px-1"
                    >
                      {key}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Unit Converter */}
            <TabsContent value="converter">
              <div className="space-y-4">
                <Select
                  value={unitCategory}
                  onValueChange={(value: UnitType) => {
                    setUnitCategory(value);
                    setFromUnit(unitCategories[value][0]);
                    setToUnit(unitCategories[value][1]);
                  }}
                >
                  <SelectTrigger className="bg-muted border-none focus:ring-1 focus:ring-primary text-foreground">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {Object.keys(unitCategories).map((category) => (
                      <SelectItem 
                        key={category} 
                        value={category}
                        className="text-foreground hover:bg-accent"
                      >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Select value={fromUnit} onValueChange={setFromUnit}>
                      <SelectTrigger className="bg-muted border-none focus:ring-1 focus:ring-primary text-foreground">
                        <SelectValue placeholder="From" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {unitCategories[unitCategory].map((unit) => (
                          <SelectItem 
                            key={unit} 
                            value={unit}
                            className="text-foreground hover:bg-accent"
                          >
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={unitValue}
                      onChange={(e) => setUnitValue(e.target.value)}
                      placeholder="Enter value..."
                      className="bg-muted border-none focus-visible:ring-1 focus-visible:ring-primary text-foreground placeholder:text-muted-foreground rounded-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <Select value={toUnit} onValueChange={setToUnit}>
                      <SelectTrigger className="bg-muted border-none focus:ring-1 focus:ring-primary text-foreground">
                        <SelectValue placeholder="To" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        {unitCategories[unitCategory].map((unit) => (
                          <SelectItem 
                            key={unit} 
                            value={unit}
                            className="text-foreground hover:bg-accent"
                          >
                            {unit}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="h-10 px-3 py-2 rounded-lg bg-muted text-foreground flex items-center">
                      {convertedValue || '---'}
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={convertUnit}
                >
                  Convert
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
} 