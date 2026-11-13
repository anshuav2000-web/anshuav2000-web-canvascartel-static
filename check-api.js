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
  // Try various API endpoints
  const endpoints = [
    '/api/v1/applications',
    '/api/v1/applications?page=1&perPage=10',
    '/api/v1/applications?page=1&perPage=100',
    '/api/v1/project',
    '/api/v1/projects',
    '/api/v1/admin/applications',
    '/api/v1/applications/create',
    '/api/v1/applications/deploy',
    '/api/v1/deploy',
    '/api/v1/applications/tccskk00gkgc08cg0gww0sss',
    '/api/v1/applications/tccskk00gkgc08cg0gww0sss/status',
    '/api/v1/applications/tccskk00gkgc08cg0gww0sss/logs',
    '/api/v1/applications/tccskk00gkgc08cg0gww0sss/env/sync',
    '/api/v1/applications/tccskk00gkgc08cg0gww0sss/env',
  ];
  
  for (const ep of endpoints) {
    try {
      const res = await Coolify.request(ep);
      console.log(`\n${ep}: ${res.status} ${res.success ? 'OK' : 'FAIL'}`);
      if (res.data) {
        console.log(JSON.stringify(res.data, null, 2).substring(0, 300));
      }
    } catch (e) {
      console.log(`\n${ep}: ERROR ${e.message}`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
