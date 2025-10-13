<template>
  <section class="stats">
    <div class="container">
      <div class="stats-grid">
        <div class="stat-card" v-for="stat in stats" :key="stat.id">
          <div class="stat-icon">
            <Icon :icon="stat.icon" :width="40" :height="40" />
          </div>
          <div class="stat-content">
            <h3 class="stat-number">{{ stat.number }}</h3>
            <p class="stat-title">{{ stat.title }}</p>
            <p class="stat-description">{{ stat.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { Icon } from '@iconify/vue'

export default {
  name: 'Stats',
  components: {
    Icon
  },
  data() {
    return {
      stats: [
        {
          id: 1,
          icon: 'mdi:earth',
          number: '1+ Billion',
          title: 'Global Vitamin D Deficiency',
          description: 'People worldwide lack sufficient vitamin D levels'
        },
        {
          id: 2,
          icon: 'emojione:flag-for-australia',
          number: '25%',
          title: 'Australian Deficiency Rate',
          description: 'Of Australians have inadequate vitamin D status'
        },
        {
          id: 3,
          icon: 'mdi:brain',
          number: '17%',
          title: 'Brain Protection Benefit',
          description: 'Lower dementia risk with optimal vitamin D levels'
        }
      ]
    }
  }
}
</script>

<style scoped>
.stats {
  background: white;
  padding: 4rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem; /* reduce side padding so cards get closer to section edges */
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem; /* increase space between cards */
}

.stat-card {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  padding: 2rem;
  border-radius: 20px;
  text-align: center;
  transition: all 0.3s ease;
  border: 1px solid #bbf7d0;
  box-shadow: 0 4px 10px rgba(199, 238, 208, 0.2);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 30px rgba(34, 197, 94, 0.25);
  background: linear-gradient(135deg, #16a34a 0%, #22c55e 50%, #4ade80 100%);
  color: white;
}

.stat-icon {
  margin-bottom: 1.5rem;
}

.icon {
  width: 60px;
  height: 60px;
  transition: all 0.3s ease;
}

.stat-card:hover .icon {
  filter: brightness(0) invert(1);
  transform: scale(1.1);
}

.stat-number {
  font-size: 2.8rem;
  font-weight: bold;
  color: #2d3748;
  margin-bottom: 0.8rem;
  transition: color 0.3s ease;
  line-height: 1.1;
}

.stat-card:hover .stat-number {
  color: white;
}

.stat-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #4a5568;
  margin-bottom: 0.6rem;
  transition: color 0.3s ease;
  line-height: 1.3;
}

.stat-card:hover .stat-title {
  color: white;
}

.stat-description {
  font-size: 0.95rem;
  color: #718096;
  line-height: 1.4;
  transition: color 0.3s ease;
  max-width: 280px;
  margin: 0 auto;
}

.stat-card:hover .stat-description {
  color: rgba(255, 255, 255, 0.9);
}

/* Responsive Design */
@media (max-width: 768px) {
  .stats {
    padding: 2rem 0;
  }
  
  .container {
    padding: 0 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .stat-card {
    padding: 1.5rem;
  }
  
  .stat-number {
    font-size: 2.3rem;
    margin-bottom: 0.6rem;
  }
  
  .stat-title {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-description {
    font-size: 0.9rem;
  }
  
  .icon {
    width: 50px;
    height: 50px;
  }
}

@media (max-width: 480px) {
  .stat-card {
    padding: 1rem;
  }
  
  .stat-number {
    font-size: 2rem;
    margin-bottom: 0.5rem;
  }
  
  .stat-title {
    font-size: 0.95rem;
    margin-bottom: 0.4rem;
  }
  
  .stat-description {
    font-size: 0.85rem;
    line-height: 1.3;
  }
  
  .icon {
    width: 40px;
    height: 40px;
  }
}
</style>