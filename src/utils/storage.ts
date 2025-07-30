// Client-side storage utility for development mode
// This prevents page reloads by using localStorage instead of file system

interface InvoiceData {
  invoiceNumber: string;
  clientName: string;
  description: string;
  amount: string;
  dueDate: string;
  walletAddress: string;
  createdDate: string;
  status: string;
  noDeadline?: boolean;
}

const STORAGE_KEY = 'crypto-invoices';

export class InvoiceStorage {
  // Check if we're in development mode
  private static isDevelopment(): boolean {
    return import.meta.env.DEV || window.location.hostname === 'localhost';
  }

  // Save invoice to localStorage (development) or API (production)
  static async saveInvoice(invoiceData: InvoiceData): Promise<{ success: boolean; message: string; invoiceNumber: string }> {
    if (this.isDevelopment()) {
      return this.saveToLocalStorage(invoiceData);
    } else {
      return this.saveToAPI(invoiceData);
    }
  }

  // Save to localStorage for development
  private static saveToLocalStorage(invoiceData: InvoiceData): Promise<{ success: boolean; message: string; invoiceNumber: string }> {
    return new Promise((resolve) => {
      try {
        // Get existing invoices
        const existingInvoices = this.getLocalInvoices();
        
        // Add new invoice
        existingInvoices.push(invoiceData);
        
        // Save back to localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(existingInvoices));
        
        console.log(`Invoice ${invoiceData.invoiceNumber} saved to localStorage (development mode)`);
        
        resolve({
          success: true,
          message: 'Invoice saved successfully (development mode)',
          invoiceNumber: invoiceData.invoiceNumber
        });
      } catch (error) {
        console.error('Error saving to localStorage:', error);
        resolve({
          success: false,
          message: 'Failed to save invoice to localStorage',
          invoiceNumber: invoiceData.invoiceNumber
        });
      }
    });
  }

  // Save to API for production
  private static async saveToAPI(invoiceData: InvoiceData): Promise<{ success: boolean; message: string; invoiceNumber: string }> {
    try {
      // Get API URL from environment or use default
      const apiUrl = import.meta.env.VITE_DENO_API_URL || 'http://localhost:8000';
      const endpoint = `${apiUrl}/api/save-invoice`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save invoice');
      }

      const result = await response.json();
      console.log('Invoice saved successfully to API:', result);

      return {
        success: true,
        message: result.message || 'Invoice saved successfully',
        invoiceNumber: invoiceData.invoiceNumber
      };
    } catch (error) {
      console.error('Error saving to API:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to save invoice',
        invoiceNumber: invoiceData.invoiceNumber
      };
    }
  }

  // Get all invoices from localStorage
  private static getLocalInvoices(): InvoiceData[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return [];
    }
  }

  // Get a specific invoice by ID
  static async getInvoice(invoiceNumber: string): Promise<InvoiceData | null> {
    if (this.isDevelopment()) {
      const invoices = this.getLocalInvoices();
      return invoices.find(invoice => invoice.invoiceNumber === invoiceNumber) || null;
    } else {
      return this.getInvoiceFromAPI(invoiceNumber);
    }
  }

  // Get invoice from API for production
  private static async getInvoiceFromAPI(invoiceNumber: string): Promise<InvoiceData | null> {
    try {
      const apiUrl = import.meta.env.VITE_DENO_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/api/get-invoice/${invoiceNumber}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return null;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.success && result.invoice ? result.invoice : null;
    } catch (error) {
      console.error('Error fetching invoice from API:', error);
      return null;
    }
  }

  // Get all invoices (for future use)
  static async getAllInvoices(): Promise<InvoiceData[]> {
    if (this.isDevelopment()) {
      return this.getLocalInvoices();
    } else {
      // TODO: Implement API call to get all invoices
      return [];
    }
  }

  // Update invoice status (e.g., mark as paid)
  static async updateInvoiceStatus(invoiceNumber: string, status: string): Promise<boolean> {
    if (this.isDevelopment()) {
      return this.updateLocalInvoiceStatus(invoiceNumber, status);
    } else {
      // TODO: Implement API call to update invoice status
      return false;
    }
  }

  // Update invoice status in localStorage
  private static updateLocalInvoiceStatus(invoiceNumber: string, status: string): boolean {
    try {
      const invoices = this.getLocalInvoices();
      const invoiceIndex = invoices.findIndex(invoice => invoice.invoiceNumber === invoiceNumber);
      
      if (invoiceIndex !== -1) {
        invoices[invoiceIndex].status = status;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
        console.log(`Invoice ${invoiceNumber} status updated to: ${status}`);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Error updating invoice status:', error);
      return false;
    }
  }

  // Clear all invoices (development utility)
  static clearAllInvoices(): void {
    if (this.isDevelopment()) {
      localStorage.removeItem(STORAGE_KEY);
      console.log('All invoices cleared from localStorage');
    }
  }
}
