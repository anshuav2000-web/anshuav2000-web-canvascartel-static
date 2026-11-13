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
  const versions = [
    '/api',
    '/api/v1',
    '/api/v2',
    '/api/v1/projects',
    '/api/v1/environments',
    '/api/v1/servers',
    '/api/v1/domains',
    '/api/v1/applications?filter[name]=Canvas',
  ];
  
  for (const ep of versions) {
    try {
      const res = await Coolify.request(ep);
      console.log(`[${res.status}] ${ep} ${res.success ? 'OK' : 'FAIL'}`);
      if (res.success && res.data) {
        console.log(JSON.stringify(res.data, null, 2).substring(0, 400));
      }
      console.log('---');
    } catch (e) {
      console.log(`[ERR] ${ep}: ${e.message}\n---`);
    }
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
