<script>
  export let username = ''; // Pass the username as a prop
  export let showDropdown = false; // Control dropdown visibility
  export let toggleDropdown; // Function to toggle dropdown visibility
  export let logout; // Logout function

  let isMenuOpen = false; // State to control the collapsible menu
</script>

<header class="bg-green-600 text-white py-4 shadow-md">
  <div class="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6">
    <!-- Logo -->
    <div class="flex items-center space-x-4">
      <img src="/logo/logo.png" alt="Logo" class="h-8 w-8 rounded-full" />
      <h1 class="text-lg sm:text-2xl font-bold">Clinic Dashboard</h1>
    </div>

    <!-- Hamburger Menu for Mobile -->
    <button
      class="sm:hidden flex items-center bg-green-700 px-3 py-2 rounded-lg hover:bg-green-800 focus:outline-none"
      on:click={() => (isMenuOpen = !isMenuOpen)}
      aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d={isMenuOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
        />
      </svg>
    </button>

    <!-- User Profile Dropdown (Desktop) -->
    <div class="hidden sm:relative sm:flex">
      <button
        class="flex items-center space-x-2 bg-green-700 px-3 py-2 rounded-lg hover:bg-green-800 focus:outline-none"
        on:click={toggleDropdown}
      >
        <span class="text-sm sm:text-base font-medium truncate">Welcome, {username}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {#if showDropdown}
        <div class="absolute right-0 mt-2 w-48 bg-white text-gray-800 rounded-lg shadow-lg z-50">
          <a
            href="/login/dashboard"
            class="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Dashboard
          </a>
          <a
            href="/login/dashboard/logs"
            class="block px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logs
          </a>
          <button
            on:click={logout}
            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Logout
          </button>
        </div>
      {/if}
    </div>
  </div>

  <!-- Collapsible Menu for Mobile -->
  {#if isMenuOpen}
    <div class="sm:hidden bg-green-700 text-white px-4 py-2 space-y-2">
      <a
        href="/login/dashboard"
        class="block text-sm hover:bg-green-800 px-3 py-2 rounded-lg"
      >
        Dashboard
      </a>
      <a
        href="/login/dashboard/logs"
        class="block text-sm hover:bg-green-800 px-3 py-2 rounded-lg"
      >
        Logs
      </a>
      <button
        on:click={logout}
        class="block w-full text-left text-sm hover:bg-green-800 px-3 py-2 rounded-lg"
      >
        Logout
      </button>
    </div>
  {/if}
</header>

<style>
  header {
    font-family: 'Inter', sans-serif;
  }

  @media (max-width: 640px) {
    h1 {
      font-size: 1rem; /* Adjust heading size for smaller screens */
    }

    button span {
      max-width: 100px; /* Truncate long usernames on smaller screens */
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>