over animation, cleaner typography, and a responsive grid.
<template>
  <div class="grid">
    <router-link
      v-for="(card, index) in cards"
      :key="index"
      :to="{ name: 'gallery', params: { label: card.title } }"
      class="card"
    >
      <div class="image">
        <img :src="card.image" alt="card" />
        <div class="image-overlay"></div>
      </div>

      <div class="content">
        <h3>{{ card.title }}</h3>
        <!-- <p>{{ card.description }}</p> -->
      </div>
    </router-link>
  </div>
</template>

<script>
// import h0 from 'src/assets/resources/home/hero/h0.png';
export default {
  name: "CardGrid",
  data() {
    return {
      cards: [
        {
          label: "HERO",
          title: "Exterior identity",
          description: "Main establishing image",
          image: '/assets/gallery/exterior identity/ei4.jpg',
        },
        {
          label: "PRIMARY",
          title: "Shared living + kitchen",
          description: "Strongest interior lifestyle frame",
          image: "/assets/gallery/shared living + kitchen/slk6.jpg",
        },
        {
          label: "PRIMARY",
          title: "Private room + study",
          description: "Best room-plan frame",
          image: "/assets/gallery/private room + study/DSC_5184.jpg",
        },
        {
          label: "PRIMARY",
          title: "Open-plan living",
          description: "Promoted to core pack",
          image: "/assets/gallery/open plan living/DSC_5243.jpg",
        },
        {
          label: "PRIMARY",
          title: "Rooftop + mountain",
          description: "Identity and setting",
          image: "/assets/gallery/rooftop + mountain/rtm4.jpg",
        },
        {
          label: "PRIMARY",
          title: "Pool",
          description: "Amenity proof point",
          image: "/assets/gallery/pool/p1.jpg",
        },
        {
          label: "DETAIL",
          title: "Rest Room",
          description: "Bathroom lifestyle detail",
          image: "/assets/gallery/rest room/rr4.jpg",
        },
        {
          label: "FEATURE",
          title: "Laundry",
          description: "Amenity support",
          image: "/assets/gallery/laundry/l1.jpg",
        },
        {
          label: "FEATURE",
          title: "Biometric security",
          description: "Optional proof",
          image: "/assets/gallery/biometric security/bs1.jpg",
        },
        {
          label: "FEATURE",
          title: "Solar array",
          description: "Sustainability support",
          image: "/assets/gallery/solar array/sa1.jpg",
        },
        {
          label: "SETTING",
          title: "Mountain / location",
          description: "Site support",
          image: "/assets/gallery/mountain location/ml4.jpg",
        },
        {
          label: "DETAIL",
          title: "Wardrobe capacity",
          description: "Practical detail",
          image: "/assets/gallery/wardrobe capacity/wc1.jpg",
        },
      ],
    };
  },
};
</script>

<style scoped>
.grid {
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
  cursor: pointer;
}

.card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 18px;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.06);

  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}
.grid .card {
  text-decoration: none;
  color: inherit;
}

.card:hover {
  transform: translateY(-6px);
  /* box-shadow: 0 18px 45px rgba(0, 0, 0, 0.12); */
}

.image {
  position: relative;
  width: 100%;
  height: 240px;
  overflow: hidden;
  background: #f2f2f2;
}

.image img {
  width: 100%;
  height: 100%;
  display: block;

  object-fit: cover;

  transition: transform 0.5s ease;
}

.card:hover .image img {
  transform: scale(1.06);
}

.image-overlay {
  position: absolute;
  inset: 0;

  background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.18));

  pointer-events: none;
}

.content {
  padding: 24px;
}

.content h3 {
  margin: 0 0 10px;

  font-size: 22px;
  line-height: 1.25;
  font-weight: 700;

  color: #111111;
}

.content p {
  margin: 0;

  font-size: 15px;
  line-height: 1.7;

  color: #666666;
}

.learn-more {
  display: inline-flex;
  align-items: center;
  gap: 8px;

  margin-top: 20px;

  color: #111111;
  font-size: 14px;
  font-weight: 700;

  text-decoration: none;
}

.learn-more span {
  font-size: 18px;
  transition: transform 0.25s ease;
}

.card:hover .learn-more span {
  transform: translateX(5px);
}

/* Tablet */
@media (max-width: 1000px) {
  .grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Mobile */
@media (max-width: 650px) {
  .grid {
    grid-template-columns: 1fr;
    padding: 24px 16px;
    gap: 20px;
  }

  .image {
    height: 220px;
  }

  .content {
    padding: 20px;
  }

  .content h3 {
    font-size: 20px;
  }
}
</style>
