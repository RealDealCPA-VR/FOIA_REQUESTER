'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Loader2, Send, CheckCircle2 } from 'lucide-react';

export default function FOIARequestForm() {
  const [formData, setFormData] = useState({
    // Requester Information
    name_first: '',
    name_last: '',
    email: '',
    phone_number: '',
    company_organization: '',
    
    // Address
    address_line1: '',
    address_line2: '',
    address_city: '',
    address_state_province: '',
    address_zip_postal_code: '',
    address_country: 'United States',
    
    // Agency Information
    agency: '',
    agency_component_name: '',
    
    // Request Details
    request_description: '',
    request_category: 'individual',
    
    // Fee Information
    fee_amount_willing: '',
    fee_waiver: 'no',
    fee_waiver_explanation: '',
    
    // Expedited Processing
    expedited_processing: 'no',
    expedited_processing_explanation: '',
  });

  const [aiLoading, setAiLoading] = useState({
    description: false,
    feeWaiver: false,
    expedited: false,
  });

  const [aiGenerated, setAiGenerated] = useState({
    description: false,
    feeWaiver: false,
    expedited: false,
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const generateDescription = async () => {
    if (!formData.request_description) {
      alert('Please enter a brief topic or description first');
      return;
    }

    setAiLoading(prev => ({ ...prev, description: true }));
    try {
      const response = await fetch('/api/ai/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.request_description,
          context: `Agency: ${formData.agency}, Component: ${formData.agency_component_name}`,
        }),
      });

      const data = await response.json();
      if (data.description) {
        setFormData(prev => ({ ...prev, request_description: data.description }));
        setAiGenerated(prev => ({ ...prev, description: true }));
      }
    } catch (error) {
      console.error('Error generating description:', error);
      alert('Failed to generate description');
    } finally {
      setAiLoading(prev => ({ ...prev, description: false }));
    }
  };

  const generateFeeWaiver = async () => {
    if (!formData.request_description) {
      alert('Please enter a request description first');
      return;
    }

    setAiLoading(prev => ({ ...prev, feeWaiver: true }));
    try {
      const response = await fetch('/api/ai/generate-fee-waiver', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestDescription: formData.request_description,
          requesterCategory: formData.request_category,
        }),
      });

      const data = await response.json();
      if (data.justification) {
        setFormData(prev => ({ 
          ...prev, 
          fee_waiver: 'yes',
          fee_waiver_explanation: data.justification 
        }));
        setAiGenerated(prev => ({ ...prev, feeWaiver: true }));
      }
    } catch (error) {
      console.error('Error generating fee waiver:', error);
      alert('Failed to generate fee waiver justification');
    } finally {
      setAiLoading(prev => ({ ...prev, feeWaiver: false }));
    }
  };

  const generateExpedited = async () => {
    if (!formData.request_description) {
      alert('Please enter a request description first');
      return;
    }

    const urgencyReason = prompt('Please briefly describe why this request is urgent:');
    if (!urgencyReason) return;

    setAiLoading(prev => ({ ...prev, expedited: true }));
    try {
      const response = await fetch('/api/ai/generate-expedited', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requestDescription: formData.request_description,
          urgencyReason,
        }),
      });

      const data = await response.json();
      if (data.justification) {
        setFormData(prev => ({ 
          ...prev, 
          expedited_processing: 'yes',
          expedited_processing_explanation: data.justification 
        }));
        setAiGenerated(prev => ({ ...prev, expedited: true }));
      }
    } catch (error) {
      console.error('Error generating expedited justification:', error);
      alert('Failed to generate expedited processing justification');
    } finally {
      setAiLoading(prev => ({ ...prev, expedited: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/foia/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ai_generated_description: aiGenerated.description,
          ai_generated_fee_waiver: aiGenerated.feeWaiver,
          ai_generated_expedited: aiGenerated.expedited,
          testing: true, // Mark as testing for now
        }),
      });

      const result = await response.json();
      setSubmitResult(result);
    } catch (error) {
      console.error('Error submitting request:', error);
      setSubmitResult({ success: false, error: 'Failed to submit request' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl mx-auto">
      {/* Requester Information */}
      <Card>
        <CardHeader>
          <CardTitle>Requester Information</CardTitle>
          <CardDescription>Your contact information for this FOIA request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name_first">First Name</Label>
              <Input
                id="name_first"
                name="name_first"
                value={formData.name_first}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name_last">Last Name</Label>
              <Input
                id="name_last"
                name="name_last"
                value={formData.name_last}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone_number">Phone Number</Label>
              <Input
                id="phone_number"
                name="phone_number"
                type="tel"
                value={formData.phone_number}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company_organization">Company/Organization (Optional)</Label>
              <Input
                id="company_organization"
                name="company_organization"
                value={formData.company_organization}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card>
        <CardHeader>
          <CardTitle>Mailing Address</CardTitle>
          <CardDescription>Where should responses be sent?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address_line1">Address Line 1</Label>
            <Input
              id="address_line1"
              name="address_line1"
              value={formData.address_line1}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
            <Input
              id="address_line2"
              name="address_line2"
              value={formData.address_line2}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address_city">City</Label>
              <Input
                id="address_city"
                name="address_city"
                value={formData.address_city}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_state_province">State/Province</Label>
              <Input
                id="address_state_province"
                name="address_state_province"
                value={formData.address_state_province}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address_zip_postal_code">ZIP/Postal Code</Label>
              <Input
                id="address_zip_postal_code"
                name="address_zip_postal_code"
                value={formData.address_zip_postal_code}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address_country">Country</Label>
            <Input
              id="address_country"
              name="address_country"
              value={formData.address_country}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Agency Information */}
      <Card>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>Which agency should receive this request?</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="agency">Agency Name *</Label>
            <Input
              id="agency"
              name="agency"
              required
              value={formData.agency}
              onChange={handleInputChange}
              placeholder="e.g., Department of Justice"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="agency_component_name">Agency Component *</Label>
            <Input
              id="agency_component_name"
              name="agency_component_name"
              required
              value={formData.agency_component_name}
              onChange={handleInputChange}
              placeholder="e.g., Office of Information Policy"
            />
          </div>
        </CardContent>
      </Card>

      {/* Request Description */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Request Description *</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateDescription}
              disabled={aiLoading.description}
            >
              {aiLoading.description ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : aiGenerated.description ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {aiLoading.description ? 'Generating...' : aiGenerated.description ? 'AI Enhanced' : 'AI Enhance'}
            </Button>
          </CardTitle>
          <CardDescription>
            Describe the records you are requesting. Be as specific as possible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            name="request_description"
            required
            value={formData.request_description}
            onChange={handleInputChange}
            rows={8}
            maxLength={10000}
            placeholder="Enter a brief topic, then click 'AI Enhance' to generate a detailed request description..."
          />
          <p className="text-xs text-muted-foreground">
            {formData.request_description.length} / 10,000 characters
          </p>

          <div className="space-y-2">
            <Label htmlFor="request_category">Requester Category</Label>
            <select
              id="request_category"
              name="request_category"
              value={formData.request_category}
              onChange={handleInputChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="individual">Individual</option>
              <option value="commercial">Commercial Use</option>
              <option value="educational">Educational Institution</option>
              <option value="news_media">Representative of the News Media</option>
              <option value="non_commercial_scientific">Non-commercial Scientific Institution</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Fee Waiver */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Fee Waiver Request</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateFeeWaiver}
              disabled={aiLoading.feeWaiver}
            >
              {aiLoading.feeWaiver ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : aiGenerated.feeWaiver ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {aiLoading.feeWaiver ? 'Generating...' : aiGenerated.feeWaiver ? 'AI Generated' : 'AI Generate'}
            </Button>
          </CardTitle>
          <CardDescription>Request that fees be waived for this request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fee_waiver">Request Fee Waiver?</Label>
            <select
              id="fee_waiver"
              name="fee_waiver"
              value={formData.fee_waiver}
              onChange={handleInputChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {formData.fee_waiver === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="fee_waiver_explanation">Fee Waiver Justification</Label>
              <Textarea
                name="fee_waiver_explanation"
                value={formData.fee_waiver_explanation}
                onChange={handleInputChange}
                rows={6}
                maxLength={10000}
                placeholder="Explain why fees should be waived..."
              />
            </div>
          )}

          {formData.fee_waiver === 'no' && (
            <div className="space-y-2">
              <Label htmlFor="fee_amount_willing">Amount Willing to Pay (USD)</Label>
              <Input
                id="fee_amount_willing"
                name="fee_amount_willing"
                type="number"
                value={formData.fee_amount_willing}
                onChange={handleInputChange}
                placeholder="25"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Expedited Processing */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Expedited Processing</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={generateExpedited}
              disabled={aiLoading.expedited}
            >
              {aiLoading.expedited ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : aiGenerated.expedited ? (
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              ) : (
                <Sparkles className="h-4 w-4" />
              )}
              {aiLoading.expedited ? 'Generating...' : aiGenerated.expedited ? 'AI Generated' : 'AI Generate'}
            </Button>
          </CardTitle>
          <CardDescription>Request expedited processing for urgent matters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="expedited_processing">Request Expedited Processing?</Label>
            <select
              id="expedited_processing"
              name="expedited_processing"
              value={formData.expedited_processing}
              onChange={handleInputChange}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>

          {formData.expedited_processing === 'yes' && (
            <div className="space-y-2">
              <Label htmlFor="expedited_processing_explanation">Expedited Processing Justification</Label>
              <Textarea
                name="expedited_processing_explanation"
                value={formData.expedited_processing_explanation}
                onChange={handleInputChange}
                rows={6}
                maxLength={10000}
                placeholder="Explain why expedited processing is needed..."
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Submit FOIA Request
            </>
          )}
        </Button>
      </div>

      {/* Submit Result */}
      {submitResult && (
        <Card className={submitResult.success ? 'border-green-500' : 'border-red-500'}>
          <CardHeader>
            <CardTitle className={submitResult.success ? 'text-green-600' : 'text-red-600'}>
              {submitResult.success ? 'Request Submitted Successfully!' : 'Submission Failed'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-muted p-4 rounded-md overflow-auto">
              {JSON.stringify(submitResult, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </form>
  );
}