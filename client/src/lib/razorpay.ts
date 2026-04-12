import toast from 'react-hot-toast';

let cachedPromise: Promise<boolean> | null = null;

export const loadRazorpay = () => {
  if (cachedPromise) return cachedPromise;

  cachedPromise = new Promise((resolve) => {
    if ((window as any).Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      cachedPromise = null; // Allow retry on error
      resolve(false);
    };
    document.body.appendChild(script);
  });

  return cachedPromise;
};

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export const openRazorpay = async (options: RazorpayOptions) => {
  const isLoaded = await loadRazorpay();
  if (!isLoaded) {
    toast.error('Razorpay SDK failed to load. Are you online?');
    return;
  }

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
};
