/**
 * Language & RTL context hook fallback
 */
export function useLanguage() {
  return {
    isRTL: false,
    lang: 'en',
    language: 'en',
    t: (key: string, ..._args: unknown[]) => key,
  };
}

export default useLanguage;
