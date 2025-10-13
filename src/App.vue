<template>
  <div id="app">
    <router-view v-slot="{ Component, route }">
      <transition 
        name="page-transition" 
        mode="out-in"
        appear
      >
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
  color: #333;
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%);
}

#app {
  min-height: 100vh;
}

/* Global responsive utilities */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Focus styles for accessibility */
*:focus {
  outline: 2px solid #22c55e;
  outline-offset: 2px;
}

/* Button reset */
button {
  font-family: inherit;
}

/* Link styles */
a {
  color: inherit;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* Page Transition Animations - Simplified */
.page-transition-enter-active,
.page-transition-leave-active {
  transition: opacity 0.4s ease-in-out;
}

.page-transition-enter-from,
.page-transition-leave-to {
  opacity: 0;
}

.page-transition-enter-to,
.page-transition-leave-from {
  opacity: 1;
}

/* Smooth page container */
#app {
  overflow-x: hidden;
}

/* Ensure smooth transitions for all page content */
.page-transition-enter-active *,
.page-transition-leave-active * {
  transition-delay: inherit;
}

/* Page content styling for better animations */
.page-content {
  min-height: 100vh;
  width: 100%;
  position: relative;
}

/* Gentle content animation */
.page-transition-enter-active .page-content > * {
  animation: gentleSlideIn 0.4s ease-out forwards;
}

.page-transition-enter-from .page-content > * {
  opacity: 0;
  transform: translateY(10px);
}

@keyframes gentleSlideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Subtle staggered delay for first few elements */
.page-content > *:nth-child(1) { animation-delay: 0s; }
.page-content > *:nth-child(2) { animation-delay: 0.05s; }
.page-content > *:nth-child(3) { animation-delay: 0.1s; }
</style>
