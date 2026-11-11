/**
 * Language & RTL context hook fallback
 */
export function useLanguage() {
  return {
    isRTL: false,
    language: 'en',
    t: (key: string) => key,
  };
}

export default useLanguage;

