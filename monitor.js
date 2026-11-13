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
  const appUUID = 'tccskk00gkgc08cg0gww0sss';
  
  // Get deployment logs
  for (let i = 0; i < 8; i++) {
    const logs = await Coolify.request('/api/v1/applications/' + appUUID + '/logs?follow=false');
    const logText = logs.text || '';
    const lines = logText.split('\n').filter(l => l.trim());
    console.log(`\n--- Deployment check ${i+1} ---`);
    for (const line of lines.slice(-30)) {
      console.log(line);
    }
    
    if (logText.includes('successfully') || logText.includes('healthy') || logText.includes('ready') || logText.includes('Error')) {
      console.log('\nDeployment phase complete.');
      break;
    }
    await new Promise(r => setTimeout(r, 8000));
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
