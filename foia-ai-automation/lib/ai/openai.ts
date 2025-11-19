import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is not set');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateRequestDescription(topic: string, context?: string): Promise<string> {
  const prompt = `You are an expert at writing Freedom of Information Act (FOIA) requests. Generate a clear, specific, and legally sound FOIA request description based on the following information:

Topic: ${topic}
${context ? `Additional Context: ${context}` : ''}

The request description should:
1. Be specific about what records are being requested
2. Include relevant time frames if applicable
3. Use clear, professional language
4. Be comprehensive but concise (aim for 200-500 words)
5. Follow FOIA best practices

Generate only the request description text, without any preamble or explanation.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert FOIA request writer who helps citizens craft effective Freedom of Information Act requests.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 1000,
  });

  return completion.choices[0].message.content || '';
}

export async function generateFeeWaiverJustification(
  requestDescription: string,
  requesterCategory: string,
  reason?: string
): Promise<string> {
  const prompt = `Generate a compelling fee waiver justification for a FOIA request with the following details:

Request Description: ${requestDescription}
Requester Category: ${requesterCategory}
${reason ? `Reason for Fee Waiver: ${reason}` : ''}

The justification should:
1. Explain how disclosure serves the public interest
2. Demonstrate that the information will be made available to the public
3. Show that disclosure is likely to contribute significantly to public understanding
4. Be persuasive and legally sound
5. Be 150-300 words

Generate only the fee waiver justification text, without any preamble.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at writing FOIA fee waiver justifications that demonstrate public interest.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 800,
  });

  return completion.choices[0].message.content || '';
}

export async function generateExpeditedProcessingJustification(
  requestDescription: string,
  urgencyReason: string
): Promise<string> {
  const prompt = `Generate a compelling expedited processing justification for a FOIA request:

Request Description: ${requestDescription}
Urgency Reason: ${urgencyReason}

The justification should:
1. Demonstrate compelling need (imminent threat to life/safety OR urgency to inform the public about actual or alleged federal government activity)
2. Explain why normal processing timeframes are inadequate
3. Be specific about the time-sensitive nature
4. Be persuasive and legally sound
5. Be 100-250 words

Generate only the expedited processing justification text, without any preamble.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at writing FOIA expedited processing justifications that meet legal standards.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
    max_tokens: 600,
  });

  return completion.choices[0].message.content || '';
}

export async function suggestAgencyComponent(requestTopic: string, agencies: any[]): Promise<string> {
  const agencyList = agencies.map(a => `- ${a.name} (${a.abbreviation}): ${a.description || 'N/A'}`).join('\n');
  
  const prompt = `Based on the following FOIA request topic, suggest the most appropriate agency component:

Request Topic: ${requestTopic}

Available Agencies:
${agencyList}

Respond with only the agency name that best matches the request topic.`;

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are an expert at routing FOIA requests to the appropriate government agencies.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.3,
    max_tokens: 100,
  });

  return completion.choices[0].message.content || '';
}