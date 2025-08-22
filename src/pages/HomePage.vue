<template>
  <q-page>



    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div style="margin-top: 0;" class="bg-grey">
      <q-carousel animated v-model="currentSlide" infinite autoplay :autoplay-interval="5000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
        :height="$q.screen.lt.sm ? 'auto' : '100vh'" control-color="white" class="fullscreen-carousel">
        <q-carousel-slide v-for="card in heroCards" :key="card._id" :name="card._id" class="column no-wrap flex-center">
          <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image" fit="cover" />
        </q-carousel-slide>
      </q-carousel>
    </div>



    <!-- Read to move in Banner -->
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div style="height: 100%;">
      <div flat class="
        bg-black
        text-white
        row justify-between
        q-pa-xl
        ">
        <q-card-section class="text-h4">
          <div class="text-h4">Reserve Now For 2026 Move-in</div>
        </q-card-section>
        <q-card-section>
          <CustomButton color="black" text-color="white" label="Visit the Unit Rental List " to="/units/apply"
            style="border: 2px solid white;" />
        </q-card-section>
      </div>
    </div>



    <!-- Welcome banner -->
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax :src="parallax" :speed="0.6" :height="$q.screen.gt.sm ? 600 : 900"
      :style="`height: ${$q.screen.gt.sm ? 600 : 900}px; background-position: center 30% !important; background-size: cover !important;`">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.8);
          backdrop-filter: blur(4px);
          -webkit-backdrop-filter: blur(4px);
        " class="text-white text-start column justify-center q-pa-xl">
        <q-card-section class="">
          <div class="text-h5">The Future of Student Living — Only at The-WEB</div>
          <br>
          <div class="text-caption">
            Modern. Purpose-Built. Perfectly Positioned.
          </div>
          <br>
          <div class="text-body1 q-mb-lg">
            The-WEB, a premium private student residence redefining accommodation in Stellenbosch. Rising as a striking
            four-storey landmark, The-WEB offers 24 luxurious, fully furnished apartments, crowned by a 360-degree
            panoramic rooftop deck with breathtaking views of the Banhoek and Simonsberg mountains. <br><br>
            As a green building, it features backup solar power and natural spring borehole water on tap, ensuring
            uninterrupted living. Students enjoy world-class amenities, including high-speed Wi-Fi, on-site laundry,
            stylish social lounges, communal study areas, dedicated gaming and entertainment spaces, a braai area and
            swimming pool, a tranquil Zen garden, and secure on-site parking. For peace of mind, The-Web offers 24-hour
            security with advanced access control and CCTV. <br><br>
            Located within walking distance of Stellenbosch University’s central campus and the Simonsrust Convenience
            Centre. Added convenience comes with direct access to the Stellenbosch University shuttle route, making
            getting around effortless.
            <br><br>
            <span class="text-caption">Choose the lifestyle option that suits you best: from R6 250 to R12 000 per
              month</span>
          </div>
        </q-card-section>
      </div>
    </q-parallax>



    <!-- amenities -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <div style="height: 120px; background-color: #333;"></div>
    <div id="amenities-section" class="row justify-around" style="height: 100%; background-color: #333;">
      <q-card flat class="
        bg-transparent
        text-white
        text-body1
        q-pa-lg
        col-md-4 col-12
        " style="max-width: 600px; width: 100%;">
        <q-card-section class="fade-in-scale">
          <div class="text-body1">
            <b>⸻&nbsp;&nbsp;&nbsp;AMENITIES&nbsp;&nbsp;&nbsp;⸻</b>
          </div>
          <br>
          <div class="text-h3">What's inside The-WEB?</div>
          <br>
          <ul class="q-mb-lg custom-list">
            <li><span class="q-mr-sm">⛰</span> 360° panoramic views</li>
            <li><span class="q-mr-sm">📚</span> Communal Study areas</li>
            <li><span class="q-mr-sm">🎮</span> Entertainment area</li>
            <li><span class="q-mr-sm">🔥</span> Braai & swimming pool</li>
            <li><span class="q-mr-sm">🌿</span> Tranquil Zen garden</li>
            <li><span class="q-mr-sm">🧺</span> Smart laundry facilities</li>
            <li><span class="q-mr-sm">🔋</span> Backup power & water</li>
            <li><span class="q-mr-sm">🛡️</span> 24/7 Security</li>
            <li><span class="q-mr-sm">💧</span> Pure spring water on tap</li>
            <li><span class="q-mr-sm">🚐</span> University shuttle route</li>
          </ul>
          <br>
          <div class="text-body2">
            Live where your lifestyle is supported, not limited.
          </div>
        </q-card-section>
      </q-card>


      <div style="margin-top: 0; background-color: #333;" class="col-md-7 col-12 full-height">
        <q-carousel style="background-color: #333;" animated v-model="currentSlide4" infinite autoplay
          :autoplay-interval="5000" transition-prev="slide-right" transition-next="slide-left"
          transition-duration="1800" height="600px" arrows control-color="white" class="">
          <q-carousel-slide v-for="card in amenitiesCards" :key="card._id" :name="card._id"
            class="column no-wrap flex-center">
            <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image cursor-pointer" fit="cover"
              @click="openImageDialog(card.imageUrl)" />
          </q-carousel-slide>
        </q-carousel>
      </div>
    </div>
    <div style="height: 120px; background-color: #333;"></div>
    <ImageDialog v-model="showImageDialog" :imageUrl="currentDialogImageUrl" />




    <!-- map -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <div style="background-color: #333" class="q-px-lg">
      <div class="map-container full-width row justify-center ">
        <img src="~src/assets/resources/home/map/version1.png" alt="Map" style="background-color: #333" />
        <div class="marker marker-1" data-label="The-WEB"></div>
        <div class="marker marker-2" data-label="450m, 6min walk, 2min drive"></div>
        <div class="marker marker-3" data-label="1.5 km, 22min walk, 5min drive"></div>
        <div class="marker marker-4" data-label="2.1 km, 27min walk, 5min drive"></div>
        <div class="marker marker-5" data-label="4.1km, 53min walk, 11min drive"></div>
        <div class="marker marker-6" data-label="160m, 2min walk, 1min drive"></div>
        <div class="marker marker-7" data-label="4.1km, 53min walk, 11min drive"></div>
      </div>
    </div>
    <div style="height: 120px; background-color: #333;"></div>



    <!-- Floor Levels q-pa-xl -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <div style="height: 60px; background-color: #121212;"></div>
    <div id="units-section" class="q-py-xl dark-wrapper text-white">
      <div class="full-width text-center">
        <div class="text-h4 q-mb-md">Rooms</div>
        <div class="text-body1 q-pa-md">
          We offer three elevated room types from stylish screened studios <br> to premium balcony units each designed
          to meet the needs of modern students.
        </div>
      </div>
      <div class="q-px-md q-pt-sm">
        <br>
        <div class="row  justify-center constrain">
          <div class="col-md-4 col-12">
            <q-card flat class="text-white q-pa-md text-center q-ma-sm" style="background-color: #222;">
              <div class="text-h6 q-mb-sm">
                <span class="q-mr-sm"
                  style="filter: invert(70%) sepia(95%) saturate(4%) hue-rotate(7deg) brightness(105%) contrast(102%);">
                  🕸️
                </span>
                <!-- The Pinnacle -->
                Helshoogte
              </div>
              <p class="text-body2">Top-tier spacious room with private balcony, premium finishes, and the best views.
                Limited availability.</p>
            </q-card>
          </div>
          <div class="col-md-4 col-12">
            <q-card flat class="text-white q-pa-md text-center q-ma-sm" style="background-color: #222;">
              <div class="text-h6 q-mb-sm">
                <span class="q-mr-sm"
                  style="filter: invert(71%) sepia(72%) saturate(825%) hue-rotate(1deg) brightness(107%) contrast(104%);">
                  🕸️
                </span>
                <!-- The Core -->
                Botmaskop
              </div>
              <p class="text-body2">Sleek single room with modern, minimalist premium finishes and efficient layout.</p>
            </q-card>
          </div>
          <div class="col-md-4 col-12">
            <q-card flat class="text-white q-pa-md text-center q-ma-sm" style="background-color: #222;">
              <div class="text-h6 q-mb-sm">
                <span class="q-mr-sm"
                  style="filter: invert(86%) sepia(32%) saturate(1%) hue-rotate(314deg) brightness(81%) contrast(106%);">
                  🕸️
                </span>
                <!-- The Strand -->
                Banhoek
              </div>
              <p class="text-body2">Optimized layout with semi-private feel and bold value including all premium
                finishes.</p>
            </q-card>
          </div>
        </div>
        <div class="text-body2 q-my-lg text-center">
          <b>All rooms include: </b> High-speed Wi-Fi, built-in storage, study desks, and secure access
        </div>
      </div>
      <br><br><br><br><br><br>
      <UnitCardComponentBlack />
    </div>
    <div style="height: 90px; background-color: #121212;"></div>



    <!-- LOCATION -->
    <!-- <div style="height: 30px; background-color: white;"></div> -->
    <div id="location-section">
      <div style="margin-top: 0;" :style="$q.screen.gt.sm ? 'padding: 10em' : 'padding: 0'">
        <q-carousel animated v-model="currentSlide3" infinite autoplay :autoplay-interval="5000"
          transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
          :height="$q.screen.lt.sm ? 'auto' : '100vh'" arrows control-color="white" class="fullscreen-carousel">
          <q-carousel-slide v-for="card in locationCards" :key="card._id" :name="card._id"
            class="column no-wrap flex-center">
            <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image" fit="cover" />
          </q-carousel-slide>
        </q-carousel>
      </div>

      <q-card flat class="bg-transparent text-body1 row justify-center full-width q-px-lg">
        <q-card-section class="fade-in-scale constrain">
          <div class="text-body1 text-center">
            <b>⸻&nbsp;&nbsp;&nbsp;LOCATION&nbsp;&nbsp;&nbsp;⸻</b>
          </div>
          <br>
          <div class="text-h3 text-center" style="line-height: 1.25;">Where Campus Meets Lifestyle <br>And Nature Meets
            Culture</div>
          <br>
          <div class="text-body2 text-center q-mb-lg" style="line-height: 1.69;">
            <span class="text-body1"><b>1 Old Helshoogte Road, Idas Valley, Stellenbosch</b></span>
            <br><br>
            The-WEB is more than just centrally located it's at the intersection of <br> Student life, nature, sport,
            and
            heritage.
            Nestled in Idas Valley, it places you minutes away from everything that matters.
          </div>
          <br>
          <!-- 2x2 Grid: Four Blocks -->
          <div class="row justify-around q-mt-lg">
            <!-- Block 1 -->
            <div class="col-md-6 col-12 full-height">
              <div class="text-h4 q-mb-md">Within walking or easy <br> cycling distance</div>
              <ul class="q-mb-lg custom-list">
                <li><span class="q-mr-sm">✔️</span> Stellenbosch University main campus</li>
                <li><span class="q-mr-sm">✔️</span> Spar Convenience Centre for groceries and daily needs</li>
                <li><span class="q-mr-sm">✔️</span> Trendy cafés, takeaways, and student hangouts</li>
                <li><span class="q-mr-sm">✔️</span> University Shuttle Service access point</li>
                <li>
                  <span class="q-mr-sm">✔️</span> Jan S Marais Park - perfect for:
                  <ul class="q-mt-xs" style="list-style: disc; padding-left: 1.5rem; margin-top: 0.25rem;">
                    <li>Outdoor study sessions</li>
                    <li>Picnics</li>
                  </ul>
                </li>
                <li><span class="q-mr-sm">✔️</span> Coetzenburg high-performance sports precinct</li>
              </ul>
            </div>

            <!-- Block 2 -->
            <div class="col-md-5 col-12 full-height">
              <div class="text-h4 q-mb-md">Weekend escapes</div>
              <div class="text-body1 q-mb-lg">
                Surrounded by award-winning wine farm <br> that includes:
              </div>
              <ul class="q-mb-lg custom-list">
                <li><span class="q-mr-sm">🍷</span> Tokara</li>
                <li><span class="q-mr-sm">🍷</span> Delaire Graff</li>
                <li><span class="q-mr-sm">🍷</span> Rustenberg</li>
                <li><span class="q-mr-sm">🍷</span> Lanzerac</li>
                <li><span class="q-mr-sm">🍷</span> Glenelly Estate</li>
              </ul>
              <div class="text-body2 q-mt-lg">
                Ideal for long lunches, scenic views, and the perfect <br> break from the
                books
              </div>
            </div>
          </div>



          <div class="row justify-around q-mt-lg">
            <!-- Block 3 -->
            <div class="col-md-6 col-12 full-height">
              <div class="text-h4 q-mb-md">Surrounded by nature and adventure</div>
              <div class="text-body1 q-mb-lg">
                Explore breathtaking natural reserves <br> and trails nearby:
              </div>
              <ul class="q-mb-lg custom-list">
                <li><span class="q-mr-sm">✔️</span> Idas Valley Nature Reserve right in your backyard
                </li>
                <li><span class="q-mr-sm">✔️</span> Incredible views of the Simonsberg and Jonkershoek mountain ranges
                </li>
                <li>
                  <span class="q-mr-sm">✔️</span> Jonkershoek Nature Reserve - world renowned for:
                  <ul class="q-mt-xs" style="list-style: disc; padding-left: 1.5rem; margin-top: 0.25rem;">
                    <li>Mountain biking</li>
                    <li>Hiking</li>
                    <li>Trail running</li>
                  </ul>
                </li>
                <li>
                  <span class="q-mr-sm">✔️</span> Network of cycling and hiking trails through:
                  <ul class="q-mt-xs" style="list-style: disc; padding-left: 1.5rem; margin-top: 0.25rem;">
                    <li>Pine forests, fynbos, and
                      mountain passes</li>
                    <li>Perfect for beginners and advanced riders</li>
                    <li>Guided tours available</li>
                  </ul>
                </li>
              </ul>
            </div>

            <!-- Block 4 -->
            <div class="col-md-5 col-12 full-height">
              <div class="text-h4 q-mb-md">Sporting excellence nearby</div>
              <ul class="q-mb-lg custom-list">
                <li><span class="q-mr-sm">✔️</span>
                  Idas Valley Sports Ground:
                  <ul class="q-mt-xs" style="list-style: disc; padding-left: 1.5rem; margin-top: 0.25rem;">
                    <li>Home to Stellenbosch FC and the Federico</li>
                    <li>Coppini Tennis Foundation</li>
                  </ul>
                </li>
                <li><span class="q-mr-sm">✔️</span>
                  Lentelus Sports Ground:
                  <ul class="q-mt-xs" style="list-style: disc; padding-left: 1.5rem; margin-top: 0.25rem;">
                    <li>Historic home of Maties Football Club</li>
                  </ul>
                </li>
                <li><span class="q-mr-sm">✔️</span> Community tennis courts</li>
                <li><span class="q-mr-sm">✔️</span> Rugby fields</li>
                <li><span class="q-mr-sm">✔️</span> And running routes</li>
              </ul>
            </div>
          </div>

          <div class="text-body2 text-center q-mt-lg">
            At The-WEB, you don't just live near campus — you live at the heart of a lifestyle.
            <br>Mountains. Markets. Matches. Moments. It's all right here.
          </div>
        </q-card-section>
      </q-card>

    </div>
    <div style="height: 120px; background-color: white;"></div>



    <!-- A New Landmark with Deep Roots -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <q-parallax :src="parallax2" :speed="1" :height="$q.screen.gt.sm ? 700 : 1200"
      :style="`height: ${$q.screen.gt.sm ? 700 : 1200}px; background-position: center 30% !important; background-size: cover !important;`">
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(34, 34, 34, 0.6);
      " class="text-white text-center column justify-center items-center">
        <q-card-section class="constrain q-px-lg" style="max-width: 1024px">
          <div class="text-h4">A New Landmark with Deep Roots</div>
          <br><br>
          <div class="text-body1">
            Idas Valley, granted in 1683 and recognized as a Grade I heritage site since 1976, is rich in history — from
            French Huguenot pioneers and Cape Dutch architecture to the original homesteads of Samuel Johannes Cats.
            Surrounded by historic werf complexes like Rustenburg and Ida Minor, the valley preserves its charm while
            embracing a vibrant, close-knit community shaped by local culture, schools, artisans, and the natural
            landscape.
          </div>
          <br><br>
          <div class="text-h4">A Life Surrounded by Heritage & Nature</div>
          <br><br>
          <div class="text-body1">
            Wake up to mountain vistas and the valley's legacy of Cape Dutch architecture <br>
            Take breaks exploring local hiking, e‑bike, and trail routes in the Idas Valley Nature Area <br>
            Connect with a dynamic community deeply rooted in culture, craftsmanship, and heritage
          </div>
        </q-card-section>
      </div>
    </q-parallax>



    <!-- Why Choose The WEB? -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <div style="height: 120px; background-color: white;"></div>
    <div class="row justify-around" style="height: 100%;">
      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-4 col-12
        " style="max-width: 600px; width: 100%;">
        <q-card-section class="fade-in-scale">
          <div class="text-body1">
            <b>⸻&nbsp;&nbsp;&nbsp;REDEFINE STUDENT LIVING&nbsp;&nbsp;&nbsp;⸻</b>
          </div>
          <br>
          <div class="text-h3">Why Choose The-WEB?</div>
          <br>
          <div class="text-body1 q-mb-lg">
            At The-WEB, you don't just live near campus — you live at the heart of a lifestyle.
            <br>Mountains. Markets. Matches. Moments. It's all right here.
          </div>
          <ul class="q-mb-lg custom-list">
            <li><span class="q-mr-sm">✔️</span> Purpose-built for students</li>
            <li><span class="q-mr-sm">✔️</span> Architectural edge with Modern minimalist inspiration</li>
            <li><span class="q-mr-sm">✔️</span> Secure, modern, connected</li>
            <li><span class="q-mr-sm">✔️</span> Community-driven living</li>
            <li><span class="q-mr-sm">✔️</span> Affordable luxury</li>
          </ul>
          <div class="text-body2">
            Whether you're first-year or finishing your thesis, The-WEB adapts to your <br>academic rhythm and personal
            style.
          </div>
        </q-card-section>
      </q-card>
      <div class="col-md-7 col-12 row justify-center slide-in-right">
        <q-img src="~src/assets/resources/home/slider/4.jpg" class="side-image" />
      </div>
    </div>
    <div style="height: 120px; background-color: white;"></div>



    <!-- FAQs Banner -->
    <!-- ----------------------------------------------------------------------------------------------------------------------------------------------- -->
    <div style="height: 100%;">
      <div flat class="
        bg-black
        text-white
        row justify-between
        q-pa-xl
        ">
        <q-card-section class="text-h4">Need more answers? Read our FAQs</q-card-section>
        <q-card-section class="text-h4">
          <CustomButton customStyle="width: 180px" color="black" text-color="white" label="Read FAQS"
            to="/frequently-asked-questions" style="border: 2px solid white;" />
        </q-card-section>
      </div>
    </div>



    <!-- Attraction Slide -->
    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <div id="images-section" style="margin-top: 0;" :style="$q.screen.gt.sm ? 'padding: 10em' : 'padding: 0'">
      <q-carousel animated v-model="currentSlide2" infinite autoplay :autoplay-interval="5000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
        :height="$q.screen.lt.sm ? 'auto' : '100vh'" arrows control-color="white" class="fullscreen-carousel">
        <q-carousel-slide v-for="card in advertCards" :key="card._id" :name="card._id"
          class="column no-wrap flex-center">
          <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image" fit="cover" />
        </q-carousel-slide>
      </q-carousel>
    </div>



    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- contact card -->
    <div style="height: 60px; background-color: #333;"></div>
    <div id="contact-section" style="height: 100%; background-color: #333;" class="q-pa-xl">

      <q-card flat class="bg-transparent text-white row justify-center constrain">

        <q-card-section class="col-md-6 col-12">
          <div class="text-h4 q-mb-md">Discuss with Our Team</div>

          <!-- <div class="text-body2 q-mb-md">Founder and Managing Director</div> -->
          <!-- <div class="text-body1 q-mb-md"><b>Wayne Louw</b></div> -->

          <div class="column">
            <a href="mailto:admin@the-web.co.za" class="q-mb-md" style="text-decoration: none; color: white;">
              <q-icon name="eva-email-outline" class="q-mr-sm" /> admin@the-web.co.za
            </a>

            <!-- <a href="tel:+27823433945" target="_blank" class="q-mb-md"
              style="color: white; text-decoration: none; ">
              <q-icon name="eva-phone-outline" class="q-mr-sm" /> (+27) 82-343-3945
            </a> -->
            <!-- <a href="https://api.whatsapp.com/send/?phone=27823433945&text&type=phone_number&app_absent=0"
              target="_blank" style="text-decoration: underline; color: white;">
              <q-icon name="eva-message-circle-outline" class="q-mr-sm" /> Send WhatsApp
            </a> -->
          </div>
        </q-card-section>

        <q-card-section class="col-md-6 col-12 bg-transparent">
          <div class="text-h4 q-mb-md">Contact Us</div>

          <div class="">
            <q-form @submit="submitContactForm" style="width: 100%;">
              <q-input filled label-color=white color="brown" v-model="userContact.firstName" label="Your Name"
                stack-label class="q-mb-md " required style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="userContact.email" label="Your Email" stack-label
                class="q-mb-md" required style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="message" label="Message" type="textarea"
                stack-label class="q-mb-md" required style="border: 1px solid white;" input-style="color: white;" />
              <div class="row justify-between flex-center">
                <label>
                  <input type="checkbox" name="privacyPolicy" value="agree" required class="q-mr-sm">
                  By submitting your data, you agree to our <span class="text-white">privacy policy</span>
                </label>
                <CustomButton v-if="$q.screen.gt.sm" type="submit" label="Send Message" color="white" text-color="black"
                  customStyle="width: 30%" />
                <CustomButton v-else type="submit" label="Send Message" class="q-mt-md" color="white" text-color="black"
                  customStyle="width: 100%" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>

      <br><br>
      <!-- <q-card flat class="bg-transparent text-white row justify-center">
          <l-map :zoom="18" :center="[-33.925453, 18.879200]" style="height: 700px; width: 100%;">
            <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <l-marker :lat-lng="[-33.924853, 18.881097]">
              <l-popup>The-WEB</l-popup>
            </l-marker>

            <l-marker :lat-lng="[-33.926453, 18.877530]">
              <l-popup>Steers</l-popup>
            </l-marker>

            <l-marker :lat-lng="[-33.926093, 18.878540]">
              <l-popup>Superspar</l-popup>
            </l-marker>
          </l-map>
      </q-card> -->
      <!-- <div class="map-container">
        <q-img src="~src/assets/resources/home/map/version1.png" />
        <div class="map-marker" style="top: 40%; left: 60%;">
          <q-icon name="place" color="red" size="md" />
        </div>
      </div> -->
    </div>
    <!-- <div style="height: 60px; background-color: #333;"></div> -->
    <CustomButton customStyle="width: 180px" label="Secure your spot" @click="openUnitDash"
      style="position: fixed; bottom: 20px; left: 20px; z-index: 1000" />
  </q-page>
</template>

<script>
import ImageDialog from 'src/components/elements/ImageDialog.vue';
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from '@vue-leaflet/vue-leaflet';

import g21 from 'src/assets/resources/home/gallery/g21.jpg';
import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/EmailService';
import Helper from 'src/services/utils';
import UnitCardComponent from 'src/components/user/UnitCardComponent.vue';
import UnitCardComponentBlack from 'src/components/user/UnitCardComponentBlack.vue';

import am0 from 'src/assets/resources/home/amenities/am0.jpg';
import am1 from 'src/assets/resources/home/amenities/am1.jpeg';
import am2 from 'src/assets/resources/home/amenities/am2.jpeg';

import a1 from 'src/assets/resources/home/advert/a1.png';
import a2 from 'src/assets/resources/home/advert/a2.png';
import a3 from 'src/assets/resources/home/advert/a3.png';
import a4 from 'src/assets/resources/home/advert/a4.png';
import a5 from 'src/assets/resources/home/advert/a5.png';

import l1 from 'src/assets/resources/home/location/location1.jpg'
import l2 from 'src/assets/resources/home/location/location2.jpg'
import l3 from 'src/assets/resources/home/location/location3.jpg'
import l4 from 'src/assets/resources/home/location/location4.jpg'
import l5 from 'src/assets/resources/home/location/location5.jpg'
import l6 from 'src/assets/resources/home/location/location6.jpg'
import l7 from 'src/assets/resources/home/location/location7.jpg'

import home1 from 'src/assets/resources/home/slider/1.jpg';
import home2 from 'src/assets/resources/home/slider/2.jpg';
import home3 from 'src/assets/resources/home/slider/3.jpg';
import home4 from 'src/assets/resources/home/slider/4.jpg';

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
      meta: {
        description: {
          name: 'description',
          content: 'Modern student accommodation in Stellenbosch with resort-style amenities, 24/7 security, high-speed Wi-Fi, and academic-focused living spaces. Apply now for 2026.'
        },
        keywords: {
          name: 'keywords',
          content: 'student housing Stellenbosch, student accommodation, The Web residences, university housing, secure student living'
        },
        ogTitle: {
          property: 'og:title',
          content: 'The Web | Luxury Student Housing in Stellenbosch'
        },
        ogDescription: {
          property: 'og:description',
          content: 'Stellenbosch\'s premier student residence featuring study lounges, resort-style pool, social courtyards, and 24/7 security. Applications open for 2026.'
        },
        ogUrl: {
          property: 'og:url',
          content: 'https://the-web.co.za' + window.location.pathname
        },
        ogImage: {
          property: 'og:image',
          content: 'https://the-web.co.za/assets/outside3.jpg'
        },
        ogType: {
          property: 'og:type',
          content: 'website'
        },
        twitterCard: {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        twitterTitle: {
          name: 'twitter:title',
          content: 'The Web | Premium Student Housing in Stellenbosch'
        },
        twitterDescription: {
          name: 'twitter:description',
          content: 'Luxury student accommodation with academic facilities, social spaces, and premium amenities. Secure your spot for 2026.'
        }
      },
      link: {
        canonical: 'https://the-web.co.za' + window.location.pathname
      }
    });
  },

  data() {
    return {
      parallax: home2,
      parallax2: home3,
      currentSlide: 1,
      currentSlide2: 1,
      currentSlide3: 1,
      currentSlide4: 1,

      showImageDialog: false,
      currentDialogImageUrl: '',

      heroCards: [
        { _id: 1, imageUrl: home1 },
        { _id: 2, imageUrl: home2 },
        { _id: 3, imageUrl: home3 },
        { _id: 4, imageUrl: home4 },
      ],
      advertCards: [
        { _id: 1, imageUrl: a1 },
        { _id: 2, imageUrl: a2 },
        { _id: 3, imageUrl: a3 },
        { _id: 4, imageUrl: a4 },
        { _id: 5, imageUrl: a5 },
      ],
      locationCards: [
        { _id: 1, imageUrl: l1 },
        { _id: 2, imageUrl: l2 },
        { _id: 3, imageUrl: l3 },
        { _id: 4, imageUrl: l4 },
        { _id: 5, imageUrl: l5 },
        { _id: 6, imageUrl: l6 },
        { _id: 7, imageUrl: l7 },
      ],
      amenitiesCards: [
        { _id: 1, imageUrl: am0 },
        { _id: 2, imageUrl: am1 },
        { _id: 3, imageUrl: am2 },
      ],

      userContact: {
        firstName: '',
        email: '',
      },
      message: ''
    };
  },

  methods: {
    getImageUrl: Helper.getImageUrl,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

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

    async submitContactForm() {
      const checkbox = document.querySelector('input[name="privacyPolicy"]');
      if (!checkbox.checked) {
        this.$q.notify({ type: 'negative', message: 'You must agree to the privacy policy before submitting.' });
        return;
      }

      try {
        const response = await EmailService.GetInContact(this.userContact, this.message);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Message sent successfully!' });
          this.userContact.firstName = '';
          this.userContact.email = '';
          this.message = '';
        } else {
          this.$q.notify({ type: 'negative', message: 'Error sending message.' });
        }
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error sending message.' });
      }
    }
  },

  mounted() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-once')
          // Force hardware acceleration for mobile
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
  }
};
</script>

<style lang="sass">
.map-container
  position: relative
  width: 100%
  height: auto

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

    // &::before
    //   content: ""
    //   position: absolute
    //   top: 50%
    //   left: 0
    //   transform: translate(-100%, -50%)
    //   border-width: 8px
    //   border-style: solid
    //   border-color: transparent rgba(0, 0, 0, 0.9) transparent transparent
    //   width: 0
    //   height: 0

  &:hover::after
    opacity: 1

.marker-1
  @extend %marker-base
  top: 15%
  left: 64%
  width: 60px
  height: 43px
  padding: 3px
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
  top: 30%
  left: 58%
  width: 40px
  height: 40px
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

@media (max-width: 600px)
  .marker-1, .marker-2, .marker-3, .marker-4, .marker-5, .marker-6, .marker-7
    width: 40px !important
    height: 40px !important

    &::after
      font-size: 12px
      min-width: 45px
      padding: 4px 8px
      top: -40px









.parallax-adjusted .q-parallax__image
  object-fit: cover
  object-position: center 30%

.dark-wrapper
  background-color: #121212
  height: 100%

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
body
  overflow-x: hidden


.slide-in-left
  opacity: 0
  transform: translateX(-500px)

  &.animate-once
    animation: slide-left 0.8s ease-out forwards

.slide-in-right
  opacity: 0
  transform: translateX(500px)

  &.animate-once
    animation: slide-right 0.8s ease-out forwards

@keyframes slide-left
  to
    transform: translateX(0)
    opacity: 1

@keyframes slide-right
  to
    transform: translateX(0)
    opacity: 1

.text-h3
  font-size: 3rem

  @media (max-width: 767px)
    font-size: 2rem







// FIX THIS
// @media (max-width: 600px)
//   .slide-in-left,
//   .slide-in-right
//     transform: translateX(0) !important
//     opacity: 1 !important
//     animation: none !important

//   .side-image
//     height: auto
//     min-height: 300px
//     max-height: 400px

//   .hero-image
//     height: 50vh !important
//     min-height: 300px


// .slide-in-left
//   transform: translateX(-500px)
//   animation: slide-left linear forwards
//   animation-timeline: view()
//   animation-range: 150px 600px

// @keyframes slide-left
//   from
//     transform: translateX(-500px)
//   to
//     transform: translateX(0)
//     opacity: 1

// .slide-in-right
//   transform: translateX(500px)
//   animation: slide-right linear forwards
//   animation-timeline: view()
//   animation-range: 150px 600px

// @keyframes slide-right
//   from
//     transform: translateX(500px)
//   to
//     transform: translateX(0)
//     opacity: 1

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

.hero-image
  width: 100%
  height: 100vh
  object-fit: cover
  @media (max-width: 600px)
    height: 340px

.fullscreen-carousel
  margin: 0 !important
  padding: 0 !important

.q-carousel__slide
  padding: 0 !important

.q-carousel__navigation-inner
  padding-bottom: 20px

.q-carousel__arrow
  color: white
  font-size: 2rem

.side-image
  object-fit: cover
  width: 100%
  height: 100%


// lists
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
