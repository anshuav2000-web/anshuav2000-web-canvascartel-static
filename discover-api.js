const Coolify = {
  base: 'http://72.62.240.208:8000',
  token: '44|l1MFA4FTheqQ1Qxme30dYnMIC2ec1vhGubv9alew8176bdd4',
  async request(endpoint, options = {}) {
    const url = `${this.base}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${this.token}`,
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
  // Explore the API
  const endpoints = [
    '/api/v1',
    '/api',
    '/api/v1/projects',
    '/api/v1/applications/new',
    '/api/v1/applications/create-static',
    '/api/v1/applications/create-docker',
    '/api/v1/applications/build',
    '/api/v1/applications/deploy',
    '/api/v1/applications/:uuid/deploy',
    '/api/v1/applications/:uuid/environment-variables',
    '/api/v1/applications/:uuid/env-variables',
    '/api/v1/applications/:uuid/environment-variables/sync',
    '/api/v1/env',
    '/api/v1/environments',
  ];
  
  for (const ep of endpoints) {
    try {
      const res = await Coolify.request(ep);
      if (res.success) {
        console.log(`\n[OK] ${ep}:`);
        const data = res.data;
        console.log(JSON.stringify(data, null, 2).substring(0, 200));
      } else {
        console.log(`[${res.status}] ${ep}: ${res.text?.substring(0, 50)}`);
      }
    } catch (e) {
      console.log(`[ERR] ${ep}: ${e.message}`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
