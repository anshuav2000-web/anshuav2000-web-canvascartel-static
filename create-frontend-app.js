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
  // First, let's see what application types we can create
  console.log('Checking available API endpoints...');
  const apps = await Coolify.request('/api/v1/applications');
  console.log('Number of apps:', (apps.data || []).length);
  
  // Try creating a new static application
  console.log('\nAttempting to create new application...');
  const newApp = await Coolify.request('/api/v1/applications', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Canvas Cartel Website',
      description: 'Canvas Cartel premium marketing website (Vue.js frontend)',
      type: 'static',
      source_type: 'local',
      git_repository: null,
      git_branch: null,
      git_https_username: null,
      git_ssh_known_hosts: null,
      dockerfile_location: null,
      dockerfile: null,
      build_command: null,
      post_deployment_command: null,
      pre_deployment_command: null,
      publish_directory: '/dist',
      base_directory: '/',
      restart_command: null,
      setup_command: null,
      args: null,
      env: null,
      docker_compose: null,
      start_command: null,
      install_command: null,
      fqdn: 'canvascartel-web.canvascartel.in',
      redirect: 'non-www',
      health_check_enabled: true,
      health_check_method: 'GET',
      health_check_path: '/index.html',
      health_check_host: 'localhost',
      health_check_port: 80,
      health_check_retries: 10,
      health_check_interval: 5,
      health_check_scheme: 'http',
      health_check_return_code: 200,
      health_check_timeout: 5,
      health_check_start_period: 5,
      swarm_replicas: 1,
      limits_cpus: 1,
      limits_memory: '512M',
      ports_mappings: null,
      ports_exposes: null,
      is_http_basic_auth_enabled: false,
      http_basic_auth_username: null,
      http_basic_auth_password: null,
      is_maintenance_enabled: false,
      maintenance_page: null,
      custom_labels: null,
      custom_docker_run_options: null,
      custom_healthcheck_found: false,
      custom_nginx_configuration: null,
      environment_id: null,
      server_id: null,
      destination_id: null,
      source_id: null,
      deleted_at: null,
      created_at: null,
      updated_at: null,
      container_present: false,
      build_pack: null,
      config_hash: null,
      git_commit_sha: null,
      git_full_url: null,
      additional_networks_count: 0,
      additional_servers_count: 0,
      additional_servers: [],
      custom_network_aliases: null,
      docker_registry_image_name: null,
      docker_registry_image_tag: null,
      preview_url_template: null,
      noindex_domains: null,
      watch_paths: null,
      http_basic_auth_argon2id_memory_cost: null,
      http_basic_auth_argon2id_time_cost: null,
      http_basic_auth_bcrypt_cost: null,
      http_basic_auth_hash_algorithm: null,
      manual_webhook_secret_bitbucket: null,
      manual_webhook_secret_gitea: null,
      manual_webhook_secret_github: null,
      manual_webhook_secret_gitlab: null,
      max_restart_count: 0,
      repository_project_id: null,
      restart_count: 0,
      restart_limit_reached: false,
      server_status: true,
      status: 'stopped',
      destination: null,
      destination_type: null,
    }),
  });
  
  console.log('App creation:', newApp.success ? 'OK' : 'Failed', newApp.status);
  if (newApp.success) {
    console.log('New app UUID:', newApp.data?.uuid);
    console.log('App name:', newApp.data?.name);
  } else {
    console.log('Error:', newApp.text);
  }
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
