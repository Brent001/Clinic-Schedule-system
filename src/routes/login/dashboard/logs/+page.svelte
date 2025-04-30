<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from '$lib/components/Dashboard/Navbar.svelte';
  import { goto } from '$app/navigation';

  interface Log {
    id: number;
    username: string;
    ip: string;
    time: string;
    os: string;
    browser: string;
  }

  let logs: Log[] = [];
  let username: string = ''; // Add username variable
  let showDropdown: boolean = false; // Add dropdown state

  // Fetch logs and username from the backend
  onMount(async () => {
    try {
      // Fetch session data to check if the user is logged in
      const sessionResponse = await fetch('/api/auth/session');
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        username = sessionData.username;

        // Fetch logs only if the user is authenticated
        const logsResponse = await fetch('/api/logs');
        if (logsResponse.ok) {
          logs = await logsResponse.json();
        } else {
          console.error('Failed to fetch logs');
        }
      } else {
        console.error('User is not authenticated');
        throw new Error('Not Found'); // Trigger a 404 error
      }
    } catch (error) {
      console.error('Error fetching logs or session data:', error);
      throw new Error('Not Found'); // Trigger a 404 error
    }
  });

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  async function logout() {
    document.cookie = 'session=; Max-Age=0; path=/';
    window.location.href = '/login'; // Redirect to login page
  }
</script>

<main class="min-h-screen bg-gray-100">
  <!-- Navbar -->
  <Navbar
    {username}
    {showDropdown}
    toggleDropdown={toggleDropdown}
    logout={logout}
  />

  <!-- Logs Section -->
  <section class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">User Login Logs</h1>
    <div class="overflow-x-auto bg-white shadow-md rounded-lg">
      <table class="min-w-full border-collapse border border-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              ID
            </th>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              Username
            </th>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              IP Address
            </th>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              Time
            </th>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              Operating System
            </th>
            <th class="border border-gray-300 px-6 py-3 text-left text-sm font-medium text-gray-600 uppercase tracking-wider">
              Browser
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          {#each logs as log}
            <tr class="hover:bg-gray-50">
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{log.id}</td>
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{log.username}</td>
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{log.ip}</td>
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{new Date(log.time).toLocaleString()}</td>
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{log.os}</td>
              <td class="border border-gray-300 px-6 py-4 text-sm text-gray-800">{log.browser}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>
</main>