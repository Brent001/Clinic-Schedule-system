<script lang="ts">
  import { goto } from '$app/navigation';

  let username = '';
  let password = '';

  async function handleLogin() {
    if (!username.trim() || !password.trim()) {
      alert('Username and password are required.');
      return;
    }

    console.log('Attempting login with:', { username, password });

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Error response from server:', error);
        alert(error.error || 'Login failed. Please check your credentials.');
        return;
      }

      console.log('Login successful');
      await goto('/login/dashboard');
    } catch (error) {
      console.error('An error occurred:', error);
      alert('An error occurred while logging in. Please try again.');
    }
  }
</script>

<main class="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300 px-4">
  <div class="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
    <div class="text-center mb-6">
      <img src="/logo/logo.png" alt="Clinic Logo" class="h-16 mx-auto mb-4" />
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-800">Welcome Back</h1>
      <p class="text-sm text-gray-600">Log in to access your account</p>
    </div>
    <form on:submit|preventDefault={handleLogin} class="space-y-5">
      <div>
        <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
        <input
          type="text"
          id="username"
          bind:value={username}
          placeholder="Enter your username"
          required
          class="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <div>
        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
        <input
          type="password"
          id="password"
          bind:value={password}
          placeholder="Enter your password"
          required
          class="w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
        />
      </div>
      <button
        type="submit"
        class="w-full px-4 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        Login
      </button>
    </form>
  </div>
</main>

<style>
  @media (max-width: 640px) {
    h1 {
      font-size: 1.75rem; /* Adjust heading size for smaller screens */
    }

    p {
      font-size: 0.875rem; /* Adjust paragraph size for smaller screens */
    }

    button {
      font-size: 0.875rem; /* Adjust button text size for smaller screens */
    }
  }
</style>