'use client';

export interface BuildingSettings {
  name: string;
  address: string;
  emergency_phones: {
    label: string;
    number: string;
    icon?: string;
  }[];
  sum_rules: string;
}

const DEFAULT_SETTINGS: BuildingSettings = {
  name: 'Directorio 1579',
  address: 'Av. Directorio 1579, CABA',
  emergency_phones: [
    { label: 'Seguridad / Portería', number: '11 4567-8900' },
    { label: 'Administración', number: '0800-333-1234' },
    { label: 'Urgencias Ascensores', number: '0810-999-5555' },
    { label: 'Bomberos / Policía', number: '911' }
  ],
  sum_rules: 'El SUM debe dejarse en las mismas condiciones de limpieza en que fue recibido. El horario máximo es hasta las 02:00 AM.'
};

export const settingsService = {
  getSettings(): BuildingSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    const stored = localStorage.getItem('demo_building_settings');
    if (!stored) {
      localStorage.setItem('demo_building_settings', JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    return JSON.parse(stored);
  },

  updateSettings(settings: BuildingSettings): void {
    localStorage.setItem('demo_building_settings', JSON.stringify(settings));
    // Trigger a custom event so other components can react
    window.dispatchEvent(new Event('building_settings_updated'));
  }
};
