/**
 * Simple Database Seeding Script
 * This version uses the service role key to bypass RLS
 * 
 * Usage: 
 * 1. Get your user ID from Supabase Dashboard > Authentication > Users
 * 2. Run: USER_ID=your-user-id npm run seed:simple
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
  process.exit(1);
}

// Get user ID from environment or use a default test user
const userId = process.env.USER_ID;

if (!userId) {
  console.error('❌ USER_ID not provided');
  console.error('\n📝 How to get your USER_ID:');
  console.error('   1. Go to: https://supabase.com/dashboard/project/xaccdvaayyfjfpeqehjr/auth/users');
  console.error('   2. Find your user and copy the ID');
  console.error('   3. Run: USER_ID=your-user-id npm run seed:simple');
  console.error('\n💡 Or create a user first by signing up in the app');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedDatabase() {
  console.log('🌱 Starting database seeding...\n');
  console.log(`👤 Using User ID: ${userId}\n`);

  try {
    // 1. Seed Vendors
    console.log('📦 Seeding vendors...');
    const vendorsToInsert = mockVendors.map(vendor => ({
      user_id: userId,
      name: vendor.name,
      email: vendor.email,
      phone: vendor.phone,
      gstin: vendor.gstin,
      address: `${vendor.address}, ${vendor.city}, ${vendor.state} ${vendor.pincode}`,
      default_payment_terms_days: vendor.paymentTerms,
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
      user_id: userId,
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
      payment_reference: invoice.paymentReference || null,
      paid_at: invoice.paidDate || null,
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
    console.log(`\n🔗 View your data: https://supabase.com/dashboard/project/xaccdvaayyfjfpeqehjr/editor`);

  } catch (error) {
    console.error('\n❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
