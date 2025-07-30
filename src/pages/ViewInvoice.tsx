import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Clock, DollarSign, User, Wallet, FileText, CheckCircle } from 'lucide-react'
import { InvoiceStorage } from '@/utils/storage'
import { pay, getPaymentStatus } from '@base-org/account'
import { BasePayButton } from '@base-org/account-ui/react'

interface InvoiceData {
  invoiceNumber: string
  clientName: string
  description: string
  amount: string
  dueDate: string
  walletAddress: string
  status: string
  createdDate: string
  noDeadline?: boolean
}

export default function ViewInvoice() {
  const { invoiceId } = useParams<{ invoiceId: string }>()
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentInProgress, setPaymentInProgress] = useState(false)

  // Fetch real invoice data from API
  useEffect(() => {
    const fetchInvoiceData = async () => {
      if (!invoiceId) {
        setIsLoading(false)
        return
      }

      setIsLoading(true)
      
      try {
        // Use InvoiceStorage to get invoice (localStorage in dev, API in production)
        const invoice = await InvoiceStorage.getInvoice(invoiceId)
        
        if (invoice) {
          setInvoiceData(invoice)
          console.log('Invoice loaded successfully:', invoice)
        } else {
          console.error('Invoice not found:', invoiceId)
          setInvoiceData(null)
        }
      } catch (error) {
        console.error('Error fetching invoice:', error)
        setInvoiceData(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoiceData()
  }, [invoiceId])

  const handlePayInvoice = async () => {
    if (!invoiceData) return
    
    setPaymentInProgress(true)
    
    try {
      // Initiate Base Pay transaction
      const paymentResult = await pay({
        amount: invoiceData.amount,
        to: invoiceData.walletAddress,
        testnet: true // Set to false for mainnet
      })
      
      // Check payment result according to Base Pay documentation
      if (paymentResult && typeof paymentResult === 'object' && 'success' in paymentResult) {
        if (paymentResult.success) {
          console.log('Payment successful:', paymentResult)
          
          // Update invoice status
          const success = await InvoiceStorage.updateInvoiceStatus(invoiceData.invoiceNumber, 'paid')
          
          if (success) {
            setInvoiceData({
              ...invoiceData,
              status: 'paid'
            })
            alert('🎉 Payment successful! Transaction has been confirmed on the Base network.')
          } else {
            throw new Error('Failed to update invoice status')
          }
        } else {
          // Handle payment failure
          console.log('Payment failed:', paymentResult.error)
          
          // Check for specific rejection errors
          const errorMsg = paymentResult.error || 'Payment failed'
          if (errorMsg.includes('rejected') || errorMsg.includes('denied')) {
            alert('Payment was cancelled. You can try again when ready.')
          } else {
            alert(`Payment failed: ${errorMsg}`)
          }
        }
      } else {
        // Assume success if no error structure (fallback for different API versions)
        console.log('Payment completed:', paymentResult)
        
        const success = await InvoiceStorage.updateInvoiceStatus(invoiceData.invoiceNumber, 'paid')
        
        if (success) {
          setInvoiceData({
            ...invoiceData,
            status: 'paid'
          })
          alert('🎉 Payment successful! Transaction has been confirmed on the Base network.')
        } else {
          throw new Error('Failed to update invoice status')
        }
      }
      
    } catch (error: any) {
      console.error('Payment error:', error)
      
      // Handle wallet connection/rejection errors
      if (error.code === 4001) {
        alert('Payment cancelled. You rejected the wallet connection.')
      } else if (error.message && (error.message.includes('rejected') || error.message.includes('denied') || error.message.includes('cancelled'))) {
        alert('Payment was cancelled. You can try again when ready.')
      } else {
        const errorMessage = error instanceof Error ? error.message : 'Payment failed. Please try again.'
        alert(`Payment failed: ${errorMessage}`)
      }
    } finally {
      setPaymentInProgress(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400'
      case 'overdue': return 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
      default: return 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20 dark:text-yellow-400'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid': return 'Paid'
      case 'overdue': return 'Overdue'
      default: return 'Pending Payment'
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading invoice...</p>
        </div>
      </div>
    )
  }

  if (!invoiceData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Invoice Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300">The invoice you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Crypto Invoice
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Secure payment with USDC on Base network
          </p>
        </div>

        {/* Invoice Card */}
        <Card className="mb-8 shadow-xl border-0 bg-white dark:bg-gray-800">
          <CardHeader className="border-b bg-gray-50 dark:bg-gray-700/50">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  INVOICE
                </CardTitle>
                <p className="text-gray-600 dark:text-gray-300">{invoiceData.invoiceNumber}</p>
              </div>
              <div className="text-right">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(invoiceData.status)}`}>
                  {invoiceData.status === 'paid' && <CheckCircle className="h-4 w-4 mr-1" />}
                  {getStatusText(invoiceData.status)}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Invoice Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Invoice Details
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Client</p>
                        <p className="font-medium text-gray-900 dark:text-white">{invoiceData.clientName}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Created Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">{invoiceData.createdDate}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-gray-500" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Due Date</p>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {invoiceData.noDeadline ? 'No deadline' : invoiceData.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-sans">
                      {invoiceData.description}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Payment Details
                  </h3>
                  
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-6 rounded-lg border">
                    <div className="flex items-center gap-3 mb-4">
                      <DollarSign className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Amount Due</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                          ${invoiceData.amount} <span className="text-lg text-gray-500">USDC</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Wallet className="h-5 w-5 text-gray-500 mt-1" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Payment Address</p>
                        <p className="font-mono text-sm text-gray-900 dark:text-white break-all">
                          {invoiceData.walletAddress}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Base Network • USDC Only
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Action */}
                <div>
                  {invoiceData.status === 'paid' ? (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 p-4 rounded-lg text-center">
                      <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <h3 className="font-semibold text-green-800 dark:text-green-400">Payment Received</h3>
                      <p className="text-sm text-green-600 dark:text-green-300">
                        This invoice has been paid successfully.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {paymentInProgress ? (
                        <div className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 text-lg font-semibold shadow-lg rounded-lg flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing Payment...
                        </div>
                      ) : (
                        <div className="w-full">
                          <BasePayButton
                            colorScheme="light"
                            onClick={handlePayInvoice}
                          />
                        </div>
                      )}
                      <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                        Secure payment powered by Base Pay • USDC on Base Network
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t pt-6">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>This invoice is powered by <strong>Crypto Invoice Generator</strong></p>
                <p>Secure payments on Base network with USDC</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
