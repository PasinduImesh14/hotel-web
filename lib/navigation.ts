import type { AppRouterInstance } from 'next/navigation';

export function safePush(router: AppRouterInstance | any, url?: string) {
  if (!url || !url.trim()) {
    console.error('Redirect URL missing');
    return;
  }

  try {
    // Prefer router.push but catch any runtime errors
    if (router && typeof router.push === 'function') {
      router.push(url);
    } else {
      console.error('Router is not available to navigate to:', url);
    }
  } catch (err) {
    console.error('Navigation error:', err);
  }
}
