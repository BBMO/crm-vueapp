import type { AxiosPromise } from 'axios'
import { api } from 'src/boot/axios'

class CalendarService {
  /**
   * Calendar categories
   */
  getQuoteCategories(): AxiosPromise {
    return api.get('/quote-categories');
  }

  createQuoteCategory(payload: object): AxiosPromise {
    return api.post('/quote-category', payload);
  }

  updateQuoteCategory(id: string, payload: object): AxiosPromise {
    return api.put(`/quote-category/${id}`, payload);
  }

  deleteQuoteCategory(id: string): AxiosPromise {
    return api.delete(`/quote-category/${id}`);
  }

  /**
   * Quotes
   */
  getQuotes(year: string): AxiosPromise {
    return api.get(`/quotes?year=${year}`);
  }

  createQuote(payload: object): AxiosPromise {
    return api.post('/quote', payload);
  }

  updateQuote(id: string, payload: object): AxiosPromise {
    return api.put(`/quote/${id}`, payload);
  }

  deleteQuote(id: string): AxiosPromise {
    return api.delete(`/quote/${id}`);
  }
}

export default new CalendarService()
