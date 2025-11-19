# FOIA AI Automation

An AI-powered web application for automating Freedom of Information Act (FOIA) requests. Built with Next.js, Drizzle ORM, and OpenAI, this application helps users create professional, legally sound FOIA requests with AI assistance.

## 🌟 Features

### AI-Powered Content Generation
- **Request Descriptions**: Generate comprehensive, specific FOIA request descriptions from simple topics
- **Fee Waiver Justifications**: AI-crafted justifications demonstrating public interest
- **Expedited Processing Explanations**: Legally sound urgency justifications
- **Agency Component Suggestions**: Smart routing to appropriate government agencies

### FOIA.gov Compliance
- Fully compliant with FOIA.gov API Specification v1.1.0
- Supports all required and optional fields
- Proper payload formatting for agency submissions
- Testing mode for development

### User-Friendly Interface
- Clean, modern UI built with Tailwind CSS and shadcn/ui
- Step-by-step form with clear sections
- Real-time character counts and validation
- Visual feedback for AI-generated content

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (or Neon serverless Postgres)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd foia-ai-automation
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
DATABASE_URL=postgresql://user:password@host:5432/database
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
FOIA_API_SECRET=your-secret-token-here
```

4. **Set up the database**
```bash
npm run db:push
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 📋 Database Schema

The application uses three main tables:

### `foia_requests`
Stores all FOIA request submissions with:
- Requester information (name, contact details, address)
- Agency and component information
- Request details and descriptions
- Fee waiver and expedited processing information
- AI generation tracking flags
- Submission status and agency responses

### `agencies`
Reference data for government agencies:
- Agency name and abbreviation
- Description and website
- Metadata for routing

### `agency_components`
Specific departments/bureaus within agencies:
- Component identification
- API endpoint configuration
- Active status tracking

## 🤖 AI Features

### Request Description Generator
```typescript
POST /api/ai/generate-description
{
  "topic": "Brief description of what you're looking for",
  "context": "Additional context (optional)"
}
```

Generates a comprehensive, legally sound FOIA request description that:
- Specifies exactly what records are being requested
- Includes relevant time frames
- Uses professional, clear language
- Follows FOIA best practices

### Fee Waiver Justification Generator
```typescript
POST /api/ai/generate-fee-waiver
{
  "requestDescription": "Your request description",
  "requesterCategory": "individual|commercial|educational|news_media|non_commercial_scientific",
  "reason": "Why you need a fee waiver (optional)"
}
```

Creates compelling justifications that:
- Explain public interest benefits
- Demonstrate information will be made public
- Show significant contribution to public understanding
- Meet legal standards for fee waivers

### Expedited Processing Justification Generator
```typescript
POST /api/ai/generate-expedited
{
  "requestDescription": "Your request description",
  "urgencyReason": "Why this is urgent"
}
```

Generates justifications that:
- Demonstrate compelling need
- Explain inadequacy of normal processing
- Specify time-sensitive nature
- Meet legal standards for expedited processing

## 📡 API Endpoints

### Submit FOIA Request
```typescript
POST /api/foia/submit
```

Submits a FOIA request according to FOIA.gov API v1.1.0 specification. Supports:
- All required fields (version, request_id, agency, agency_component_name, request_description)
- All optional fields (contact info, address, fees, expedited processing, etc.)
- File attachments (supporting documentation, PDF version)
- Testing mode flag
- Agency API endpoint submission

### Get Requests
```typescript
GET /api/foia/requests?limit=50&offset=0
```

Retrieves submitted FOIA requests with pagination.

## 🏗️ Architecture

```
foia-ai-automation/
├── app/
│   ├── api/
│   │   ├── ai/                    # AI generation endpoints
│   │   │   ├── generate-description/
│   │   │   ├── generate-fee-waiver/
│   │   │   └── generate-expedited/
│   │   └── foia/                  # FOIA submission endpoints
│   │       ├── submit/
│   │       └── requests/
│   ├── requests/                  # Request tracking page
│   └── page.tsx                   # Main form page
├── components/
│   ├── ui/                        # shadcn/ui components
│   └── foia-request-form.tsx      # Main form component
├── lib/
│   ├── ai/
│   │   └── openai.ts              # AI service functions
│   ├── db/
│   │   ├── schema.ts              # Drizzle schema
│   │   └── index.ts               # Database client
│   └── utils.ts                   # Utility functions
└── drizzle.config.ts              # Drizzle configuration
```

## 🔒 Security

- HTTPS-only agency endpoints
- API secret token authentication (FOIA-API-SECRET header)
- Environment variable protection
- Input validation and sanitization
- Rate limiting ready (via api.data.gov or similar)

## 📝 FOIA.gov API Compliance

This application implements the complete FOIA.gov Draft RESTful HTTPS API Spec v1.1.0:

### Required Fields
- ✅ version (1.1.0)
- ✅ request_id (unique identifier)
- ✅ agency (tier 1 agency name)
- ✅ agency_component_name (department/bureau/office)
- ✅ request_description (up to 10,000 characters)
- ✅ pdf (PDF version of request)
- ✅ testing (environment flag)

### Optional Fields
- ✅ Requester information (name, email, phone, fax, organization)
- ✅ Mailing address (all fields)
- ✅ Fee information (amount willing, waiver request, justification)
- ✅ Request category (individual, commercial, educational, etc.)
- ✅ Expedited processing (request and justification)
- ✅ Supporting documentation attachments

### Response Handling
- ✅ Success response (200 OK with tracking number)
- ✅ Error responses (404, 500 with detailed messages)
- ✅ Agency response storage
- ✅ Status tracking

## 🛠️ Development

### Available Scripts

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Database operations
npm run db:push      # Push schema changes
npm run db:studio    # Open Drizzle Studio
npm run db:generate  # Generate migrations
```

### Adding New Features

1. **New AI Generation Type**: Add to `lib/ai/openai.ts` and create corresponding API route
2. **New Form Fields**: Update schema in `lib/db/schema.ts` and form in `components/foia-request-form.tsx`
3. **Agency Integration**: Add agency data to `agencies` and `agency_components` tables

## 📊 Database Migrations

Generate and apply migrations:

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:push

# Or use Drizzle Kit directly
npx drizzle-kit push
```

## 🌐 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
```env
DATABASE_URL=<neon-postgres-url>
OPENAI_API_KEY=<your-openai-key>
NEXT_PUBLIC_APP_URL=<your-production-url>
FOIA_API_SECRET=<secure-random-token>
```

## 📚 Resources

- [FOIA.gov API Specification](https://www.foia.gov/developer/agency-api/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [shadcn/ui Components](https://ui.shadcn.com)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use this project for your own FOIA automation needs.

## ⚠️ Disclaimer

This application is designed to assist with FOIA requests but does not provide legal advice. Users should review all AI-generated content and ensure it accurately represents their needs before submission. Always consult with legal counsel for complex FOIA matters.

## 🎯 Roadmap

- [ ] User authentication and request history
- [ ] Email notifications for status updates
- [ ] Agency database with pre-configured endpoints
- [ ] Template library for common request types
- [ ] Bulk request submission
- [ ] Advanced analytics and reporting
- [ ] Mobile app version
- [ ] Integration with document management systems

## 💡 Use Cases

### Journalists
- Request government documents for investigative reporting
- Track multiple requests across agencies
- Generate professional justifications for fee waivers

### Researchers
- Access government data for academic studies
- Request historical records and datasets
- Expedite time-sensitive research requests

### Citizens
- Exercise transparency rights
- Request personal records
- Investigate government activities

### Legal Professionals
- Gather evidence for cases
- Research regulatory compliance
- Access public records efficiently

---

Built with ❤️ using Next.js, AI, and a commitment to government transparency.