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
  
  // Check deployment status
  console.log('Checking deployment status...');
  const status = await Coolify.request('/api/v1/applications/' + appUUID + '/status');
  console.log('Status:', JSON.stringify(status.data, null, 2));
  
  // Get logs
  console.log('\nGetting logs...');
  const logs = await Coolify.request('/api/v1/applications/' + appUUID + '/logs?follow=false');
  console.log('Logs (last 100 lines):');
  const lines = (logs.text || '').split('\n');
  for (let j = Math.max(0, lines.length - 100); j < lines.length; j++) {
    if (lines[j]) console.log(lines[j]);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
