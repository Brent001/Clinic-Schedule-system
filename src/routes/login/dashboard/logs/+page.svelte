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
  let username: string = '';
  let showDropdown: boolean = false;

  // Fetch logs and username from the backend
  onMount(async () => {
    try {
      const sessionResponse = await fetch('/api/auth/session');
      if (sessionResponse.ok) {
        const sessionData = await sessionResponse.json();
        username = sessionData.username;

        const logsResponse = await fetch('/api/logs');
        if (logsResponse.ok) {
          logs = await logsResponse.json();
        } else {
          console.error('Failed to fetch logs');
        }
      } else {
        console.error('User is not authenticated');
        throw new Error('Not Found');
      }
    } catch (error) {
      console.error('Error fetching logs or session data:', error);
      throw new Error('Not Found');
    }
  });

  async function logActivity() {
    const ip = await fetch('https://api64.ipify.org?format=json')
      .then((res) => res.json())
      .then((data) => data.ip);

    const os = navigator.platform;
    const browser = navigator.userAgent;

    await fetch('/api/logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'exampleUser',
        ip,
        os,
        browser
      })
    });
  }

  function toggleDropdown() {
    showDropdown = !showDropdown;
  }

  async function logout() {
    document.cookie = 'session=; Max-Age=0; path=/';
    window.location.href = '/login';
  }
</script>

<main class="min-h-screen bg-gray-100">
  <!-- Navbar -->
  <div class="sticky top-0 z-50">
    <Navbar
      {username}
      {showDropdown}
      toggleDropdown={toggleDropdown}
      logout={logout}
    />
  </div>

  <!-- Logs Section -->
  <section class="max-w-7xl mx-auto p-6">
    <h1 class="text-3xl font-bold text-gray-800 mb-6">User Login Logs</h1>

    {#if logs.length > 0}
      <!-- Table for Larger Screens -->
      <div class="hidden sm:block relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-800 dark:text-gray-400">
            <tr>
              <th scope="col" class="px-6 py-3">ID</th>
              <th scope="col" class="px-6 py-3">Username</th>
              <th scope="col" class="px-6 py-3">IP Address</th>
              <th scope="col" class="px-6 py-3">Time</th>
              <th scope="col" class="px-6 py-3">Operating System</th>
              <th scope="col" class="px-6 py-3">Browser</th>
            </tr>
          </thead>
          <tbody>
            {#each logs as log, i}
              <tr class={i % 2 === 0 ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-700'}>
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                >
                  {log.id}
                </th>
                <td class="px-6 py-4">{log.username}</td>
                <td class="px-6 py-4">{log.ip}</td>
                <td class="px-6 py-4">{new Date(log.time).toLocaleString()}</td>
                <td class="px-6 py-4">{log.os}</td>
                <td class="px-6 py-4">{log.browser}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>

      <!-- Cards for Mobile Screens -->
      <div class="sm:hidden space-y-4">
        {#each logs as log}
          <div class="bg-white shadow-md rounded-lg p-4 border border-gray-200">
            <div class="flex justify-between items-center mb-2">
              <h2 class="text-lg font-semibold text-gray-800">Log #{log.id}</h2>
              <span class="text-sm text-gray-500">{new Date(log.time).toLocaleString()}</span>
            </div>
            <div class="text-sm text-gray-600 space-y-1">
              <p><strong>Username:</strong> {log.username}</p>
              <p><strong>IP Address:</strong> {log.ip}</p>
              <p><strong>Operating System:</strong> {log.os}</p>
              <p><strong>Browser:</strong> {log.browser}</p>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <p class="text-center text-gray-600">No logs available at the moment.</p>
    {/if}
  </section>
</main>

<style>
  main {
    font-family: 'Inter', sans-serif;
  }

  table th {
    background-color: #f9fafb;
  }

  table tr:nth-child(even) {
    background-color: #f3f4f6;
  }

  /* Ensure Navbar is visually separate */
  .sticky {
    background-color: #ffffff; /* White background for navbar */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Subtle shadow */
  }
</style>