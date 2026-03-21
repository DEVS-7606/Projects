import { supabase } from '../config/supabase.js';

export class VendorRepository {
  async findAll(userId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('user_id', userId)
      .order('name');

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  }

  async findById(vendorId: string, userId: string) {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .eq('id', vendorId)
      .eq('user_id', userId)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async create(vendorData: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('vendors')
      .insert(vendorData)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async update(vendorId: string, userId: string, updates: Record<string, unknown>) {
    const { data, error } = await supabase
      .from('vendors')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', vendorId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async delete(vendorId: string, userId: string) {
    const { error } = await supabase
      .from('vendors')
      .delete()
      .eq('id', vendorId)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }
  }
}
