import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { foiaRequests } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.agency || !body.agency_component_name || !body.request_description) {
      return NextResponse.json(
        { error: 'Missing required fields: agency, agency_component_name, request_description' },
        { status: 400 }
      );
    }

    // Generate a unique request ID
    const requestId = Math.floor(Math.random() * 1000000);

    // Prepare the FOIA request payload according to API spec v1.1.0
    const foiaPayload = {
      version: '1.1.0',
      request_id: requestId,
      agency: body.agency,
      agency_component_name: body.agency_component_name,
      name_first: body.name_first || '',
      name_last: body.name_last || '',
      address_line1: body.address_line1 || '',
      address_line2: body.address_line2 || '',
      address_city: body.address_city || '',
      address_state_province: body.address_state_province || '',
      address_zip_postal_code: body.address_zip_postal_code || '',
      address_country: body.address_country || '',
      request_description: body.request_description,
      fee_amount_willing: body.fee_amount_willing || '',
      fee_waiver: body.fee_waiver || 'no',
      fee_waiver_explanation: body.fee_waiver_explanation || '',
      request_category: body.request_category || '',
      expedited_processing: body.expedited_processing || 'no',
      expedited_processing_explanation: body.expedited_processing_explanation || '',
      company_organization: body.company_organization || '',
      email: body.email || '',
      phone_number: body.phone_number || '',
      fax_number: body.fax_number || '',
      attachments_supporting_documentation: body.attachments_supporting_documentation || [],
      pdf: body.pdf || null,
      testing: body.testing || false,
    };

    // Save to database
    const [savedRequest] = await db.insert(foiaRequests).values({
      requestId,
      version: foiaPayload.version,
      agency: foiaPayload.agency,
      agencyComponentName: foiaPayload.agency_component_name,
      nameFirst: foiaPayload.name_first,
      nameLast: foiaPayload.name_last,
      addressLine1: foiaPayload.address_line1,
      addressLine2: foiaPayload.address_line2,
      addressCity: foiaPayload.address_city,
      addressStateProvince: foiaPayload.address_state_province,
      addressZipPostalCode: foiaPayload.address_zip_postal_code,
      addressCountry: foiaPayload.address_country,
      requestDescription: foiaPayload.request_description,
      feeAmountWilling: foiaPayload.fee_amount_willing,
      feeWaiver: foiaPayload.fee_waiver,
      feeWaiverExplanation: foiaPayload.fee_waiver_explanation,
      requestCategory: foiaPayload.request_category,
      expeditedProcessing: foiaPayload.expedited_processing,
      expeditedProcessingExplanation: foiaPayload.expedited_processing_explanation,
      companyOrganization: foiaPayload.company_organization,
      email: foiaPayload.email,
      phoneNumber: foiaPayload.phone_number,
      faxNumber: foiaPayload.fax_number,
      attachmentsSupportingDocumentation: foiaPayload.attachments_supporting_documentation,
      pdf: foiaPayload.pdf,
      testing: foiaPayload.testing,
      status: 'pending',
      aiGeneratedDescription: body.ai_generated_description || false,
      aiGeneratedFeeWaiver: body.ai_generated_fee_waiver || false,
      aiGeneratedExpedited: body.ai_generated_expedited || false,
    }).returning();

    // If agency API endpoint is provided, submit to agency
    if (body.agency_api_endpoint) {
      try {
        const agencyResponse = await fetch(body.agency_api_endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'FOIA-API-SECRET': body.agency_api_secret || process.env.FOIA_API_SECRET || '',
          },
          body: JSON.stringify(foiaPayload),
        });

        const agencyData = await agencyResponse.json();

        // Update request with agency response
        await db.update(foiaRequests)
          .set({
            status: agencyResponse.ok ? 'submitted' : 'failed',
            statusTrackingNumber: agencyData.status_tracking_number || null,
            submittedAt: agencyResponse.ok ? new Date() : null,
            agencyResponse: agencyData,
            agencyResponseCode: agencyResponse.status,
            updatedAt: new Date(),
          })
          .where(eq(foiaRequests.id, savedRequest.id));

        return NextResponse.json({
          success: agencyResponse.ok,
          request_id: savedRequest.id,
          tracking_number: agencyData.status_tracking_number,
          agency_response: agencyData,
          status_code: agencyResponse.status,
        });
      } catch (agencyError) {
        console.error('Error submitting to agency:', agencyError);
        
        await db.update(foiaRequests)
          .set({
            status: 'failed',
            agencyResponse: { error: String(agencyError) },
            updatedAt: new Date(),
          })
          .where(eq(foiaRequests.id, savedRequest.id));

        return NextResponse.json({
          success: false,
          request_id: savedRequest.id,
          error: 'Failed to submit to agency API',
          details: String(agencyError),
        }, { status: 500 });
      }
    }

    // If no agency endpoint, just save as draft
    return NextResponse.json({
      success: true,
      request_id: savedRequest.id,
      status: 'draft',
      message: 'Request saved as draft. No agency endpoint provided.',
    });

  } catch (error) {
    console.error('Error processing FOIA request:', error);
    return NextResponse.json(
      { error: 'Failed to process FOIA request', details: String(error) },
      { status: 500 }
    );
  }
}