const Coolify = {
  base: 'http://72.62.240.208:8000',
  token: '44|l1MFA4FTheqQ1Qxme30dYnMIC2ec1vhGubv9alew8176bdd4',
  async request(endpoint, options = {}) {
    const url = `${this.base}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
        'Content-Type': 'application/json',
      },
      ...options,
    });
    const text = await response.text();
    try {
      return { success: response.ok, data: JSON.parse(text), status: response.status, text };
    } catch {
      return { success: response.ok, data: null, status: response.status, text };
    }
  },
};

async function main() {
  console.log('=== Coolify Deployment ===');
  
  // List applications to find Canvas Cartel
  console.log('\n[1] Listing applications...');
  const apps = await Coolify.request('/api/v1/applications');
  console.log('Applications:', JSON.stringify(apps.data, null, 2));
  
  // Look for Canvas Cartel
  const canvasApp = apps.data.find(a => a.name?.toLowerCase().includes('canvas') || a.name?.toLowerCase().includes('cartel'));
  if (!canvasApp) {
    console.log('\nCanvas Cartel app not found. Available apps:');
    apps.data.forEach(a => console.log(' -', a.name, '|', a.uuid));
    return;
  }
  
  console.log('\nFound Canvas Cartel app:', canvasApp.name, '| UUID:', canvasApp.uuid);
  
  // Sync environment variables
  console.log('\n[2] Syncing environment variables...');
  const envData = [
    { key: 'VITE_SUPABASE_URL', value: 'https://dsuvcvbtxdftlbhuvsnv.supabase.co' },
    { key: 'VITE_SUPABASE_PUBLISHABLE_KEY', value: 'eyJhbG...NHvg' },
    { key: 'VITE_N8N_WEBHOOK_URL', value: 'https://your-n8n-instance.com/webhook/lead-intake' },
    { key: 'VITE_SITE_URL', value: 'https://canvascartel.in' },
  ];
  
  const syncEnv = await Coolify.request('/api/v1/applications/' + canvasApp.uuid + '/env/sync', {
    method: 'POST',
    body: JSON.stringify({ data: envData }),
  });
  console.log('Env sync:', syncEnv.success ? 'OK' : 'Failed', syncEnv.status);
  
  // Trigger deployment
  console.log('\n[3] Triggering deployment...');
  const deploy = await Coolify.request('/api/v1/deploy?uuid=' + canvasApp.uuid, {
    method: 'POST',
  });
  console.log('Deploy:', deploy.success ? 'Queued' : 'Failed', deploy.status);
  const depUUID = deploy.data?.uuid || deploy.data?.deployment_uuid;
  console.log('Deployment UUID:', depUUID);
  
  // Monitor deployment
  if (depUUID) {
    console.log('\n[4] Monitoring deployment...');
    for (let i = 0; i < 10; i++) {
      const logs = await Coolify.request('/api/v1/applications/' + canvasApp.uuid + '/logs?follow=true');
      console.log('\nLog (last 10 lines):');
      const lines = logs.text.split('\n');
      for (let j = Math.max(0, lines.length - 10); j < lines.length; j++) {
        if (lines[j]) console.log('  ' + lines[j]);
      }
      if (logs.text.includes('successfully') || logs.text.includes('healthy') || logs.text.includes('ready')) {
        console.log('\nDeployment appears successful!');
        break;
      }
      await new Promise(r => setTimeout(r, 5000));
    }
  }
  
  console.log('\n=== Deployment Complete ===');
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
