import { pgTable, text, timestamp, integer, boolean, jsonb, varchar } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const foiaRequests = pgTable('foia_requests', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  
  // Request metadata
  version: varchar('version', { length: 10 }).notNull().default('1.1.0'),
  requestId: integer('request_id').notNull(),
  
  // Agency information
  agency: text('agency').notNull(),
  agencyComponentName: text('agency_component_name').notNull(),
  agencyComponentId: integer('agency_component_id'),
  
  // Requester information
  nameFirst: text('name_first'),
  nameLast: text('name_last'),
  email: text('email'),
  phoneNumber: text('phone_number'),
  faxNumber: text('fax_number'),
  companyOrganization: text('company_organization'),
  
  // Address information
  addressLine1: text('address_line1'),
  addressLine2: text('address_line2'),
  addressCity: text('address_city'),
  addressStateProvince: text('address_state_province'),
  addressZipPostalCode: text('address_zip_postal_code'),
  addressCountry: text('address_country'),
  
  // Request details
  requestDescription: text('request_description').notNull(),
  requestCategory: varchar('request_category', { length: 50 }),
  
  // Fee information
  feeAmountWilling: text('fee_amount_willing'),
  feeWaiver: varchar('fee_waiver', { length: 3 }).default('no'),
  feeWaiverExplanation: text('fee_waiver_explanation'),
  
  // Expedited processing
  expeditedProcessing: varchar('expedited_processing', { length: 3 }).default('no'),
  expeditedProcessingExplanation: text('expedited_processing_explanation'),
  
  // Attachments
  attachmentsSupportingDocumentation: jsonb('attachments_supporting_documentation'),
  pdf: jsonb('pdf'),
  
  // Status tracking
  status: varchar('status', { length: 50 }).notNull().default('draft'),
  statusTrackingNumber: text('status_tracking_number'),
  submittedAt: timestamp('submitted_at'),
  
  // AI assistance tracking
  aiGeneratedDescription: boolean('ai_generated_description').default(false),
  aiGeneratedFeeWaiver: boolean('ai_generated_fee_waiver').default(false),
  aiGeneratedExpedited: boolean('ai_generated_expedited').default(false),
  
  // Testing flag
  testing: boolean('testing').default(false),
  
  // Timestamps
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  
  // Response from agency
  agencyResponse: jsonb('agency_response'),
  agencyResponseCode: integer('agency_response_code'),
});

export const agencies = pgTable('agencies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  abbreviation: text('abbreviation'),
  description: text('description'),
  website: text('website'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export const agencyComponents = pgTable('agency_components', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  agencyId: text('agency_id').notNull().references(() => agencies.id),
  componentId: integer('component_id').notNull(),
  name: text('name').notNull(),
  abbreviation: text('abbreviation'),
  apiEndpoint: text('api_endpoint'),
  apiSecretToken: text('api_secret_token'),
  description: text('description'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type FOIARequest = typeof foiaRequests.$inferSelect;
export type NewFOIARequest = typeof foiaRequests.$inferInsert;
export type Agency = typeof agencies.$inferSelect;
export type AgencyComponent = typeof agencyComponents.$inferSelect;