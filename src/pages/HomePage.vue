<template>
  <q-page>
    <!-- Hero Carousel -->
    <section class="hero-carousel bg-grey">
      <q-carousel animated v-model="currentSlide" infinite autoplay :autoplay-interval="18000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
        :height="$q.screen.lt.sm ? '340px' : '100vh'" control-color="white" class="hero-carousel__container">
        <q-carousel-slide v-for="card in heroCards" :key="card._id" :name="card._id" class="hero-carousel__slide">
          <q-img :src="card.imageUrl" :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
            class="hero-carousel__image" fit="cover" loading="lazy" />
        </q-carousel-slide>
      </q-carousel>
    </section>



    <!-- Apply Now Banner -->
    <div class="bg-black text-white">
      <div class="cta-banner padding-y-xl constrain-standard">
        <div class="row justify-center items-center">
          <div @click="openUnitRentals" class="cursor-pointer text-h4 text-md-h3 text-weight-bold text-center">
            <span class="text-underline-on-hover text-weight-bold">APPLY NOW FOR 2026 RESIDENCY</span>
          </div>
        </div>
      </div>
    </div>



    <!-- Welcome Banner -->
    <section class="welcome-banner text-white ">
      <q-parallax :src="parallax" :speed="0.6" :height="$q.screen.gt.sm ? 600 : 1024" class="welcome-parallax">

        <div class="welcome-overlay text-start column justify-center">
          <div class="welcome-content padding-y-xl constrain-standard">

            <div class="text-h3 text-weight-bold welcome-title">Modern. Purpose-Built. Perfectly Positioned.</div>
            <div class="welcome-description text-h6">
              <p>The-WEB, a premium private student residence redefining accommodation in Stellenbosch. Rising as a
                striking
                four-storey landmark, The-WEB offers 24 luxurious, fully furnished apartments, crowned by a 360-degree
                panoramic rooftop deck with breathtaking views of the Banhoek and Simonsberg mountains.</p>

              <p>Located within walking distance of Stellenbosch University's central campus and the Simonsrust
                Convenience
                Centre. Added convenience comes with direct access to the Stellenbosch University shuttle route, making
                getting around effortless.</p>

              <p>As a green building, it features backup solar power and natural spring water on tap, ensuring
                uninterrupted living. Students enjoy world-class amenities, including high-speed Wi-Fi, on-site laundry,
                stylish social lounges, communal study areas, dedicated gaming and entertainment spaces, a braai area
                and
                swimming pool, a tranquil Zen garden, and secure on-site parking. For peace of mind, The-Web offers
                24-hour
                security with advanced access control and CCTV.</p>
            </div>
          </div>
        </div>
      </q-parallax>
    </section>



    <!-- Amenities Section -->
    <section id="amenities-section" class="amenities-section">
      <div class="padding-y-xl constrain-standard">
        <div class="section-spacer-md"></div>
        <div class="amenities-content row justify-between items-center overflow-hidden-x">
          <q-card flat class="amenities-text col-12 col-md q-pr-md">
            <div class="fade-in-scale">
              <div class="text-h6 section-label large-screen-only">
                <b>⸻&nbsp;&nbsp;&nbsp;AMENITIES&nbsp;&nbsp;&nbsp;⸻</b>
              </div>
              <div class="text-h6 section-label small-screen-only">
                <b>—&nbsp;&nbsp;&nbsp;AMENITIES&nbsp;&nbsp;&nbsp;—</b>
              </div>
              <h2 class="text-h3 text-weight-bold amenities-title">What's inside The-WEB?</h2>
              <ul class="amenities-list text-h6">
                <li><span class="emoji">⛰</span> 360° panoramic views</li>
                <li><span class="emoji">📚</span> Communal Study areas</li>
                <li><span class="emoji">🎮</span> Entertainment area</li>
                <li><span class="emoji">🔥</span> Braai & swimming pool</li>
                <li><span class="emoji">🌿</span> Tranquil Zen garden</li>
                <li><span class="emoji">🧺</span> Smart laundry facilities</li>
                <li><span class="emoji">🔋</span> Backup power & water</li>
                <li><span class="emoji">🛡️</span> 24/7 Security</li>
                <li><span class="emoji">💧</span> Natural spring water on tap</li>
                <li><span class="emoji">🚐</span> University shuttle route</li>
              </ul>
              <p class="text-body1 amenities-cta">
                <em>Live where your lifestyle is supported, not limited.</em>
              </p>
            </div>
          </q-card>
          <div class="why-choose-image col-12 col-md q-pl-md mobile-no-pl flex justify-center slide-in-right">
            <q-img :src="a1" @click="openImageDialog(a1)"
              class="side-image" />
          </div>
        </div>
        <div class="section-spacer-md"></div>
        <ImageDialog v-model="showImageDialog" :imageUrl="currentDialogImageUrl" />
      </div>
    </section>



    <!-- Rooms Section -->
    <section id="units-section" class="rooms-section">
      <div class="padding-y-xl">
        <div class="section-spacer-sm"></div>
        <div class="rooms-component constrain-standard">
          <UnitCardComponentBlack />
        </div>
        <div class="section-spacer-sm"></div>
      </div>
    </section>



    <!-- Location Section -->
    <section id="location-section" class="location-section">
      <div class="padding-b-xl constrain-standard">
        <div class="location-content bg-transparent column items-center full-width">
          <div class="location-info fade-in-scale">
            <div class="text-h6 text-center section-label large-screen-only">
              <b>⸻&nbsp;&nbsp;&nbsp;LOCATION&nbsp;&nbsp;&nbsp;⸻</b>
            </div>
            <div class="text-h6 text-center section-label small-screen-only">
              <b>—&nbsp;&nbsp;&nbsp;LOCATION&nbsp;&nbsp;&nbsp;—</b>
            </div>
            <div class="text-h3 text-center text-weight-bold location-title line-height-normal">
              Where Campus Meets Lifestyle<br>And Nature Meets Culture
            </div>
            <div class="text-h6 text-center location-subtitle">
              <span class="text-h5 text-weight-bold gold-label">1 Old Helshoogte Road, Idas Valley, Stellenbosch</span>
              <br><br>
              The-WEB is more than just centrally located it's at the intersection of student life, nature, sport,
              and heritage.
              <br>Nestled in Idas Valley, it places you minutes away from everything that matters.
            </div>

            <div class="location-grid row justify-between">
              <div class="col-md-12 col-12 q-gutter-y-sm padding-y-xl">
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item v-model="expanded[0]" @hide="expanded[0] = false" @click="handleExpansion(0)"
                    header-class="text-h6 text-left q-pa-md" expand-icon-class="text-black"
                    style="border: 1px solid #ccc;" @show="setSlide(1, $event)">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="text-h6">Within walking or easy cycling distance</div>
                      </div>
                    </template>
                    <div class="q-pa-lg row justify-between items-start">
                      <div class="col-md-6 col-12">
                        <ul class="custom-list text-h6">
                          <li><span class="tick-emoji">✔️</span> Stellenbosch University main campus</li>
                          <li><span class="tick-emoji">✔️</span> Spar Convenience Centre for groceries and daily needs
                          </li>
                          <li><span class="tick-emoji">✔️</span> Trendy cafés, takeaways, and student hangouts</li>
                          <li><span class="tick-emoji">✔️</span> University Shuttle Service access point</li>
                          <li>
                            <span class="tick-emoji">✔️</span> Jan S Marais Park - perfect for:
                            <ul style="list-style: disc inside; padding-left: 1.5rem;">
                              <li>Outdoor study sessions</li>
                              <li>Picnics</li>
                            </ul>
                          </li>
                          <li><span class="tick-emoji">✔️</span> Coetzenburg high-performance sports precinct</li>
                        </ul>
                      </div>
                      <div class="col-md-6 col-12" :class="{ 'q-my-md': $q.screen.lt.md }">
                        <section class="hero-carousel bg-grey border-radius">
                          <q-carousel animated v-model="walkingSlide" transition-prev="slide-left"
                            transition-next="slide-left" transition-duration="600" autoplay infinite
                            :autoplay-interval="32000" :height="$q.screen.lt.sm ? '340px' : '450px'"
                            control-color="white" class="hero-carousel__container">
                            <q-carousel-slide v-for="card in walkingCards" :key="card._id" :name="card._id"
                              class="hero-carousel__slide">
                              <q-img :src="card.imageUrl"
                                :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
                                class="hero-carousel__image" fit="cover" loading="lazy" />
                            </q-carousel-slide>
                          </q-carousel>
                        </section>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item v-model="expanded[1]" @hide="expanded[1] = false" @click="handleExpansion(1)"
                    header-class="text-h6 text-left q-pa-md" @show="setSlide(1, $event)" expand-icon-class="text-black"
                    style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Surrounded by nature and adventure</div>
                      </div>
                    </template>
                    <div class="q-pa-lg row justify-between items-start">
                      <div class="col-md-6 col-12">
                        <p class="text-h6">Explore breathtaking natural reserves and trails nearby:</p>
                        <ul class="custom-list text-h6">
                          <li><span class="tick-emoji">✔️</span> Idas Valley Nature Reserve right in your backyard</li>
                          <li><span class="tick-emoji">✔️</span> Incredible views of the Simonsberg and Jonkershoek
                            mountain
                            ranges</li>
                          <li>
                            <span class="tick-emoji">✔️</span> Jonkershoek Nature Reserve - world renowned for:
                            <ul style="list-style: disc inside; padding-left: 1.5rem;">
                              <li>Mountain biking</li>
                              <li>Hiking</li>
                              <li>Trail running</li>
                            </ul>
                          </li>
                          <li>
                            <span class="tick-emoji">✔️</span> Network of cycling and hiking trails through:
                            <ul style="list-style: disc inside; padding-left: 1.5rem;">
                              <li>Pine forests, fynbos, and mountain passes</li>
                              <li>Perfect for beginners and advanced riders</li>
                              <li>Guided tours available</li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                      <div class="col-md-6 col-12" :class="{ 'q-my-md': $q.screen.lt.md }">
                        <section class="hero-carousel bg-grey border-radius">
                          <q-carousel animated v-model="natureSlide" transition-prev="slide-left"
                            transition-next="slide-left" transition-duration="600" autoplay infinite
                            :autoplay-interval="32000" :height="$q.screen.lt.sm ? '340px' : '450px'"
                            control-color="white" class="hero-carousel__container">
                            <q-carousel-slide v-for="card in natureCards" :key="card._id" :name="card._id"
                              class="hero-carousel__slide">
                              <q-img :src="card.imageUrl"
                                :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
                                class="hero-carousel__image" fit="cover" loading="lazy" />
                            </q-carousel-slide>
                          </q-carousel>
                        </section>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item v-model="expanded[2]" @hide="expanded[2] = false" @click="handleExpansion(2)"
                    header-class="text-h6 text-left q-pa-md" @show="setSlide(1, $event)" expand-icon-class="text-black"
                    style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Weekend escapes</div>
                      </div>
                    </template>
                    <div class="q-pa-lg row justify-between items-start">
                      <div class="col-md-6 col-12">
                        <p class="text-h6">Surrounded by stunning nature destinations that include:</p>
                        <ul class="custom-list text-h6">
                          <li><span class="tick-emoji">✔️</span> Jonkershoek Nature Reserve</li>
                          <li><span class="tick-emoji">✔️</span> Helderberg Nature Reserve</li>
                          <li><span class="tick-emoji">✔️</span> Strand Beach</li>
                          <li><span class="tick-emoji">✔️</span> Stellenbosch Botanical Garden</li>
                          <li><span class="tick-emoji">✔️</span> Coetzenburg Hiking Trails</li>
                        </ul>
                        <p class="text-h6">Ideal for long lunches, scenic views, and the perfect break from the books.
                        </p>
                      </div>
                      <div class="col-md-6 col-12" :class="{ 'q-my-md': $q.screen.lt.md }">
                        <section class="hero-carousel bg-grey border-radius">
                          <q-carousel animated v-model="weekendSlide" transition-prev="slide-left"
                            transition-next="slide-left" transition-duration="600" autoplay infinite
                            :autoplay-interval="32000" :height="$q.screen.lt.sm ? '340px' : '450px'"
                            control-color="white" class="hero-carousel__container">
                            <q-carousel-slide v-for="card in weekendCards" :key="card._id" :name="card._id"
                              class="hero-carousel__slide">
                              <q-img :src="card.imageUrl"
                                :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
                                class="hero-carousel__image" fit="cover" loading="lazy" />
                            </q-carousel-slide>
                          </q-carousel>
                        </section>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item v-model="expanded[3]" @hide="expanded[3] = false" @click="handleExpansion(3)"
                    header-class="text-h6 text-left q-pa-md" @show="setSlide(1, $event)" expand-icon-class="text-black"
                    style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Sporting excellence nearby</div>
                      </div>
                    </template>
                    <div class="q-pa-lg row justify-between items-start">
                      <div class="col-md-6 col-12">
                        <ul class="custom-list text-h6">
                          <li>
                            <span class="tick-emoji">✔️</span> Idas Valley Sports Ground: <br> Home of -
                            <ul style="list-style: disc inside; padding-left: 1.5rem;">
                              <li>Stellenbosch FC</li>
                              <li>Federico Coppini Tennis Foundation</li>
                            </ul>
                          </li>
                          <li>
                            <span class="tick-emoji">✔️</span> Lentelus Sports Ground:
                            <ul style="list-style: disc inside; padding-left: 1.5rem;">
                              <li>Historic home of Maties Football Club</li>
                            </ul>
                          </li>
                          <li><span class="tick-emoji">✔️</span> Community tennis courts</li>
                          <li><span class="tick-emoji">✔️</span> Rugby fields</li>
                          <li><span class="tick-emoji">✔️</span> Running routes</li>
                        </ul>
                      </div>
                      <div class="col-md-6 col-12" :class="{ 'q-my-md': $q.screen.lt.md }">
                        <section class="hero-carousel bg-grey border-radius">
                          <q-carousel animated v-model="sportSlide" transition-prev="slide-left"
                            transition-next="slide-left" transition-duration="600" autoplay infinite
                            :autoplay-interval="32000" :height="$q.screen.lt.sm ? '340px' : '450px'"
                            control-color="white" class="hero-carousel__container">
                            <q-carousel-slide v-for="card in sportCards" :key="card._id" :name="card._id"
                              class="hero-carousel__slide">
                              <q-img :src="card.imageUrl"
                                :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
                                class="hero-carousel__image" fit="cover" loading="lazy" />
                            </q-carousel-slide>
                          </q-carousel>
                        </section>
                      </div>
                    </div>
                  </q-expansion-item>
                </div>
              </div>
            </div>
            <div class="text-body1 text-center location-cta">
              <em>At The-WEB, you don't just live near campus, you live at the heart of a lifestyle.
                Mountains. Markets. Matches. Moments. It's all right here.</em>
            </div>
          </div>
        </div>
      </div>

      <!-- <div class="padding-b-xl constrain-standard">
        <div class="location-content bg-transparent column items-center full-width">
          <div class="location-info fade-in-scale">
            <div class="text-h6 text-center section-label large-screen-only">
              <b>⸻&nbsp;&nbsp;&nbsp;LOCATION&nbsp;&nbsp;&nbsp;⸻</b>
            </div>
            <div class="text-h6 text-center section-label small-screen-only">
              <b>—&nbsp;&nbsp;&nbsp;LOCATION&nbsp;&nbsp;&nbsp;—</b>
            </div>
            <div class="text-h3 text-center text-weight-bold location-title line-height-normal">
              Where Campus Meets Lifestyle<br>And Nature Meets Culture
            </div>
            <div class="text-h6 text-center location-subtitle">
              <span class="text-h5 text-weight-bold gold-label">1 Old Helshoogte Road, Idas Valley, Stellenbosch</span>
              <br><br>
              The-WEB is more than just centrally located it's at the intersection of student life, nature, sport,
              and heritage.
              <br>Nestled in Idas Valley, it places you minutes away from everything that matters.
            </div>

            <div class="location-grid row justify-between  ">

              <div class="col-md-6 col-12 q-gutter-y-sm padding-y-xl">
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item header-class="text-h6 text-left q-pa-md" expand-icon-class="text-black"
                    style="border: 1px solid #ccc;" @show="setSlide(1)">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="text-h6">Within walking or easy cycling distance</div>
                      </div>
                    </template>
                    <div class="q-pa-lg">
                      <ul class="custom-list text-h6">
                        <li><span class="tick-emoji">✔️</span> Stellenbosch University main campus</li>
                        <li><span class="tick-emoji">✔️</span> Spar Convenience Centre for groceries and daily needs
                        </li>
                        <li><span class="tick-emoji">✔️</span> Trendy cafés, takeaways, and student hangouts</li>
                        <li><span class="tick-emoji">✔️</span> University Shuttle Service access point</li>
                        <li>
                          <span class="tick-emoji">✔️</span> Jan S Marais Park - perfect for:
                          <ul style="list-style: disc inside; padding-left: 1.5rem;">
                            <li>Outdoor study sessions</li>
                            <li>Picnics</li>
                          </ul>
                        </li>
                        <li><span class="tick-emoji">✔️</span> Coetzenburg high-performance sports precinct</li>
                      </ul>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item header-class="text-h6 text-left q-pa-md" @show="setSlide(2)"
                    expand-icon-class="text-black" style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Surrounded by nature and adventure</div>
                      </div>
                    </template>
                    <div class="q-pa-lg">
                      <p class="text-h6">Explore breathtaking natural reserves and trails nearby:</p>
                      <ul class="custom-list text-h6">
                        <li><span class="tick-emoji">✔️</span> Idas Valley Nature Reserve right in your backyard</li>
                        <li><span class="tick-emoji">✔️</span> Incredible views of the Simonsberg and Jonkershoek
                          mountain
                          ranges</li>
                        <li>
                          <span class="tick-emoji">✔️</span> Jonkershoek Nature Reserve - world renowned for:
                          <ul style="list-style: disc inside; padding-left: 1.5rem;">
                            <li>Mountain biking</li>
                            <li>Hiking</li>
                            <li>Trail running</li>
                          </ul>
                        </li>
                        <li>
                          <span class="tick-emoji">✔️</span> Network of cycling and hiking trails through:
                          <ul style="list-style: disc inside; padding-left: 1.5rem;">
                            <li>Pine forests, fynbos, and mountain passes</li>
                            <li>Perfect for beginners and advanced riders</li>
                            <li>Guided tours available</li>
                          </ul>
                        </li>
                      </ul>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item header-class="text-h6 text-left q-pa-md" @show="setSlide(3)"
                    expand-icon-class="text-black" style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Weekend escapes</div>
                      </div>
                    </template>
                    <div class="q-pa-lg">
                      <p class="text-h6">Surrounded by stunning nature destinations that include:</p>
                      <ul class="custom-list text-h6">
                        <li><span class="tick-emoji">✔️</span> Jonkershoek Nature Reserve</li>
                        <li><span class="tick-emoji">✔️</span> Helderberg Nature Reserve</li>
                        <li><span class="tick-emoji">✔️</span> Strand Beach</li>
                        <li><span class="tick-emoji">✔️</span> Stellenbosch Botanical Garden</li>
                        <li><span class="tick-emoji">✔️</span> Coetzenburg Hiking Trails</li>
                      </ul>
                      <p class="text-h6">Ideal for long lunches, scenic views, and the perfect break from the books.</p>
                    </div>
                  </q-expansion-item>
                </div>
                <div class="col-12" :class="{ 'q-mr-md': $q.screen.gt.sm }">
                  <q-expansion-item header-class="text-h6 text-left q-pa-md" @show="setSlide(4)"
                    expand-icon-class="text-black" style="border: 1px solid #ccc;">
                    <template v-slot:header>
                      <div class="full-width row items-center">
                        <div class="full-width text-h6">Sporting excellence nearby</div>
                      </div>
                    </template>
                    <div class="q-pa-lg">
                      <ul class="custom-list text-h6">
                        <li>
                          <span class="tick-emoji">✔️</span> Idas Valley Sports Ground:
                          <ul style="list-style: disc inside; padding-left: 1.5rem;">
                            <li>Home to Stellenbosch FC and the Federico</li>
                            <li>Coppini Tennis Foundation</li>
                          </ul>
                        </li>
                        <li>
                          <span class="tick-emoji">✔️</span> Lentelus Sports Ground:
                          <ul style="list-style: disc inside; padding-left: 1.5rem;">
                            <li>Historic home of Maties Football Club</li>
                          </ul>
                        </li>
                        <li><span class="tick-emoji">✔️</span> Community tennis courts</li>
                        <li><span class="tick-emoji">✔️</span> Rugby fields</li>
                        <li><span class="tick-emoji">✔️</span> Running routes</li>
                      </ul>
                    </div>
                  </q-expansion-item>
                </div>
              </div>
              <div class="col-md-6 col-12 padding-y-xl">
                <section class="hero-carousel bg-grey border-radius">
                  <q-carousel animated v-model="currentSlide4" transition-prev="slide-left" transition-next="slide-left"
                    transition-duration="1800" autoplay :autoplay-interval="5000"
                    :height="$q.screen.lt.sm ? '340px' : '450px'" control-color="white"
                    class="hero-carousel__container">
                    <q-carousel-slide v-for="card in updatedLocationCards" :key="card._id" :name="card._id"
                      class="hero-carousel__slide">
                      <q-img :src="card.imageUrl" :alt="'The-WEB Residence - ' + (card.title || 'Slide ' + card._id)"
                        class="hero-carousel__image" fit="cover" loading="lazy" />
                    </q-carousel-slide>
                  </q-carousel>
                </section>
              </div>
            </div>

            <div class="text-body1 text-center location-cta">
              <em>At The-WEB, you don't just live near campus, you live at the heart of a lifestyle.
                Mountains. Markets. Matches. Moments. It's all right here.</em>
            </div>
          </div>
        </div>
      </div> -->
      <div class="section-spacer-md"></div>
    </section>



    <!-- FAQ CTA Banner -->
    <div class="faq-banner bg-black text-white">
      <div class="q-py-lg constrain-standard">
        <div class="faq-inner row justify-between items-center full-width">
          <div class="text-h4 text-weight-bold">
            Need more answers? Read our FAQs
          </div>
          <div><CustomButton customStyle="width: 180px" label="Read FAQs" to="/frequently-asked-questions" /></div>
        </div>
      </div>
    </div>



    <!-- contact card -->
    <div id="contact-section" style="height: 100%; background-color: #333;">
      <div class="section-spacer-md"></div>
      <div class="padding-y-xl constrain-standard">
        <q-card flat class="bg-transparent text-white row justify-center">

          <div class="col-md-6 col-12">
            <div class="text-h3 text-underline-on-hover">Discuss with Our Team</div>

            <div class="column text-body1 q-mt-lg">
              <a href="mailto:admin@the-web.co.za" class="q-mb-sm row items-center"
                style="text-decoration: none; color: white;">
                <span class="gold-label text-bold"><q-icon name="eva-email-outline" class="q-mr-md"
                    size="20px" /></span>
                admin@the-web.co.za
              </a>
              <a href="tel:+27213008801" target="_blank" class="q-mb-sm row items-center"
                style="color: white; text-decoration: none; ">
                <span class="gold-label text-bold"><q-icon name="eva-phone-outline" class="q-mr-md"
                    size="20px" /></span>
                (+27) 21-300-8801
              </a>
              <a href="https://www.facebook.com/profile.php?id=61581033305332" target="_blank" class="q-mb-md row items-center"
                style="text-decoration: none; color: white;">
                <span class="gold-label text-bold"><q-icon name="eva-facebook-outline" class="q-mr-md"
                    size="20px" /></span>
                Facebook
              </a>
            </div>
          </div>

          <div class="col-md-6 col-12 bg-transparent">
            <div class="section-spacer-sm small-screen-only"></div>
            <div class="text-h3 text-underline-on-hover">Contact Us</div>

            <div class="q-mt-lg">
              <q-form @submit="submitContactForm" style="width: 100%;">
                <q-input filled label-color=white v-model="userContact.firstName" label="Your Name" stack-label
                  class="q-mb-md bg-dark" required input-style="color: white;" />
                <q-input filled label-color=white v-model="userContact.email" label="Your Email" stack-label
                  class="q-mb-md bg-dark" required input-style="color: white;" />

                <q-input filled label-color=white v-model="number" label="Cell Number" stack-label
                  class="q-mb-md bg-dark" required input-style="color: white;" />

                <q-input filled label-color=white v-model="message" label="Message" type="textarea" stack-label
                  class="q-mb-md bg-dark" required input-style="color: white;" />

                <div class="row justify-between items-center text-body1">
                  <label class="cursor-pointer">
                    <input type="checkbox" name="privacyPolicy" value="agree" required class="q-mr-md">
                    By submitting, you agree to our <span class="text-white text-underline-on-hover"
                      @click.prevent="openPage('/frequently-asked-questions')">privacy policy</span>
                  </label>
                  <CustomButton v-if="$q.screen.gt.sm" class="" type="submit" label="Submit" customStyle="width: 25%" />
                  <CustomButton v-else type="submit" label="Send Message" class="q-mt-md" customStyle="width: 100%" />
                </div>
              </q-form>
            </div>
          </div>
        </q-card>

        <br><br>

        <q-card flat class="bg-transparent text-white row justify-center">
          <div class="map-container full-width row justify-center ">
            <img src="~src/assets/resources/home/map/version1.png" alt="Map" style="background-color: #333" />
            <div class="marker marker-1" data-label="The-WEB"></div>
            <div class="marker marker-2" data-label="450m, 6min walk, 2min drive"></div>
            <div class="marker marker-3" data-label="1.5 km, 22min walk, 5min drive"></div>
            <div class="marker marker-4" data-label="2.1 km, 27min walk, 5min drive"></div>
            <div class="marker marker-5" data-label="4.1km, 53min walk, 11min drive"></div>
            <div class="marker marker-6" data-label="350m, 5min walk, 2min drive"></div>
            <div class="marker marker-7" data-label="4.1km, 53min walk, 11min drive"></div>
            <div class="marker marker-8" data-label="300m, 4min walk, 1min drive"></div>
          </div>
        </q-card>
      </div>
      <div class="footer-section text-white constrain-standard" style="background-color: #333;">
        <q-separator color="primary" style="width: 65%; margin: auto; height: 2px;" />
        <div class="q-py-sm row justify-center items-center text-body1" style="opacity: 75%;">
          © 2025 The-WEB. All rights reserved. | Developed by
          <span class="large-screen-only">&nbsp;</span>
          <a href="https://wlvsolutions.co.za/" target="_blank" class="text-bold text-white cursor-pointer"
            style="text-decoration: none;">
            WLV Solutions
          </a>
        </div>

      </div>
    </div>

    <!-- overlay button -->
    <CustomButton customStyle="width: 180px" label="APPLY NOW" @click="openUnitRentals"
      style="position: fixed; bottom: 20px; left: 20px; z-index: 1000" />
  </q-page>
</template>

<script>
import ImageDialog from 'src/components/elements/ImageDialog.vue';
import 'leaflet/dist/leaflet.css';
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet';

import weblogo3d from '../assets/resources/logos/weblogo3d.png'
import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/EmailService';
import Helper from 'src/services/utils';
import UnitCardComponent from 'src/components/user/UnitCardComponent.vue';
import UnitCardComponentBlack from 'src/components/user/UnitCardComponentBlack.vue';

// Hero
import main from 'src/assets/resources/home/slider/main.png';
import home1 from 'src/assets/resources/home/slider/1.jpg';
import home2 from 'src/assets/resources/home/slider/2.jpg';
import home3 from 'src/assets/resources/home/slider/3.jpg';
import home4 from 'src/assets/resources/home/slider/4.jpg';

// Amenities
import a1 from 'src/assets/resources/home/amenities/am0.png';

// Location - WALKING
import w1 from 'src/assets/resources/home/location/walking/w1.jpg'
import w2 from 'src/assets/resources/home/location/walking/w2.jpg'
import w3 from 'src/assets/resources/home/location/walking/w3.webp'
import w4 from 'src/assets/resources/home/location/walking/w4.jpg'
import w5 from 'src/assets/resources/home/location/walking/w5.jpg'

// Location - NATURE
import n1 from 'src/assets/resources/home/location/nature/n1.jpeg'
import n2 from 'src/assets/resources/home/location/nature/n2.jpg'
import n3 from 'src/assets/resources/home/location/nature/n3.jpg'

// Location - WEEKEND
import we1 from 'src/assets/resources/home/location/weekend/we1.jpg'
import we2 from 'src/assets/resources/home/location/weekend/we2.jpg'
import we3 from 'src/assets/resources/home/location/weekend/we3.jpg'

// Location - SPORTING
import s1 from 'src/assets/resources/home/location/sport/s1.jpg'
import s2 from 'src/assets/resources/home/location/sport/s2.jpg'
import s3 from 'src/assets/resources/home/location/sport/s3.jpg'
import s4 from 'src/assets/resources/home/location/sport/s4.jpg'
import s5 from 'src/assets/resources/home/location/sport/s5.jpg'
import s6 from 'src/assets/resources/home/location/sport/s6.jpg'

import { useMeta } from 'quasar';

export default {
  name: 'Homepage',
  components: {
    CustomButton,
    MaintenanceBanner,
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    UnitCardComponent,
    UnitCardComponentBlack,
    ImageDialog
  },

  setup() {
    useMeta({
      robots: {
        name: 'robots',
        content: 'index, follow'
      },
      title: 'The Web | Premium Student Housing in Stellenbosch',
      meta: [
        {
          name: 'description',
          content:
            'Modern student accommodation in Stellenbosch with resort-style amenities, 24/7 security, high-speed Wi-Fi, and academic-focused living spaces. Apply now for 2026.'
        },
        {
          name: 'keywords',
          content:
            'student housing Stellenbosch, student accommodation, The Web residences, university housing, secure student living'
        },
        {
          property: 'og:title',
          content: 'The Web | Luxury Student Housing in Stellenbosch'
        },
        {
          property: 'og:description',
          content:
            "Stellenbosch's premier student residence featuring study lounges, resort-style pool, social courtyards, and 24/7 security. Applications open for 2026."
        },
        {
          property: 'og:url',
          content: 'https://the-web.co.za' + window.location.pathname
        },
        {
          property: 'og:image',
          content: 'https://the-web.co.za/assets/outside3.jpg'
        },
        {
          property: 'og:type',
          content: 'website'
        },
        {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        {
          name: 'twitter:title',
          content: 'The Web | Premium Student Housing in Stellenbosch'
        },
        {
          name: 'twitter:description',
          content:
            'Luxury student accommodation with academic facilities, social spaces, and premium amenities. Secure your spot for 2026.'
        }
      ],
      link: [
        {
          rel: 'canonical',
          href: 'https://the-web.co.za' + window.location.pathname
        }
      ]
    });
  },

  data() {
    return {
      logoSrc: weblogo3d,
      activeLocationInfo: 'first',
      expanded: [true, false, false, false],

      parallax: home2,
      parallax2: home3,

      currentSlide: null,
      overlayHidden: false,

      currentSlide: 1,
      currentSlide2: 1,
      currentSlide3: 1,

      showImageDialog: false,
      currentDialogImageUrl: '',

      heroCards: [
        { _id: 1, imageUrl: main },
        { _id: 2, imageUrl: home1 },
        { _id: 3, imageUrl: home2 },
        { _id: 4, imageUrl: home3 },
        { _id: 5, imageUrl: home4 },
      ],

      a1,

      // New Location Setup
      walkingSlide: 1,
      walkingCards: [
        { _id: 1, imageUrl: w1 },
        { _id: 2, imageUrl: w2 },
        { _id: 3, imageUrl: w3 },
        { _id: 4, imageUrl: w4 },
        { _id: 5, imageUrl: w5 },
      ],
      natureSlide: 1,
      natureCards: [
        { _id: 1, imageUrl: n1 },
        { _id: 2, imageUrl: n2 },
        { _id: 3, imageUrl: n3 },
      ],
      weekendSlide: 1,
      weekendCards: [
        { _id: 1, imageUrl: we1 },
        { _id: 2, imageUrl: we2 },
        { _id: 3, imageUrl: we3 },
      ],
      sportSlide: 1,
      sportCards: [
        { _id: 1, imageUrl: s1 },
        { _id: 2, imageUrl: s2 },
        { _id: 3, imageUrl: s3 },
        { _id: 4, imageUrl: s4 },
        { _id: 5, imageUrl: s5 },
        { _id: 6, imageUrl: s6 },
      ],
      userContact: {
        firstName: '',
        email: ''
      },
      message: '',
      number: ''
    };
  },

  methods: {
    getImageUrl: Helper.getImageUrl,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    setSlide(id, event) {
      this.currentSlide3 = id
      this.walkingSlide = id
      this.natureSlide = id
      this.weekendSlide = id
      this.sportSlide = id
      this.$nextTick(() => {
        event.target.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      });
    },

    handleExpansion(expandedIndex) {
      this.expanded = this.expanded.map((_, index) => index === expandedIndex)
    },

    openPage(route) {
      this.$router.push(`${route}`)
    },

    handleScroll() {
      this.overlayHidden = window.scrollY > 100
    },

    openImageDialog(url) {
      this.currentDialogImageUrl = url
      this.showImageDialog = true
    },

    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = window.innerHeight * 0.1;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },

    openUnitRentals() {
      this.$router.push('/units/apply/floor/1')
    },

    async submitContactForm() {
      const checkbox = document.querySelector('input[name="privacyPolicy"]');
      if (!checkbox.checked) {
        this.$q.notify({ type: 'negative', message: 'You must agree to the privacy policy before submitting.' });
        return;
      }

      try {
        const finalMessage = this.number
          ? `Cell: ${this.number} - ${this.message}`
          : this.message;

        const response = await EmailService.GetInContact(this.userContact, finalMessage);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Message sent successfully!' });
          this.userContact.firstName = '';
          this.userContact.email = '';
          this.message = '';
          this.number = '';
        } else {
          this.$q.notify({ type: 'negative', message: 'Error sending message.' });
        }
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error sending message.' });
      }
    }
  },

  mounted() {
    window.addEventListener('scroll', this.handleScroll)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-once')
          entry.target.style.willChange = 'transform, opacity'
        }
      })
    }, {
      threshold: this.$q.screen.lt.sm ? 0.1 : 0.2
    })

    const elements = this.$el.querySelectorAll('.slide-in-left, .slide-in-right')
    elements.forEach(el => {
      observer.observe(el)
    })
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
};
</script>

<!-- home sections -->
<style lang="scss" scoped>

/* #region HERO CAROUSEL */
.hero-carousel {
  margin-top: 0;
  position: relative;
  overflow: hidden;

  &__container {
    margin: 0 !important;
    padding: 0 !important;
    width: 100%;

    .q-carousel__navigation-inner {
      padding-bottom: 1.5rem;

      @media (max-width: 600px) {
        padding-bottom: 1rem;
      }
    }

    .q-carousel__arrow {
      color: white;
      font-size: 1.75rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;
      width: 2.5rem;
      height: 2.5rem;

      @media (max-width: 600px) {
        font-size: 1.5rem;
        width: 2rem;
        height: 2rem;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.5);
      }

      &:focus {
        outline: 2px solid white;
        outline-offset: 2px;
      }
    }
  }

  &__slide {
    padding: 0 !important;
    margin: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

@media (max-width: 600px) {
  .hero-carousel__container {
    .q-carousel__navigation {
      bottom: 0.5rem;
    }
  }
}

@media (prefers-reduced-motion: reduce) {
  .hero-carousel__container {
    transition-duration: 0.01ms !important;

    * {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
    }
  }
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  display: flex;
  justify-content: center;
  padding-top: 10%;
  align-items: start;
  text-align: center;

  color: white;
  text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
  opacity: 1;
  transition: opacity 0.5s ease-in-out;
  pointer-events: none;
  background: rgba(34, 34, 34, 0.4);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
}

.hero-overlay--hidden {
  opacity: 0;
}

.company-name {
  margin: 0;
}

/* #endregion HERO CAROUSEL */


/* #region BANNER/CTA */
.cta-banner {
  height: auto;
  min-height: 120px;
  display: flex;
  align-items: center;

  @media (max-width: 767px) {
    min-height: 100px;
  }
}

/* #endregion BANNER/CTA */


/* #region BANNER/CTA/FAQ */
.faq-banner {
  height: auto;
  min-height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 767px) {
    min-height: 100px;
    text-align: center;

    .faq-inner {
      flex-direction: column;
      gap: 1rem; // space between text + button
    }
  }
}

/* #endregion BANNER/CTA/FAQ */


/* #region WELCOME BANNER */
.welcome-banner {
  position: relative;
}

.welcome-parallax {
  background-position: center 30% !important;
  background-size: cover !important;
}

.welcome-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(34, 34, 34, 0.8);
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.welcome-content {
  margin: 0 auto;
}

.welcome-title {
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    margin-bottom: 1.5rem;
  }
}

.welcome-description {
  p {
    margin-bottom: 1.5rem;
    line-height: 1.6;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  @media (max-width: 767px) {
    p {
      margin-bottom: 1.25rem;
    }
  }
}

.welcome-cta {
  margin-top: 2rem;

  @media (max-width: 767px) {
    margin-top: 1.5rem;
  }
}

/* #endregion WELCOME BANNER */


/* #region AMENITIES SECTION */
.amenities-section {
  background-color: #333;
  color: white;
}

.amenities-content {
  background-color: #333;
  height: 100%;
  min-height: 600px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 767px) {
    min-height: auto;
    // padding: 0 1rem;
  }
}

.amenities-text {
  background: transparent !important;
  max-width: 600px;
  width: 100%;
}

.amenities-title {
  margin: 1.5rem 0;

  @media (max-width: 767px) {
    margin: 1rem 0;
  }
}

.amenities-list {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;

  li {
    padding: 0.5rem 0;
    display: flex;
    align-items: center;
    line-height: 1.4;
  }

  @media (max-width: 767px) {
    margin: 0 0 1.5rem 0;

    li {
      padding: 0.4rem 0;
    }
  }
}

.emoji {
  margin-right: 0.75rem;
  min-width: 24px;
  text-align: center;

  @media (max-width: 767px) {
    margin-right: 0.5rem;
    min-width: 20px;
  }
}

.amenities-cta {
  margin-top: 1.5rem;

  @media (max-width: 767px) {
    margin-top: 1rem;
  }
}

.amenities-carousel {
  background-color: #333;
  margin-top: 0;

  @media (max-width: 767px) {
    margin-top: 2rem;
  }

  &__container {
    background-color: #333;
  }

  &__slide {
    padding: 0 !important;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.mobile-no-pl {
  padding-left: 16px;
  /* default for md+ */
}

@media (max-width: 768px) {
  .mobile-no-pl {
    padding-left: 0 !important;
    /* remove on mobile */
  }
}

/* #endregion AMENITIES SECTION */


/* #region ROOMS SECTION */
.rooms-section {
  // background-color: #121212;
  position: relative;
}

// .rooms-header {
//   background-color: #121212;
// }

.rooms-title {
  margin-bottom: 1.5rem;

  @media (max-width: 767px) {
    margin-bottom: 1rem;
  }
}

.rooms-subtitle {
  line-height: 1.6;
  // max-width: 800px;
  margin: 0 auto;

  @media (max-width: 767px) {
    br {
      display: none;
    }
  }
}

// .rooms-content {
//   background-color: #121212;
// }

.room-card {
  // background-color: #c0c0c0 !important;
  padding: 0.5rem;
  height: 100%;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  // &:hover {
  //   transform: translateY(-4px);
  //   box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  // }
}

.room-type {
  margin-bottom: 1rem;
}

.room-name {
  margin: 0 0 0 0;
  font-weight: bold;
}

.room-description {
  margin: 0;
  // color: #e0e0e0;
}

.rooms-includes {
  max-width: 600px;
  margin: 0 auto;
}

/* Web icon styles */
.web-icon {
  font-size: 3rem;
  display: inline-block;

  &--botmaskop {
    filter: invert(70%) sepia(95%) saturate(4%) hue-rotate(7deg) brightness(105%) contrast(102%);
  }

  &--helshoogte {
    filter: invert(86%) sepia(32%) saturate(1%) hue-rotate(314deg) brightness(81%) contrast(106%);
  }
}

/* #endregion ROOMS SECTION */


/* #region LOCATION SECTION */
.location-section {
  background-color: white;
}

.location-carousel {
  &__container {
    margin: 0 !important;
    padding: 0 !important;
  }

  &__slide {
    padding: 0 !important;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.location-content {
  background: transparent;
}

.location-info {
  width: 100%;
  // max-width: 1300px;
}

.location-title {
  margin: 1.5rem 0;
  line-height: 1.25;
}

.location-subtitle {
  line-height: 1.6;
}

// .location-grid {
//   margin: 0 -0.5rem;
// }

// .location-block {
//   // margin-bottom: 2rem;

//   @media (max-width: 767px) {
//     // margin-bottom: 2.5rem;
//   }

//   &__title {
//     margin-bottom: 1.5rem;
//     line-height: 1.3;

//     @media (max-width: 767px) {
//       // margin-bottom: 1rem;
//     }
//   }

//   &__subtitle {
//     margin-bottom: 1.5rem;
//     line-height: 1.5;
//   }

//   &__footer {
//     margin-top: 1.5rem;
//     line-height: 1.5;
//   }
// }

.location-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1.5rem 0;

  li {
    padding: 0.5rem 0;
    display: flex;
    align-items: flex-start;
    line-height: 1.4;
  }
}

.checkmark,
.emoji {
  margin-right: 0.5rem;
  min-width: 24px;
  display: inline-block;
}

.location-cta {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.6;
}

.section-label {
  margin-bottom: 1rem;
}

/* #endregion LOCATION SECTION */


/* #region HERITAGE BANNER */
// .heritage-banner {
//   position: relative;
// }

// .heritage-parallax {
//   background-position: center 30% !important;
//   background-size: cover !important;
//   min-height: 700px;

//   @media (max-width: 767px) {
//     min-height: 800px;
//   }
// }

// .heritage-overlay {
//   position: absolute;
//   top: 0;
//   left: 0;
//   width: 100%;
//   height: 100%;
//   display: flex;
//   align-items: center;
//   justify-content: center;
//   background: rgba(34, 34, 34, 0.8);
//   backdrop-filter: blur(4px);
//   -webkit-backdrop-filter: blur(4px);
// }


// .heritage-title {
//   margin: 0;
//   line-height: 1.3;
// }

// .heritage-description {
//   p {
//     margin-bottom: 1rem;
//     line-height: 1.6;

//     &:last-child {
//       margin-bottom: 0;
//     }
//   }

//   @media (max-width: 767px) {
//     p {
//       margin-bottom: 0.8rem;

//       br {
//         display: none;
//       }
//     }
//   }
// }

// @media (max-width: 767px) {
//   .heritage-parallax .q-parallax__content {
//     min-height: 800px !important;
//     display: flex;
//     align-items: center;
//     justify-content: center;
//   }

//   .heritage-overlay {
//     padding: 1.5rem !important;
//     min-height: 800px;
//   }
// }

/* #endregion HERITAGE BANNER */


/* #region WHY CHOOSE SECTION */
.why-choose-section {
  background-color: #333;
  color: white;
}

.why-choose-content {
  height: 100%;
  min-height: 600px;
  max-width: 1600px;
  margin: 0 auto;

  @media (max-width: 767px) {
    min-height: auto;
    // padding: 0 1rem;
  }
}

.why-choose-image {
  // margin-top: 0;
  border-radius: 2px;

  @media (max-width: 767px) {
    margin-top: 2rem;
  }
}

.why-choose-text {
  background: transparent !important;
  max-width: 600px;
  width: 100%;
}

.why-choose-title {
  margin: 1.5rem 0;

  @media (max-width: 767px) {
    margin: 1rem 0;
  }
}

.why-choose-subtitle {
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: 767px) {
    margin-bottom: 1.5rem;

    br {
      display: none;
    }
  }
}

.why-choose-list {
  margin-bottom: 2rem;

  @media (max-width: 767px) {
    margin-bottom: 1.5rem;
  }
}

.why-choose-cta {
  line-height: 1.6;

  br {
    display: none;
  }

  @media (max-width: 767px) {
    text-align: center;
  }
}



/* #endregion WHY CHOOSE SECTION */

.section-label {
  margin-bottom: 1rem;
  color: #009B77;
}

.gold-label {
  color: #009B77;
}

.tick-emoji {
  filter: invert(44%) sepia(40%) saturate(5175%) hue-rotate(142deg) brightness(90%) contrast(101%);
  //  invert(39%) sepia(62%) saturate(3817%) hue-rotate(28deg) brightness(100%) contrast(97%);
}
</style>


<style lang="sass" scoped>

.dark-wrapper
  background-color: #121212
  height: 100%

// Animation
// -------------------------------------------------------------------
.overflow-hidden-x
  overflow-x: hidden
  position: relative

.fade-in-scale
  transform: scale(0.8)
  animation: fade-in linear forwards
  animation-timeline: view()
  animation-range: 150px 600px

@keyframes fade-in
  from
    transform: scale(0.8)
  to
    transform: scale(1)
    opacity: 1

.slide-up
  transform: translateY(100%)
  animation: slideUp 4s ease forwards
  animation-timeline: view()
  animation-range: 100px 600px

@keyframes slideUp
  from
    transform: translateY(100%)
  to
    transform: translateY(0)

.slide-in-left
  opacity: 0
  transform: translateX(-500px)

  &.animate-once
    animation: slide-left 0.8s ease-out forwards

.slide-in-right
  /* start hidden and shifted */
  opacity: 0
  transform: translateX(40px)
  will-change: transform, opacity

  &.animate-once
    animation: slide-left 0.8s ease-out forwards

/* Desktop: increase distance */
@media (min-width: 768px)
  .slide-in-right
    transform: translateX(500px)

@media (min-width: 768px)
  @keyframes slide-right
    from
      transform: translateX(500px)
      opacity: 0
    to
      transform: translateX(0)
      opacity: 1

/* Mobile: keep smaller slide */
@media (max-width: 767px)
  @keyframes slide-right
    from
      transform: translateX(40px)
      opacity: 0
    to
      transform: translateX(0)
      opacity: 1



@keyframes slide-left
  to
    transform: translateX(0)
    opacity: 1


.fade-up
  transform: translateY(150px)
  animation: fade-up ease-out forwards
  animation-timeline: view()
  animation-range: 150px 500px

@keyframes fade-up
  from
    transform: translateY(150px)
  to
    transform: translateY(0)
    opacity: 1

.hover-scale:hover
  transform: scale(1.05)
  transition: transform 0.3s ease

// carousel
// -------------------------------------------------------------------
// .parallax-adjusted .q-parallax__image
//   object-fit: cover
//   object-position: center 30%

// .fullscreen-carousel
//   margin: 0 !important
//   padding: 0 !important

// .q-carousel__slide
//   padding: 0 !important

// .q-carousel__navigation-inner
//   padding-bottom: 20px

// .q-carousel__arrow
//   color: white
//   font-size: 2rem

// images
// -------------------------------------------------------------------
.hero-image
  width: 100%
  height: 100vh
  object-fit: cover
  @media (max-width: 600px)
    height: 340px

.border-radius
  border-radius: 4px
.side-image
  object-fit: cover
  width: 100%
  height: 100%
  // max-width: 1280px
  border-radius: 4px
  @media (max-width: 767px)
    height: 300px
    max-width: 500px
    margin: 0 auto

// lists
// -------------------------------------------------------------------
.custom-list
  list-style-type: none
  padding-left: 1em
  line-height: 1.4

.custom-list li
  position: relative
  padding-left: 2.5em
  text-indent: -3em
  margin-bottom: 0.5em

.custom-list ul
  list-style: disc
  padding-left: 1.5rem
  margin-top: 0.25rem
  margin-bottom: 0

.custom-list ul li
  padding-left: 3rem

.custom-list li:before
  content: ""
  position: absolute
  left: 0
  padding-right: 0.5em

/* For lists with checkmarks */
.custom-list li span
  position: relative
  left: -0.5em

.emoji
  font-family: "Twemoji Mozilla", "Segoe UI Emoji"
  color: #ffd700
</style>

<!-- map -->
<style lang="sass" scoped>
.map-container
  position: relative
  width: 100%
  height: auto
  overflow-x: hidden

  img
    display: block
    width: 100%
    height: auto

@keyframes pulse
  0%
    transform: translate(-50%, -100%) scale(1)
    opacity: 1
  50%
    transform: translate(-50%, -100%) scale(1.1)
    opacity: 0.9
  100%
    transform: translate(-50%, -100%) scale(1)
    opacity: 1

@keyframes fadeInLabel
  0%
    opacity: 0
    transform: translateX(-50%) translateY(10px)
  100%
    opacity: 1
    transform: translateX(-50%) translateY(0)

%marker-base
  position: absolute
  cursor: pointer
  background-size: contain
  background-repeat: no-repeat
  transform: translate(-50%, -100%)
  animation: pulse 1.5s infinite ease-in-out
  border-radius: 8px
  box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.4)

  &::after
    content: attr(data-label)
    position: absolute
    width: max-content
    min-width: 57px
    max-width: 90vw
    height: auto
    left: 100%
    top: -25px
    transform: translateX(10%) translateY(0)
    background: #fff
    color: #000
    padding: 6px 12px
    font-size: 14px
    border-radius: 10px
    opacity: 0
    pointer-events: none
    white-space: nowrap
    box-shadow: 2px 4px 6px rgba(0, 0, 0, 0.4)
    transition: opacity 0.3s ease

  &:hover::after
    opacity: 1

.marker-1
  @extend %marker-base
  top: 15%
  left: 63%
  width: 59px
  height: 42.5px
  // height: 53.5px
  // padding: 3px
  background-image: url('/assets/map/web.png')
  background-color: white
  border: 2px solid white

.marker-2
  @extend %marker-base
  top: 27%
  left: 54%
  width: 60px
  height: 60px
  background-image: url('/assets/map/steers.jpeg')
  border: 2px solid white

.marker-3
  @extend %marker-base
  top: 60%
  left: 34%
  width: 60px
  height: 60px
  background-image: url('/assets/map/hospital2.png')
  border: 2px solid red

.marker-4
  @extend %marker-base
  top: 82%
  left: 18%
  width: 60px
  height: 60px
  background-image: url('/assets/map/university.jpeg')
  border: 2px solid #b8860b

.marker-5
  @extend %marker-base
  top: 84%
  left: 23%
  width: 55px
  height: 60px
  background-image: url('/assets/map/neelsie.jpeg')
  border: 2px solid #4B2E17

.marker-6
  @extend %marker-base
  top: 29%
  left: 59%
  width: 50px
  height: 50px
  background-image: url('/assets/map/spar.jpeg')
  border: 2px solid green

.marker-7
  @extend %marker-base
  top: 99%
  left: 5%
  width: 55px
  height: 28px
  background-image: url('/assets/map/kfc.jpeg')
  border: 2px solid red

.marker-8
  @extend %marker-base
  top: 28%
  left: 56%
  width: 55px
  height: 28px
  background-image: url('/assets/map/kfc.jpeg')
  border: 2px solid red

@media (max-width: 600px)
  .marker-2, .marker-3, .marker-4, .marker-5, .marker-6
    width: 30px !important
    height: 30px !important

  .marker-7, .marker-8
    width: 30px !important
    height: 16px !important

  .marker-1
    width: 37px !important
    height: 28px !important

    &::after
      font-size: 12px
      min-width: 45px
      padding: 4px 8px
      top: -40px
</style>
