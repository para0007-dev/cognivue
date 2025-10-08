<template>
  <div class="login-wrap">
    <div class="card">
      <h1 class="title">BrainViD</h1>
      <p class="subtitle">Please enter password to access the system</p>

      <div v-if="error" class="error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <label class="label">Password</label>
        <input
          v-model="password"
          type="password"
          placeholder="Enter access password"
          class="input"
          :disabled="loading"
          required
        />

        <button type="submit" class="btn" :disabled="loading">
          <span v-if="loading">Logging in…</span>
          <span v-else>Login</span>
        </button>
      </form>

      <hr class="divider" />

      <p class="footnote">Please contact TA40 members for access password</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"
import axios from "axios"
import { useRouter, useRoute } from "vue-router"

const router = useRouter()
const route = useRoute()

const password = ref("")
const error = ref("")
const loading = ref(false)
const BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/,'')


async function handleLogin() {
  error.value = ""
  loading.value = true
  try {
    const res = await axios.post(`${BASE}/simpleauth/api/login/`, {
      username: "admin",            // fixed on backend
      password: password.value,
    })

    if (res.data.success) {
      sessionStorage.setItem("logged_in", "true")  // session-only
      const redirectPath = route.query.redirect || "/"
      router.push(redirectPath)
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      error.value = err.response.data?.error || "Invalid password"
    } else {
      error.value = "⚠️ Server error. Please try again."
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* background */
.login-wrap {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #b9eadf 0%, #cdecc6 50%, #bfe4b8 100%);
}

/* card */
.card {
  width: 360px;
  max-width: calc(100vw - 2rem);
  background: #fff;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.12);
  text-align: center;
}

/* headings */
.title {
  margin: 0 0 8px;
  font-size: 32px;
  font-weight: 800;
  color: #44a267;
  letter-spacing: .3px;
}
.subtitle {
  margin: 0 0 20px;
  color: #6b7280;
  font-size: 13px;
}

/* form */
.label {
  display: block;
  text-align: left;
  margin-bottom: 6px;
  color: #374151;
  font-size: 13px;
  font-weight: 600;
}
.input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 14px;
  outline: none;
  transition: box-shadow .2s, border-color .2s;
  margin-bottom: 14px;
}
.input:focus {
  border-color: #86efac;
  box-shadow: 0 0 0 4px rgba(134, 239, 172, 0.35);
}

/* button */
.btn {
  width: 100%;
  padding: 10px 14px;
  border: 0;
  border-radius: 10px;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(90deg, #37c5ad 0%, #7fd08e 100%);
  transition: filter .15s, transform .02s;
}
.btn:hover { filter: brightness(1.05); }
.btn:active { transform: translateY(1px); }
.btn:disabled { opacity: .6; cursor: default; }

/* misc */
.error {
  color: #dc2626;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  margin-bottom: 12px;
  text-align: left;
}
.divider {
  border: none;
  border-top: 1px solid #f1f5f9;
  margin: 18px 0 10px;
}
.footnote {
  color: #6b7280;
  font-size: 12px;
  margin: 0;
}
</style>
