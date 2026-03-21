/**
 * Verify Database Data
 * Quick script to check if data exists in Supabase
 */

import { createClient } from '@supabase/supabase-js';
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
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifyData() {
  console.log('🔍 Verifying database data...\n');

  try {
    // Check vendors
    const { data: vendors, error: vendorsError } = await supabase
      .from('vendors')
      .select('id, name, is_active')
      .order('name');

    if (vendorsError) throw vendorsError;

    console.log(`✅ Vendors: ${vendors?.length || 0} found`);
    vendors?.forEach(v => {
      console.log(`   - ${v.name} ${v.is_active ? '(active)' : '(inactive)'}`);
    });

    // Check invoices
    const { data: invoices, error: invoicesError } = await supabase
      .from('invoices')
      .select('invoice_number, total_amount, status, vendor:vendors(name)')
      .order('invoice_date', { ascending: false });

    if (invoicesError) throw invoicesError;

    console.log(`\n✅ Invoices: ${invoices?.length || 0} found`);
    invoices?.forEach(i => {
      const vendor = (i.vendor as any)?.name || 'Unknown';
      console.log(`   - ${i.invoice_number}: ₹${i.total_amount} (${i.status}) - ${vendor}`);
    });

    // Calculate stats
    const totalInvoices = invoices?.length || 0;
    const unpaidAmount = invoices
      ?.filter(i => i.status === 'unpaid')
      .reduce((sum, i) => sum + Number(i.total_amount), 0) || 0;
    const overdueAmount = invoices
      ?.filter(i => i.status === 'overdue')
      .reduce((sum, i) => sum + Number(i.total_amount), 0) || 0;
    const paidAmount = invoices
      ?.filter(i => i.status === 'paid')
      .reduce((sum, i) => sum + Number(i.total_amount), 0) || 0;

    console.log('\n📊 Dashboard Stats:');
    console.log(`   - Total Invoices: ${totalInvoices}`);
    console.log(`   - Unpaid Amount: ₹${unpaidAmount.toLocaleString('en-IN')}`);
    console.log(`   - Overdue Amount: ₹${overdueAmount.toLocaleString('en-IN')}`);
    console.log(`   - Paid Amount: ₹${paidAmount.toLocaleString('en-IN')}`);

    console.log('\n🎉 Data verification complete!');
    console.log('\n💡 Next step: Refresh your dashboard at http://localhost:5173/dashboard');

  } catch (error) {
    console.error('\n❌ Verification failed:', error);
    process.exit(1);
  }
}

verifyData();
