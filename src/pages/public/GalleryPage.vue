```vue
<template>
  <div class="gallery-layout">
    <!-- left sidebar -->
    <aside class="sidebar">
      <div class="sidebar-inner">
        <p class="eyebrow">Explore</p>

        <h1>Gallery</h1>

        <nav class="navigation">
          <button
            v-for="(section, index) in sections"
            :key="index"
            class="nav-item"
            :class="{ active: activeSection === section.title }"
            @click="activeSection = section.title"
          >
            <span class="number">
              {{ String(index + 1).padStart(2, "0") }}
            </span>

            <span class="title">
              {{ section.title }}
            </span>
          </button>
        </nav>
      </div>
    </aside>

    <!-- gallery content/rigth side -->
    <main class="gallery-content">
      <div class="gallery-header">
        <div>
          <p class="eyebrow">Gallery</p>
          <h2>{{ activeSection }}</h2>
        </div>

        <span class="image-count"> {{ currentImages.length }} Images </span>
      </div>

      <div class="images-grid">
        <div
          v-for="(img, index) in currentImages"
          :key="index"
          class="image-card"
        >
          <img :src="img" :alt="`${activeSection} ${index + 1}`" />

          <div class="image-overlay">
            <span>
              {{ String(index + 1).padStart(2, "0") }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
export default {
  name: "GalleryPage",

  data() {
    return {
      activeSection: "Exterior identity",
 
      sections: [
        {
          title: "Exterior identity",
          images: [
            "/assets/gallery/exterior identity/ei1.jpg",
            "/assets/gallery/exterior identity/ei2.jpg",
            "/assets/gallery/exterior identity/ei3.jpg",
            "/assets/gallery/exterior identity/ei4.jpg",
            "/assets/gallery/exterior identity/ei5.jpg",
          ],
        },
        {
          title: "Shared living + kitchen",
          images: [
            "/assets/gallery/shared living + kitchen/slk1.jpg",
            "/assets/gallery/shared living + kitchen/slk2.jpg",
            "/assets/gallery/shared living + kitchen/slk3.jpg",
            "/assets/gallery/shared living + kitchen/slk4.jpg",
            "/assets/gallery/shared living + kitchen/slk5.jpg",
            "/assets/gallery/shared living + kitchen/slk6.jpg",
          ],
        },
        {
          title: "Private room + study",
          images: [
            "/assets/gallery/private room + study/prs1.jpg",
            "/assets/gallery/private room + study/prs2.jpg",
            "/assets/gallery/private room + study/prs3.jpg",
            "/assets/gallery/private room + study/prs4.jpg",
            "/assets/gallery/private room + study/prs5.jpg",
          ],
        },
        {
          title: "Open-plan living",
          images: [
            "/assets/gallery/open plan living/opl1.jpg",
            "/assets/gallery/open plan living/opl2.jpg",
            "/assets/gallery/open plan living/opl3.jpg",
            "/assets/gallery/open plan living/opl4.jpg",
            "/assets/gallery/open plan living/opl5.jpg",
          ],
        },
        {
          title: "Rooftop + mountain",
          images: [
            "/assets/gallery/rooftop + mountain/rtm1.jpg",
            "/assets/gallery/rooftop + mountain/rtm2.jpg",
            "/assets/gallery/rooftop + mountain/rtm3.jpg",
            "/assets/gallery/rooftop + mountain/rtm4.jpg",
            "/assets/gallery/rooftop + mountain/rtm5.jpg",
          ],
        },
        {
          title: "Pool",
          images: [
            "/assets/gallery/pool/p1.jpg",
            "/assets/gallery/pool/p2.jpg",
            "/assets/gallery/pool/p3.jpg",
            "/assets/gallery/pool/p4.jpg",
          ],
        },
 
        {
          title: "Bathroom",
          images: [
            "/assets/gallery/rest room/rr1.jpg",
            "/assets/gallery/rest room/rr2.jpg",
            "/assets/gallery/rest room/rr3.jpg",
            "/assets/gallery/rest room/rr4.jpg",
            "/assets/gallery/rest room/rr5.jpg",
          ],
        },
        {
          title: "Laundry",
          images: [
            "/assets/gallery/laundry/l1.jpg",
            "/assets/gallery/laundry/l2.jpg",
            "/assets/gallery/laundry/l3.jpg",
          ],
        },
        {
          title: "Biometric security",
          images: [
            "/assets/gallery/biometric security/bs1.jpg",
            "/assets/gallery/biometric security/bs2.jpg",
          ],
        },
        {
          title: "Solar array",
          images: [
            "/assets/gallery/solar array/sa1.jpg",
            "/assets/gallery/solar array/sa2.jpg",
          ],
        },
        {
          title: "Mountain / location",
          images: [
            "/assets/gallery/mountain location/ml1.jpg",
            "/assets/gallery/mountain location/ml2.jpg",
            "/assets/gallery/mountain location/ml3.jpg",
            "/assets/gallery/mountain location/ml4.jpg",
            "/assets/gallery/mountain location/ml5.jpg",
          ],
        },
        {
          title: "Wardrobe capacity",
          images: [
            "/assets/gallery/wardrobe capacity/wc1.jpg",
            "/assets/gallery/wardrobe capacity/wc2.jpg",
            "/assets/gallery/wardrobe capacity/wc3.jpg",
          ],
        },
      ],
    };
  },

    watch: {
  "$route.params.label": {
    immediate: true,
    handler(title) {
      const section = this.sections.find(
        (section) => section.title === title
      );
 
      if (section) {
        this.activeSection = section.title;
      }
    },
  },
},

  computed: {
    currentImages() {
      const section = this.sections.find(
        (section) => section.title === this.activeSection
      );

      return section ? section.images : [];
    },
  },
};
</script>

<style scoped>
.gallery-layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);

  min-height: 100vh;

  background: #ffffff;
  color: #111111;
}

.sidebar {
  position: sticky;
  top: 0;

  height: 100vh;

  border-right: 1px solid #e8e8e8;

  background: #fafafa;
}

.sidebar-inner {
  height: 100%;

  padding: 50px 30px;

  display: flex;
  flex-direction: column;
}

/* Small heading */

.eyebrow {
  margin: 0 0 12px;

  font-size: 11px;
  font-weight: 700;

  letter-spacing: 0.14em;
  text-transform: uppercase;

  color: #999999;
}

/* Main sidebar title */

.sidebar h1 {
  margin: 0 0 45px;

  font-size: 34px;
  line-height: 1;

  font-weight: 700;
  letter-spacing: -0.04em;
}

.navigation {
  display: flex;
  flex-direction: column;

  gap: 4px;
}

.nav-item {
  position: relative;

  width: 100%;

  display: grid;
  grid-template-columns: 32px 1fr;

  align-items: center;

  gap: 10px;

  padding: 13px 12px;

  border: none;
  border-radius: 0;

  background: transparent;

  text-align: left;

  cursor: pointer;

  color: #777777;

  transition: color 0.25s ease, background 0.25s ease;
}

.nav-item::before {
  content: "";

  position: absolute;
  left: 0;
  top: 50%;

  width: 2px;
  height: 0;

  background: #111111;

  transform: translateY(-50%);

  transition: height 0.25s ease;
}

.nav-item:hover {
  color: #111111;
  background: #f0f0f0;
}

.nav-item.active {
  color: #111111;
  font-weight: 600;
}

.nav-item.active::before {
  height: 24px;
}

.number {
  font-size: 11px;
  font-weight: 600;

  color: #b0b0b0;
}

.nav-item.active .number {
  color: #111111;
}

.title {
  font-size: 14px;
  line-height: 1.4;
}

.gallery-content {
  min-width: 0;

  padding: 60px;
}

.gallery-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 30px;

  margin-bottom: 40px;

  padding-bottom: 24px;

  border-bottom: 1px solid #e8e8e8;
}

.gallery-header h2 {
  margin: 0;

  font-size: clamp(30px, 4vw, 52px);

  line-height: 1;

  letter-spacing: -0.04em;

  font-weight: 700;
}

.image-count {
  flex-shrink: 0;

  font-size: 12px;
  font-weight: 600;

  color: #999999;

  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.images-grid {
  display: grid;

  grid-template-columns: repeat(3, minmax(0, 1fr));

  gap: 18px;
}

.image-card {
  position: relative;

  overflow: hidden;

  aspect-ratio: 4 / 3;

  background: #eeeeee;

  cursor: pointer;
}

.image-card img {
  width: 100%;
  height: 100%;

  display: block;

  object-fit: cover;

  transition: transform 0.6s cubic-bezier(0.2, 0.7, 0.2, 1), filter 0.4s ease;
}

.image-card:hover img {
  transform: scale(1.05);

  filter: brightness(0.8);
}

.image-overlay {
  position: absolute;

  inset: 0;

  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 16px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.35), transparent 35%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.image-card:hover .image-overlay {
  opacity: 1;
}

.image-overlay span {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 36px;
  height: 36px;

  border: 1px solid rgba(255, 255, 255, 0.5);

  color: #ffffff;

  font-size: 11px;
  font-weight: 600;
}

/* big tablet */

@media (max-width: 1200px) {
  .gallery-content {
    padding: 45px;
  }

  .images-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* tablet */

@media (max-width: 900px) {
  .gallery-layout {
    grid-template-columns: 220px minmax(0, 1fr);
  }

  .sidebar-inner {
    padding: 35px 20px;
  }

  .sidebar h1 {
    font-size: 28px;
    margin-bottom: 30px;
  }

  .gallery-content {
    padding: 35px;
  }
}

/* mobile */

@media (max-width: 700px) {
  .gallery-layout {
    display: block;
  }

  /* Sidebar becomes top navigation */

  .sidebar {
    position: relative;

    height: auto;

    border-right: none;
    border-bottom: 1px solid #e8e8e8;
  }

  .sidebar-inner {
    padding: 28px 20px 20px;
  }

  .sidebar h1 {
    margin-bottom: 24px;

    font-size: 30px;
  }

  /* Horizontal navigation */

  .navigation {
    flex-direction: row;

    gap: 8px;

    overflow-x: auto;

    padding-bottom: 4px;

    scrollbar-width: none;
  }

  .navigation::-webkit-scrollbar {
    display: none;
  }

  .nav-item {
    width: auto;

    flex-shrink: 0;

    display: block;

    padding: 10px 14px;

    border: 1px solid #dddddd;

    background: #ffffff;
  }

  .nav-item::before {
    display: none;
  }

  .nav-item:hover {
    background: #f5f5f5;
  }

  .nav-item.active {
    background: #111111;
    border-color: #111111;

    color: #ffffff;
  }

  .number {
    display: none;
  }

  .title {
    white-space: nowrap;

    font-size: 13px;
  }

  .nav-item.active .number {
    color: #ffffff;
  }

  /* Content */

  .gallery-content {
    padding: 30px 20px 50px;
  }

  .gallery-header {
    align-items: flex-start;

    flex-direction: column;

    gap: 12px;

    margin-bottom: 25px;
  }

  .gallery-header h2 {
    font-size: 32px;
  }

  .images-grid {
    grid-template-columns: 1fr;

    gap: 14px;
  }

  .image-card {
    aspect-ratio: 4 / 3;
  }
}

@media (max-width: 400px) {
  .sidebar-inner {
    padding-left: 16px;
    padding-right: 16px;
  }

  .gallery-content {
    padding-left: 16px;
    padding-right: 16px;
  }

  .gallery-header h2 {
    font-size: 28px;
  }
}
</style>
