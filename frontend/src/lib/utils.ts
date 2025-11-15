import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @brief function to merge tailwind classes for shadcn components
 * @param inputs tailwind classes
 * @returns merged tailwind classes for shadcn components
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
