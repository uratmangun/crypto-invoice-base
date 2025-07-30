import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  ArrowLeft,
  FileText,
  DollarSign,
  Calendar,
  User,
  Mail,
  Building,
  Wallet,
  Copy,
  CheckCircle,
  Zap,
  LogOut
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { usePrivy } from '@privy-io/react-auth'

interface InvoiceData {
  invoiceNumber: string
  clientName: string
  description: string
  amount: string
  dueDate: string
  walletAddress: string
}

export function CreateInvoice() {
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now()}`,
    clientName: '',
    description: '',
    amount: '',
    dueDate: '',
    walletAddress: ''
  })

  const [isGenerated, setIsGenerated] = useState(false)
  const [paymentLink, setPaymentLink] = useState('')
  const [noDeadline, setNoDeadline] = useState(false)
  
  // Privy authentication and navigation hooks
  const { logout, user } = usePrivy()
  const navigate = useNavigate()
  
  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleInputChange = (field: keyof InvoiceData, value: string) => {
    setInvoiceData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const generateInvoice = () => {
    // Generate payment link using current domain
    const currentDomain = window.location.origin
    const paymentLink = `${currentDomain}/pay/${invoiceData.invoiceNumber}`
    setPaymentLink(paymentLink)
    setIsGenerated(true)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const isFormValid = invoiceData.clientName && 
                     invoiceData.description && invoiceData.amount && 
                     (noDeadline || invoiceData.dueDate) && invoiceData.walletAddress

  if (isGenerated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 flex items-center justify-between">
            <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            
            <div className="flex items-center gap-4">
              {user && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Welcome, {user.email?.address || user.wallet?.address?.slice(0, 6) + '...' + user.wallet?.address?.slice(-4)}
                </span>
              )}
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4" />
              Invoice Generated Successfully
            </div>
            <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
              Your Invoice is Ready!
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Share the payment link with your client to receive USDC payments
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Invoice Preview */}
            <Card className="shadow-xl border-0">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Invoice Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white">INVOICE</h3>
                      <p className="text-gray-600 dark:text-gray-300">{invoiceData.invoiceNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 dark:text-gray-300">Due Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {noDeadline ? 'No deadline' : invoiceData.dueDate}
                      </p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Bill To:</h4>
                    <div className="text-gray-600 dark:text-gray-300">
                      <p className="font-medium">{invoiceData.clientName}</p>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Description:</h4>
                    <p className="text-gray-600 dark:text-gray-300">{invoiceData.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-900 dark:text-white">Total Amount:</span>
                      <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        ${invoiceData.amount} USDC
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Payment Address:</h4>
                    <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded-lg">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {invoiceData.walletAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Link & Actions */}
            <div className="space-y-6">
              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Payment Link
                  </CardTitle>
                  <CardDescription>
                    Share this link with your client for easy payment
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                      <p className="text-sm font-mono text-gray-700 dark:text-gray-300 break-all">
                        {paymentLink}
                      </p>
                    </div>
                    <Button 
                      onClick={() => copyToClipboard(paymentLink)}
                      className="w-full"
                      variant="outline"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Payment Link
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl border-0">
                <CardHeader>
                  <CardTitle>Next Steps</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Share Payment Link</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Send the payment link to your client via email or messaging</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Client Pays</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Client connects wallet and pays with USDC on Base network</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Instant Settlement</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Receive USDC instantly in your wallet</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  onClick={() => setIsGenerated(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Create Another
                </Button>
                <Link to="/" className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-purple-900 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {user.email?.address || user.wallet?.address?.slice(0, 6) + '...' + user.wallet?.address?.slice(-4)}
              </span>
            )}
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4" />
            Powered by Base Network
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            Create New Invoice
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Generate a crypto invoice for USDC payments on Base network
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Invoice Details
            </CardTitle>
            <CardDescription className="text-blue-100">
              Fill in the details below to create your crypto invoice
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="invoiceNumber" className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    Invoice Number
                  </Label>
                  <Input
                    id="invoiceNumber"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                    placeholder="INV-001"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName" className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    Client Name *
                  </Label>
                  <Input
                    id="clientName"
                    value={invoiceData.clientName}
                    onChange={(e) => handleInputChange('clientName', e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="walletAddress" className="flex items-center gap-2 mb-2">
                    <Wallet className="h-4 w-4" />
                    Your Wallet Address *
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="walletAddress"
                      value={invoiceData.walletAddress}
                      onChange={(e) => handleInputChange('walletAddress', e.target.value)}
                      placeholder="0x742d35Cc6634C0532925a3b8D4..."
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (user?.wallet?.address) {
                          handleInputChange('walletAddress', user.wallet.address)
                        }
                      }}
                      disabled={!user?.wallet?.address}
                      className="px-3 whitespace-nowrap"
                    >
                      <Wallet className="h-4 w-4 mr-1" />
                      Use My Wallet
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Base network wallet address where you'll receive USDC payments
                  </p>
                </div>

                <div>
                  <Label htmlFor="description" className="flex items-center gap-2 mb-2">
                    <FileText className="h-4 w-4" />
                    Description/Services *
                  </Label>
                  <Textarea
                    id="description"
                    value={invoiceData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Web development services for Q1 2024&#10;- Frontend development&#10;- Backend API integration&#10;- Testing and deployment"
                    rows={4}
                    required
                  />
                </div>


              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <Label htmlFor="amount" className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4" />
                    Amount (USDC) *
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    value={invoiceData.amount}
                    onChange={(e) => handleInputChange('amount', e.target.value)}
                    placeholder="100.00"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="dueDate" className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4" />
                    Due Date {!noDeadline && '*'}
                  </Label>
                  
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="noDeadline"
                        checked={noDeadline}
                        onChange={(e) => {
                          setNoDeadline(e.target.checked)
                          if (e.target.checked) {
                            handleInputChange('dueDate', '')
                          }
                        }}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <Label htmlFor="noDeadline" className="text-sm text-gray-600 dark:text-gray-300">
                        No deadline
                      </Label>
                    </div>
                    
                    {!noDeadline && (
                      <Input
                        id="dueDate"
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        required={!noDeadline}
                        placeholder="Select due date"
                      />
                    )}
                  </div>
                </div>

              </div>
            </div>

            <div className="mt-8 pt-6 border-t">
              <Button
                onClick={generateInvoice}
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <FileText className="mr-2 h-5 w-5" />
                Generate Invoice
              </Button>
              {!isFormValid && (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                  Please fill in all required fields to generate your invoice
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
