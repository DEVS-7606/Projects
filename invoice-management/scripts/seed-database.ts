/**
 * Database Seeding Script
 * Run this once to populate your Supabase database with sample data
 * 
 * Usage: npx tsx scripts/seed-database.ts
 */

import { createClient } from '@supabase/supabase-js';
import { mockVendors, mockInvoices } from '../src/utils/mockData.js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  console.error('Make sure your .env file has:');
  console.error('  VITE_SUPABASE_URL=...');
  console.error('  VITE_SUPABASE_ANON_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Get current user (you must be logged in)
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      console.error('❌ You must be logged in to seed the database');
      console.log('💡 Please log in to your app first, then run this script');
      process.exit(1);
    }

    console.log(`✅ Authenticated as: ${user.email}\n`);

    // 1. Seed Vendors
    console.log('📦 Seeding vendors...');
    const vendorsToInsert = mockVendors.map(vendor => ({
      user_id: user.id,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      gstin: vendor.gstin,
      address: {
        street: vendor.address,
        city: vendor.city,
        state: vendor.state,
        pincode: vendor.pincode,
      },
      payment_terms: vendor.paymentTerms,
      notes: vendor.notes,
      is_active: vendor.status === 'active',
    }));

    const { data: insertedVendors, error: vendorsError } = await supabase
      .from('vendors')
      .insert(vendorsToInsert)
      .select();

    if (vendorsError) {
      console.error('❌ Error seeding vendors:', vendorsError.message);
      throw vendorsError;
    }

    console.log(`✅ Inserted ${insertedVendors.length} vendors\n`);

    // Create a mapping from old vendor IDs to new ones
    const vendorIdMap = new Map();
    mockVendors.forEach((mockVendor, index) => {
      vendorIdMap.set(mockVendor.id, insertedVendors[index].id);
    });

    // 2. Seed Invoices
    console.log('📄 Seeding invoices...');
    const invoicesToInsert = mockInvoices.map(invoice => ({
      user_id: user.id,
      vendor_id: vendorIdMap.get(invoice.vendorId),
      invoice_number: invoice.invoiceNumber,
      invoice_date: invoice.invoiceDate,
      due_date: invoice.dueDate,
      subtotal: invoice.subtotal,
      cgst_amount: invoice.cgst,
      sgst_amount: invoice.sgst,
      igst_amount: invoice.igst,
      tax_total: invoice.taxTotal,
      total_amount: invoice.amount,
      currency: invoice.currency,
      status: invoice.status,
      source: invoice.source,
      payment_reference: invoice.paymentReference,
      paid_at: invoice.paidDate,
      payment_method: invoice.paymentMethod,
    }));

    const { data: insertedInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .insert(invoicesToInsert)
      .select();

    if (invoicesError) {
      console.error('❌ Error seeding invoices:', invoicesError.message);
      throw invoicesError;
    }

    console.log(`✅ Inserted ${insertedInvoices.length} invoices\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Vendors: ${insertedVendors.length}`);
    console.log(`   - Invoices: ${insertedInvoices.length}`);
    console.log('\n✨ You can now use the app with real data from Supabase!');

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
