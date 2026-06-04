import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, name, unitId, role = 'resident' } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Missing email or name' }, { status: 400 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Split name into first and last name roughly
    const nameParts = name.trim().split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.slice(1).join(' ');
    
    // We get the building ID from env, or we can fetch it. For now, assume it's the main building
    const BUILDING_ID = process.env.NEXT_PUBLIC_BUILDING_ID || 'b0000000-0000-0000-0000-000000000001';

    // 1. Invite user via Supabase Auth Admin
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const { data: authData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      redirectTo: `${appUrl}/auth/callback?type=invite`,
      data: {
        first_name: firstName,
        last_name: lastName,
        unit_id: unitId,
        role: role
      }
    });

    if (inviteError) {
      console.error("Invite error:", inviteError);
      return NextResponse.json({ error: inviteError.message }, { status: 400 });
    }

    const user = authData.user;

    if (user) {
      // 2. Check if profile exists (in case trigger created it, or they were already invited)
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const profilePayload = {
        first_name: firstName,
        last_name: lastName,
        role: role,
        unit_id: unitId,
        building_id: BUILDING_ID,
      };

      if (!existingProfile) {
        // Create profile
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: user.id,
            ...profilePayload
          });
        
        if (profileError) {
          console.error("Profile creation error:", profileError);
          // Don't fail the request if auth succeeded but profile failed, just log it.
        }
      } else {
        // Update profile
        await supabaseAdmin
          .from('profiles')
          .update(profilePayload)
          .eq('id', user.id);
      }
    }

    return NextResponse.json({ success: true, user: authData.user });
  } catch (error: any) {
    console.error("Unexpected invite error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
