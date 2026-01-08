import axiosInstance from './axios';

// Auth APIs
export const authApi = {
  forgotPassword: (email: string) => axiosInstance.post('/forgot-password/', { email }),
  login: (data: Record<string, unknown>) => axiosInstance.post('/login/', data),
  register: (data: Record<string, unknown>) => axiosInstance.post('/register/', data),
  resetPassword: (data: Record<string, unknown>) => axiosInstance.post('/reset-password/', data),
};

// Blog APIs
export const blogApi = {
  getAll: () => axiosInstance.get<Blog[]>('/blogs'),
  getBySlug: (slug: string) => axiosInstance.get<Blog>(`/blogs/${slug}`),
  create: (data: Partial<Blog>) => axiosInstance.post<Blog>('/blogs', data),
  update: (id: string, data: Partial<Blog>) => axiosInstance.put<Blog>(`/blogs/${id}`, data),
  delete: (id: string) => axiosInstance.delete<void>(`/blogs/${id}`),
};

// Cause APIs
export const causeApi = {
  getAll: () => axiosInstance.get<Cause[]>('/causes'),
  getById: (id: string) => axiosInstance.get<Cause>(`/causes/${id}`),
  create: (data: Partial<Cause>) => axiosInstance.post<Cause>('/causes', data),
  update: (id: string, data: Partial<Cause>) => axiosInstance.put<Cause>(`/causes/${id}`, data),
  delete: (id: string) => axiosInstance.delete<void>(`/causes/${id}`),
};

// Testimonial APIs
export const testimonialApi = {
  getAll: () => axiosInstance.get<Testimonial[]>('/testimonials'),
  create: (data: Partial<Testimonial>) => axiosInstance.post<Testimonial>('/testimonials', data),
  update: (id: string, data: Partial<Testimonial>) => axiosInstance.put<Testimonial>(`/testimonials/${id}`, data),
  delete: (id: string) => axiosInstance.delete<void>(`/testimonials/${id}`),
};

// Donation APIs
export const donationApi = {
  create: (data: DonationData) => axiosInstance.post<DonationResponse>('/donations', data),
  verifyPayPal: (orderId: string) => axiosInstance.post<PayPalVerification>('/donations/verify-paypal', { orderId }),
  uploadProof: async (donationId: string, file: File) => {
    const formData = new FormData();
    formData.append('proof', file);
    formData.append('donationId', donationId);

    return axiosInstance.post('/donations/upload-proof', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  generateReference: () => axiosInstance.get<{ referenceId: string }>('/donations/generate-reference'),
  createPaymentIntent: (data: Record<string, unknown>) => axiosInstance.post('/donations/create-payment-intent', data),
  confirmDonation: (data: Record<string, unknown>) => axiosInstance.post('/donations/confirm', data),
};

// Contact API
export const contactApi = {
  submit: (data: ContactData) => axiosInstance.post<{ success: boolean; message: string }>('/contact', data),
};

// Chatbot API
export const chatbotApi = {
  sendMessage: (message: string) => axiosInstance.post<ChatbotResponse>('/chatbot', { message }),
};

// Type definitions
export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  images: string[];
  quote?: {
    text: string;
    author: string;
  };
  author: string;
  createdAt: string;
  updatedAt: string;
}

export interface Cause {
  id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  goalAmount: number;
  raisedAmount: number;
  category: string;
  featured: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  image: string;
  rating: number;
}

export interface DonationData {
  amount: number;
  currency: string;
  causeId?: string;
  donorName: string;
  donorEmail: string;
  paymentMethod: 'paypal' | 'swift';
  message?: string;
}

export interface DonationResponse {
  id: string;
  referenceId: string;
  status: 'pending' | 'completed' | 'failed';
  paypalOrderId?: string;
}

export interface PayPalVerification {
  success: boolean;
  transactionId: string;
  status: string;
}

export interface ContactData {
  name: string;
  email: string;
  subject: string;
  message: string;
  captchaToken?: string;
}

export interface ChatbotResponse {
  message: string;
  suggestions?: string[];
}
