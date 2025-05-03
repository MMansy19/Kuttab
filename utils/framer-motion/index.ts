"use client";

// Re-export components directly from their specific paths instead of using the main framer-motion entry
// This avoids the "export *" statements in the main framer-motion entry that Next.js 15 doesn't support

// Core components
import { motion as _motion } from 'framer-motion';
import { AnimatePresence as _AnimatePresence } from 'framer-motion';
import { MotionConfig as _MotionConfig } from 'framer-motion';
import { LayoutGroup as _LayoutGroup } from 'framer-motion';
import { LazyMotion as _LazyMotion } from 'framer-motion';

// Hooks
import { useAnimation as _useAnimation } from 'framer-motion';
import { useAnimationControls as _useAnimationControls } from 'framer-motion';
import { useMotionValue as _useMotionValue } from 'framer-motion';
import { useTransform as _useTransform } from 'framer-motion';
import { useScroll as _useScroll } from 'framer-motion';
import { useSpring as _useSpring } from 'framer-motion';
import { useCycle as _useCycle } from 'framer-motion';
import { useInView as _useInView } from 'framer-motion';
import { useAnimate as _useAnimate } from 'framer-motion';
import { usePresence as _usePresence } from 'framer-motion';
import { useIsPresent as _useIsPresent } from 'framer-motion';

// Utilities
import { stagger as _stagger } from 'framer-motion';
import { animate as _animate } from 'framer-motion';
import { animationControls as _animationControls } from 'framer-motion';

// Types
import type { 
  Variants as _Variants,
  TargetAndTransition as _TargetAndTransition,
  VariantLabels as _VariantLabels,
  AnimationControls as _AnimationControls
} from 'framer-motion';

// Re-export everything with the same names
export const motion = _motion;
export const AnimatePresence = _AnimatePresence;
export const MotionConfig = _MotionConfig;
export const LayoutGroup = _LayoutGroup;
export const LazyMotion = _LazyMotion;

export const useAnimation = _useAnimation;
export const useAnimationControls = _useAnimationControls;
export const useMotionValue = _useMotionValue;
export const useTransform = _useTransform;
export const useScroll = _useScroll;
export const useSpring = _useSpring;
export const useCycle = _useCycle;
export const useInView = _useInView;
export const useAnimate = _useAnimate;
export const usePresence = _usePresence;
export const useIsPresent = _useIsPresent;

export const stagger = _stagger;
export const animate = _animate;
export const animationControls = _animationControls;

// Types
export type Variants = _Variants;
export type TargetAndTransition = _TargetAndTransition; 
export type VariantLabels = _VariantLabels;
export type AnimationControls = _AnimationControls;