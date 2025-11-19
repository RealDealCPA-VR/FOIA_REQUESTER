# Quick Start Guide - FOIA AI Automation

Get your FOIA AI Automation app running in 5 minutes!

## 🚀 Quick Setup

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Add your credentials to `.env`:

```env
# Required: Neon Postgres Database URL
DATABASE_URL=postgresql://user:password@host.neon.tech/foia_automation?sslmode=require

# Required: OpenAI API Key for AI features
OPENAI_API_KEY=sk-proj-...

# Optional: Application URL (defaults to localhost:3000)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Optional: FOIA API Secret for agency submissions
FOIA_API_SECRET=your-secure-random-token
```

### 2. Get Your API Keys

#### Neon Database (Free Tier Available)
1. Go to [neon.tech](https://neon.tech)
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Paste into `DATABASE_URL` in `.env`

#### OpenAI API Key
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `OPENAI_API_KEY` in `.env`

### 3. Install & Run

```bash
# Install dependencies
npm install

# Push database schema to Neon
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) - you're ready to go! 🎉

## 📝 Using the Application

### Creating Your First FOIA Request

1. **Fill in Requester Information**
   - Your name, email, and contact details
   - Mailing address (optional but recommended)

2. **Select Agency**
   - Enter the agency name (e.g., "Department of Justice")
   - Enter the component (e.g., "Office of Information Policy")

3. **Write Request Description**
   - Enter a brief topic (e.g., "FBI surveillance programs 2020-2023")
   - Click "AI Enhance" to generate a professional description
   - Review and edit the AI-generated text

4. **Optional: Request Fee Waiver**
   - Select "Yes" for fee waiver
   - Click "AI Generate" for automatic justification
   - Review and customize as needed

5. **Optional: Request Expedited Processing**
   - Select "Yes" for expedited processing
   - Click "AI Generate" and provide urgency reason
   - Review the generated justification

6. **Submit**
   - Click "Submit FOIA Request"
   - Request is saved to database
   - If agency endpoint configured, automatically submitted

## 🤖 AI Features

### AI-Enhanced Request Descriptions

**Before AI:**
```
FBI surveillance programs
```

**After AI Enhancement:**
```
I am requesting all records, documents, and communications related to 
FBI surveillance programs conducted between January 1, 2020, and 
December 31, 2023, including but not limited to:

1. Internal policies and procedures governing surveillance activities
2. Training materials provided to agents regarding surveillance protocols
3. Statistical data on the number and types of surveillance operations
4. Communications between FBI leadership and other agencies regarding 
   surveillance coordination
5. Any audits or reviews of surveillance program effectiveness

This request specifically seeks records that would shed light on the 
scope, legal basis, and oversight mechanisms for these programs during 
the specified time period.
```

### AI-Generated Fee Waiver Justifications

The AI creates compelling justifications that:
- Demonstrate public interest
- Show how disclosure benefits the public
- Explain your qualifications (journalist, researcher, etc.)
- Meet legal standards for fee waivers

### AI-Generated Expedited Processing

The AI crafts urgency explanations that:
- Demonstrate compelling need
- Explain time sensitivity
- Meet legal requirements for expedited processing

## 🗄️ Database Management

### View Your Database

```bash
# Open Drizzle Studio (visual database browser)
npm run db:studio
```

This opens a web interface at `https://local.drizzle.studio` where you can:
- View all FOIA requests
- See submission status
- Check AI generation flags
- Review agency responses

### Reset Database

```bash
# Push schema changes (creates tables if they don't exist)
npm run db:push
```

## 🔧 Troubleshooting

### "DATABASE_URL is not set" Error
- Make sure `.env` file exists in root directory
- Check that `DATABASE_URL` is properly formatted
- Restart the dev server after adding environment variables

### "OPENAI_API_KEY is not set" Error
- Verify your OpenAI API key is in `.env`
- Make sure the key starts with `sk-`
- Check that you have API credits available

### AI Generation Not Working
- Verify OpenAI API key is valid
- Check your OpenAI account has available credits
- Look at browser console for error messages

### Database Connection Issues
- Verify Neon database is active
- Check connection string format
- Ensure SSL mode is included: `?sslmode=require`

## 📊 Testing the Application

### Test Mode

All requests are submitted with `testing: true` by default. This allows you to:
- Test the full workflow without affecting production
- Verify AI generation works correctly
- Check database storage

### Sample Test Request

Try this sample data:

```
Agency: Department of Justice
Component: Office of Information Policy
Topic: FOIA processing statistics for 2023

Click "AI Enhance" to see the AI generate a full request!
```

## 🚀 Next Steps

### Production Deployment

1. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel
   ```

2. **Add Environment Variables in Vercel**
   - Go to Project Settings → Environment Variables
   - Add `DATABASE_URL` and `OPENAI_API_KEY`
   - Redeploy

3. **Configure Agency Endpoints**
   - Add agency data to `agencies` table
   - Configure API endpoints in `agency_components` table
   - Set up API secret tokens

### Advanced Features

- **User Authentication**: Add NextAuth.js for user accounts
- **Email Notifications**: Set up email alerts for status updates
- **Agency Database**: Pre-populate with government agency data
- **Request Templates**: Create reusable templates for common requests

## 💡 Tips for Best Results

### Writing Effective Topics for AI Enhancement

**Good:**
- "FBI surveillance programs 2020-2023"
- "EPA climate change research funding"
- "State Department communications with foreign officials"

**Better:**
- "FBI domestic surveillance programs targeting environmental activists, 2020-2023, including FISA warrants and informant reports"
- "EPA climate change research funding decisions, grant applications, and peer review processes for fiscal years 2020-2023"

**Best Practice:**
- Be specific about time frames
- Mention specific programs or initiatives
- Include relevant keywords
- Specify document types if known

### Maximizing AI-Generated Content

1. **Provide Context**: The more detail in your topic, the better the AI output
2. **Review and Edit**: Always review AI-generated content before submitting
3. **Combine AI with Expertise**: Use AI as a starting point, then refine with your knowledge
4. **Iterate**: Generate multiple versions and pick the best parts

## 📞 Support

- **Documentation**: See full README.md for detailed information
- **Issues**: Report bugs or request features on GitHub
- **FOIA Resources**: Visit [FOIA.gov](https://www.foia.gov) for official guidance

---

**Ready to automate your FOIA requests? Start creating! 🚀**