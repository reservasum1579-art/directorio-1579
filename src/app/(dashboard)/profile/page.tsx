import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import ProfileClient from './ProfileClient';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mi Perfil' };
export const dynamic = 'force-dynamic';

const DEFAULT_AVATAR = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSwWmfUu3Pw4xRc2tapDLN86_g_jbGEIkQp3t4TMPF2K343KmAd6tJCl1U2nvnQDt4hrhTQ01G_NCF8uYsfqLeBh9XBzrZx6I8wvFeTqfRse0u3-hqAhEsvfZgfxmW_zCY85ni-X-vS9EOq4erjRBiirMWNcuTkHYF19gp20fdyz9ovmUo4vPA6jELmkvjBcQmlfEfuY27L28QrUzYqToKgr27rm7KyjDs6gfis9FaLOxt_xJ8qjZ9Sw_1m-7TjmW-VK3ljWGBTszD';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profileData } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, phone, avatar_url, floor, unit_id, garage_id, garage_label')
    .eq('id', user.id)
    .single() as any;

  // Fetch all units for garage lookup and list display
  const { data: unitsData } = await supabase
    .from('units')
    .select('id, floor, unit_number')
    .order('floor');

  // Resolve garage display name using unitsData
  let garageDisplay = 'Sin asignar';
  if (profileData?.garage_label) {
    garageDisplay = profileData.garage_label;
  } else if (profileData?.garage_id && unitsData) {
    const garage = unitsData.find((u:any) => u.id === profileData.garage_id);
    if (garage) {
      garageDisplay = garage.unit_number ? `${garage.floor}° ${garage.unit_number}` : `Cochera ${garage.id}`;
    }
  }

  // Resolve unit display name
  let unitDisplay = 'Sin asignar';
  if (profileData?.unit_id && unitsData) {
    const unit = unitsData.find((u:any) => u.id === profileData.unit_id);
    if (unit) {
      unitDisplay = unit.unit_number ? `${unit.floor}° ${unit.unit_number}` : `Piso ${unit.floor}`;
    }
  }




  const initialProfile = {
    id: user.id,
    first_name: profileData?.first_name || '',
    last_name: profileData?.last_name || '',
    email: user.email || '',
    phone: profileData?.phone || '',
    unit: unitDisplay,
    garage: garageDisplay,
    avatar_url: profileData?.avatar_url || DEFAULT_AVATAR,
  };


  return (
    <>
      <ProfileClient initialProfile={initialProfile} />
      {/* Lista de departamentos */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Departamentos</h2>
        {unitsData?.length ? (
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unitsData.map((unit:any) => (
              <li key={unit.id} className="p-4 bg-gray-100 rounded shadow">
                <p className="font-medium">Piso {unit.floor}</p>
                <p>Unidad {unit.unit_number}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay departamentos registrados.</p>
        )}
      </section>
    </>
  );
}

