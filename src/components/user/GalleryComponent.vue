over animation, cleaner typography, and a responsive grid.
<template>
  <!-- top 3 images -->
  <div class="grid grid_style">
    <div v-for="(card, indx) in cards2" :key="indx" class="card">
      <div class="image">
        <img
          :src="card.image"
          alt="card"
          @click="openImageDialog(card.image)"
        />
        <div class="image-overlay"></div>
      </div>

      <!-- <div class="content"> -->
      <!-- <h3>{{ card.title }}</h3> -->
      <!-- <p>{{ card.description }}</p> -->
      <!-- </div> -->
    </div>
  </div>

  <div
    class="text-h6 text-center section-label large-screen-only small-heading"
  >
    <b>⸻&nbsp;&nbsp;&nbsp;GALLERY&nbsp;&nbsp;&nbsp;⸻</b>
  </div>
  <div class="text-h6 text-center section-label small-screen-only">
    <b>—&nbsp;&nbsp;&nbsp;GALLERY&nbsp;&nbsp;&nbsp;—</b>
  </div>
  <div
    class="text-h3 text-center text-weight-bold location-title line-height-normal"
  >
    Experience living, through images
  </div>

<!-- middle section -->
  <div class="grid grid_style1">
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

  <!-- bottom 2 images -->
  <div class="grid grid_style2">
    <div v-for="(card, indx) in cards3" :key="indx" class="card">
      <div class="image">
        <img
          :src="card.image"
          alt="card"
          @click="openImageDialog(card.image)"
        />
        <div class="image-overlay"></div>
      </div>

      <!-- <div class="content"> -->
      <!-- <h3>{{ card.title }}</h3> -->
      <!-- <p>{{ card.description }}</p> -->
      <!-- </div> -->
    </div>
  </div>
  <ImageDialog v-model="showImageDialog" :imageUrl="currentDialogImageUrl" />
</template>

<script>
// import h0 from 'src/assets/resources/home/hero/h0.png';
import ImageDialog from "src/components/elements/ImageDialog.vue";
export default {
  name: "CardGrid",

  components: {
    ImageDialog,
  },

  data() {
    return {
      showImageDialog: false,
      currentDialogImageUrl: "",

      cards: [
        {
          label: "HERO",
          title: "Exterior",
          description: "Main establishing image",
          image: "/assets/gallery/exterior identity/ei4.jpg",
        },
        {
          label: "PRIMARY",
          title: "Shared Living & Kitchen",
          description: "Strongest interior lifestyle frame",
          image: "/assets/gallery/shared living + kitchen/slk6.jpg",
        },
        {
          label: "PRIMARY",
          title: "Private Room",
          description: "Best room-plan frame",
          image: "/assets/gallery/private room + study/DSC_5184.jpg",
        },
        {
          label: "PRIMARY",
          title: "Open-plan Living",
          description: "Promoted to core pack",
          image: "/assets/gallery/open plan living/DSC_5243.jpg",
        },
        {
          label: "PRIMARY",
          title: "Rooftop & Mountain",
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
          title: "Bathroom",
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
          title: "Biometric Security",
          description: "Optional proof",
          image: "/assets/gallery/biometric security/bs1.jpg",
        },
        {
          label: "FEATURE",
          title: "Solar Array",
          description: "Sustainability support",
          image: "/assets/gallery/solar array/sa1.jpg",
        },
        {
          label: "SETTING",
          title: "Location",
          description: "Site support",
          image: "/assets/gallery/mountain location/ml4.jpg",
        },
        // {
        //   label: "DETAIL",
        //   title: "Wardrobe capacity",
        //   description: "Practical detail",
        //   image: "/assets/gallery/wardrobe capacity/wc1.jpg",
        // },
      ],
      cards2: [
        {
          label: "HERO",
          title: "Exterior",
          description: "Main establishing image",
          image: "/assets/gallery/exterior identity/ei4.jpg",
        },
        {
          label: "PRIMARY",
          title: "Shared living & Kitchen",
          description: "Strongest interior lifestyle frame",
          image: "/assets/gallery/shared living + kitchen/slk6.jpg",
        },
        {
          label: "PRIMARY",
          title: "Private Room",
          description: "Best room-plan frame",
          image: "/assets/gallery/private room + study/DSC_5184.jpg",
        },
      ],
      cards3: [
        {
          label: "HERO",
          title: "Open-plan Living & Kitchen",
          image: "/assets/gallery/open plan living/DSC_5243.jpg",
        },
        {
          label: "PRIMARY",
          title: "Basin Detail",
          image: "/assets/gallery/rest room/rr4.jpg",
        },
      ],
    };
  },

  methods: {
    openImageDialog(url) {
      if (!url) return;

      this.currentDialogImageUrl = url;
      this.showImageDialog = true;
    },
  },
};
</script>

<style scoped>
.grid {
  width: 100%;
  margin: 0 auto;
  padding: 40px 24px;
  margin-top: 5rem;

  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 24px;
}

.card {
  overflow: hidden;
  background: #ffffff;
  border: 1px solid #e8e8e8;
  border-radius: 18px;
  cursor: pointer;

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

.grid_style {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
  margin-bottom: 2rem;
  margin-top: 5rem;

}

.grid_style .image {
  height: 400px;
}

.grid_style1 {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 24px;
  width: 100%;
  margin-top: 2rem;
  padding: 40px 24px;
}

.grid_style1 .card {
  flex: 1 1 400px;
  max-width: 420px;
  min-width: 0;
}

/* Tablet */
@media (max-width: 1000px) {
  .grid_style1 .card {
    flex-basis: 280px;
  }
}

/* Mobile */
@media (max-width: 650px) {
  .grid_style1 {
    padding: 24px 16px;
    gap: 20px;
  }

  .grid_style1 .card {
    flex: 1 1 100%;
    max-width: 420px;
  }
}


.grid_style2 {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 24px;
  margin-top: 0rem;
}
.grid_style2 .image {
  height: 400px;
}
.small-heading b {
  color: var(--q-primary);
}
</style>
