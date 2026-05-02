"use client";

import { useState, useCallback, useEffect, useRef } from "react";

interface UseFormWizardOptions {
  totalSteps: number;
  onStepChange?: (step: number, direction: "next" | "prev") => void;
}

export function useFormWizard({ totalSteps, onStepChange }: UseFormWizardOptions) {
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const prevStepRef = useRef(1);

  const goToStep = useCallback(
    (step: number) => {
      if (step < 1 || step > totalSteps) return;
      const dir = step > currentStep ? "next" : "prev";
      setDirection(dir);
      prevStepRef.current = currentStep;
      setCurrentStep(step);
      onStepChange?.(step, dir);
    },
    [currentStep, totalSteps, onStepChange]
  );

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps) {
      setCompletedSteps((prev) => new Set(prev).add(currentStep));
      goToStep(currentStep + 1);
    }
  }, [currentStep, totalSteps, goToStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      goToStep(currentStep - 1);
    }
  }, [currentStep, goToStep]);

  const markCompleted = useCallback((step: number) => {
    setCompletedSteps((prev) => new Set(prev).add(step));
  }, []);

  const progress = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return {
    currentStep,
    totalSteps,
    direction,
    completedSteps,
    progress,
    goToStep,
    nextStep,
    prevStep,
    markCompleted,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
  };
}
