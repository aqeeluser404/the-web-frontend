<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <!-- Left Side - Unit Details -->
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section>
          <div class="text-h6">Unit {{ unit.unitNumber }}</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="image-container">
            <q-img v-if="unit.images && unit.images.length > 0"
              :src="getImageUrl(unit.images[currentImageIndex].imageUrl)" class="product-image cursor-zoom-in"
              @click="showImageDialog = true" />
            <q-btn round flat dense class="nav-button left" icon="chevron_left" @click="prevImage" />
            <q-btn round flat dense class="nav-button right" icon="chevron_right" @click="nextImage" />
          </div>
        </q-card-section>

        <q-dialog v-model="showImageDialog" maximized>
          <q-card flat borderless class="image-dialog-card">
            <div class="row">
              <q-btn icon="close" flat round v-close-popup class="close-button" />
            </div>
            <q-card-section class="dialog-image-section row justify-center flex-center">
              <img v-if="currentDialogImageUrl" :src="currentDialogImageUrl" class="enlarged-image"
                style="object-fit: contain" />
              <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage" />
              <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage" />
            </q-card-section>
          </q-card>
        </q-dialog>

        <q-card-section>
          <div class="text-h6 q-mb-sm">Unit Specifications</div>
          <q-separator class="q-mb-md" />

          <div class="specs-grid q-gutter-y-sm">

            <!-- Room Type -->
            <div class="row items-center justify-between">
              <div class="col-4 text-grey-7">
                <b>{{ getSubUnitType(unit.subUnits) === 'strand' ? 'Bed Type:' : 'Room Type:' }}</b>
              </div>
              <div class="col-7">
                <template v-if="getSubUnitType(unit.subUnits) === 'strand'">
                  <q-select v-if="filteredSubUnits.length" v-model="selectedOption" :options="selectOptions"
                    option-label="label" class="text-caption" dense filled :label="selectLabel" />
                </template>
                <template v-else-if="getSubUnitType(unit.subUnits) === 'pinnacle'">
                  <q-select v-if="filteredSubUnits.length" v-model="selectedOption" :options="selectOptions"
                    option-label="label" class="text-caption" dense filled :label="selectLabel" />
                </template>
                <template v-else-if="getSubUnitType(unit.subUnits) === 'mixed'">
                  <q-select v-if="filteredSubUnits.length" v-model="selectedOption" :options="selectOptions"
                    option-label="label" class="text-caption" dense filled :label="selectLabel" />
                </template>
              </div>
            </div>

            <!-- Unit Number -->
            <div class="row items-center justify-between">
              <div class="col-4 text-grey-7"><b>Number:</b></div>
              <div class="col-7">{{ unit.unitNumber }}</div>
            </div>

            <!-- Payment Plan -->
            <div v-if="selectedOption && selectedOption.price && selectedOption.price.length > 1"
              class="row items-center justify-between">
              <div class="col-4 text-grey-7"><b>Payment Plan:</b></div>
              <div class="col-7">
                <q-select v-model="selectedPrice" :options="priceOptions" dense filled label="Select Payment Plan"
                  option-value="value" option-label="label" emit-value map-options>
                  <template v-slot:option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.label }}</q-item-label>
                        <q-item-label caption>{{ scope.opt.description }}</q-item-label>
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
            </div>

            <!-- Status -->
            <div class="row items-center justify-between">
              <div class="col-4 text-grey-7"><b>Status:</b></div>
              <div class="col-7">
                <q-badge :color="unit.unitStatus === 'Available' ? 'positive' : 'negative'" :label="unit.unitStatus"
                  class="text-capitalize q-px-sm q-py-xs" />
              </div>
            </div>

            <!-- Next Available -->
            <div v-if="nextAvailabilityDate" class="row items-center">
              <div class="col-4 text-grey-7"><b>Next Available:</b></div>
              <div class="col-8">{{ formatDate(nextAvailabilityDate) }}</div>
            </div>

            <!-- Occupancy -->
            <div class="row items-center justify-between">
              <div class="col-4 text-grey-7"><b>Occupancy:</b></div>
              <div class="col-7">
                <!-- Access Key Based Assignment -->
                <q-badge v-if="unit.accessKey?.isShared" label="Access Key" size="sm" color="orange" text-color="white"
                  class="q-px-sm q-py-xs" />
                <!-- Gender Based Assignment -->
                <q-badge v-else-if="unit.genderAssignment === 'Male'" label="Assigned to Males" size="sm" color="blue"
                  text-color="white" class="q-px-sm q-py-xs" />
                <q-badge v-else-if="unit.genderAssignment === 'Female'" label="Assigned to Females" size="sm"
                  color="pink" text-color="white" class="q-px-sm q-py-xs" />
                <!-- Fallback -->
                <span v-else class="text-grey">Unassigned</span>
              </div>

            </div>

            <!-- Availability -->
            <template v-if="unit.unitStatus !== 'Occupied'">
              <div class="row items-center justify-between">
                <div class="col-4 text-grey-7"><b>Availability:</b></div>
                <div class="col-7">
                  {{ unit.unitOccupants - unit.currentOccupants }} of {{ unit.unitOccupants }} spots
                </div>
              </div>
            </template>
          </div>
        </q-card-section>

        <!-- Price Section Per Month -->
        <q-card-section>
          <q-separator class="q-mb-sm" />
          <div>
            <div v-if="selectedOption && selectedOption.price && selectedOption.price.length > 1">
              <div class="text-h6 text-primary q-mb-sm">
                R {{ Number(currentPrice).toFixed(2) }} / month
              </div>
              <div class="text-caption1 text-grey">
                {{ getPricePlanDescription(selectedPrice) }}
              </div>
            </div>
            <div v-else>
              <div class="text-h6 text-primary q-mb-sm">
                R {{ Number(currentPrice).toFixed(2) }} / month
              </div>
              <div class="text-caption1 text-grey">Starting from R {{ Number(currentPrice).toFixed(2) }} per month.
                <br>Select
                your preferred unit configuration and payment plan to begin.
              </div>
            </div>
          </div>
        </q-card-section>

        <!-- description -->
        <q-card-section>
          <q-separator class="q-mb-sm" />
          <div class="text-h6 q-mb-sm">Description</div>

          <div class="text-caption1 text-grey">
            {{ unit.unitDescription }}
          </div>
        </q-card-section>
      </div>

      <!-- Right Side - Application Form -->
      <div class="col-md-6 col-12 q-pa-md">
        <div v-if="!loading">

          <!-- RENTAL FORM -->
          <!-- ===================================================================================================== -->
          <template v-if="isLoggedIn && !hasOngoingRentals">
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
            </q-card-section>
            <template v-if="unit.unitStatus !== 'Occupied'">
              <q-card-section>
                <div class="q-mb-sm"><b>Confirm your information</b></div>
                <ul>
                  <li>First Name: {{ userDetails.firstName }}</li>
                  <li>Last Name: {{ userDetails.lastName }}</li>
                  <li>Phone Number: {{ userDetails.phone }}</li>
                  <li>Email Address: {{ userDetails.email }}</li>
                </ul>
              </q-card-section>

              <q-card-section v-if="isAccessKeyAllowed && !unit.accessKey.isShared && !unit.genderAssignment">
                <div class="q-mb-sm"><b>Generate Shared Access Key</b></div>
                <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="true" label="Yes" />
                <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="false" label="No" />
              </q-card-section>

              <q-card-section v-if="unit.accessKey.isShared">
                <div class="q-mb-sm"><b>Provide Shared Access Key</b></div>
                <q-input v-model="rentalDetails.accessKey" @input="setAccessKeyTrue" label="Enter access key" required
                  outlined />
              </q-card-section>

              <q-card-section>
                <div class="q-mb-sm"><b>Would you like to add parking?</b></div>
                <q-radio v-model="rentalDetails.parking.hasParking" :val="true"
                  :label="`Include Parking (R ${rentalDetails.parking.fee.toFixed(2)} / mo)`" />
                <br>
                <q-radio v-model="rentalDetails.parking.hasParking" :val="false" label="No parking needed" />
              </q-card-section>

              <!-- <q-card-section>
                <div class="q-mb-sm"><b>Lease Dates</b></div>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-input v-model="rentalDetails.rentalStartDate" label="Start Date" type="date" :min="minDate"
                      outlined />
                  </div>
                  <div class="col-6">
                    <q-input v-model="rentalDetails.rentalEndDate" label="End Date" type="date"
                      :min="rentalDetails.rentalStartDate || minDate" outlined />
                  </div>
                </div>
              </q-card-section> -->

              <q-card-section>
                <div class="q-mb-sm"><b>Lease Period</b></div>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-field label="Start Date" borderless stack-label>
                      <template v-slot:control>
                        <div class="text-primary">
                          {{ formatDate(rentalDetails.rentalStartDate) }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                  <div class="col-6">
                    <q-field label="End Date" borderless stack-label>
                      <template v-slot:control>
                        <div class="text-primary">
                          {{ formatDate(rentalDetails.rentalEndDate) }}
                        </div>
                      </template>
                    </q-field>
                  </div>
                </div>
                <div class="text-caption text-grey-7 ">
                  Lease dates are provisional and will be updated during the application processing.
                </div>
              </q-card-section>

              <!-- <q-card-section>
                <div class="q-mb-sm"><b>Digital Signature</b></div>
                <SignaturePad @save="handleSignatureSave" />
              </q-card-section>

              <q-card-section v-if="userDetails.age < 21">
                <div class="q-mb-sm"><b>Guardian Signature</b></div>
                <SignaturePad @save="handleGuardianSignatureSave" />
              </q-card-section> -->

              <q-card-section>
                <div class="q-mb-md"><b>Verification Status</b></div>
                <div class="row cursor-pointer" @click="goToUserProfile">
                  <q-icon :name="userDetails.verification?.isVerified ? 'check_circle' : 'error'"
                    :color="userDetails.verification?.isVerified ? 'positive' : 'negative'" size="20px" />
                  <span class="q-ml-sm">Email {{ userDetails.verification?.isVerified ? 'verified' : 'not verified'
                    }}</span>
                </div>
                <div class="column cursor-pointer" @click="goToUserProfile">
                  <div class="row">
                    <q-icon :name="hasAllRequiredDocuments ? 'check_circle' : 'error'"
                      :color="hasAllRequiredDocuments ? 'positive' : 'negative'" size="20px" />
                    <span class="q-ml-sm">
                      Documents {{ hasAllRequiredDocuments ? 'complete' : 'incomplete' }}
                    </span>
                  </div>
                  <div v-if="!hasAllRequiredDocuments" class="text-negative q-ml-lg">
                    You may still apply, but please upload your documents as soon as possible for smooth processing.
                  </div>
                  <div v-if="!hasAllRequiredDocuments" class="q-mb-md"></div>
                </div>

                <!-- Age Verification -->
                <div class="row cursor-pointer" @click="goToUserProfile">
                  <q-icon :name="userDetails.dateOfBirth ? 'check_circle' : 'error'"
                    :color="userDetails.dateOfBirth ? 'positive' : 'negative'" size="20px" />
                  <span class="q-ml-sm">Age {{ userDetails.dateOfBirth ? 'verified' : 'not verified' }}</span>
                </div>
              </q-card-section>

              <!-- ACCESS KEY -->
              <q-card-section v-if="rentalDetails.accessKeyIsTrue || unit.accessKey?.isShared" class="q-pt-none">
                <q-banner dense class="bg-warning q-pa-md text-black q-mb-md text-center row items-center">
                  <span>
                    You have <b>12 hours</b> to share the access key and complete the group application for this unit.
                    After this period, the unit will be reopened for general applications, restricted to the gender of
                    the user who
                    originally generated the access key.
                    <br>
                    If multiple applications exist at the time of expiry, all applicants will be required to reapply due
                    to potential
                    gender mismatches.
                  </span>
                </q-banner>
              </q-card-section>

              <q-card-section class="row justify-between q-pt-none">
                <CustomButton :disable="!canSubmit" label="Submit Application" color="primary"
                  @click="createRentalApplication(unit)" customStyle="width: 48%" />
              </q-card-section>
            </template>

            <template v-else>
              <q-card-section>
                <div class="text-h6 text-negative">This unit is currently occupied</div>
                <q-separator class="q-mb-sm" />
                <div>Please check back later or explore other available units.</div>
              </q-card-section>
              <q-card-section class="row justify-end">
                <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')"
                  customStyle="width: 48%" />
              </q-card-section>
            </template>
          </template>

          <!-- RENTAL IN PROGRESS -->
          <!-- ===================================================================================================== -->
          <template v-else-if="isLoggedIn && hasOngoingRentals">
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
            </q-card-section>
            <q-card-section class="login-splash column justify-center items-center q-pa-md" style="height: 100%;">
              <div class="text-h6 q-mb-md">
                <span v-if="hasActiveRental">Active Rental</span>
                <span v-else>Rental Application in Progress</span>
              </div>
              <q-icon :name="hasActiveRental ? 'home' : 'schedule'" size="md" color="primary" />
              <p class="q-mb-lg text-center">
                <span v-if="hasActiveRental">
                  You currently have an active rental. <br>
                  You can manage your unit or view your lease details from your dashboard.
                </span>
                <span v-else>
                  Your current rental application is being processed. <br>
                  You’ll be notified once it’s complete.
                </span>
              </p>
              <CustomButton label="Upload Documents" to="/user/profile" customStyle="width: 48%" />
              <br>
              <CustomButton label="Proceed to Applications" to="/user/applications" customStyle="width: 48%" />
            </q-card-section>
            <q-card-section class="row justify-center">
            </q-card-section>
          </template>

          <!-- LOGIN -->
          <!-- ===================================================================================================== -->
          <template v-else>
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
            </q-card-section>
            <q-card-section class="login-splash column justify-center items-center q-pa-md" style="height: 100%;">
              <div class="text-h6 q-mb-md">🔒 Secure Your Spot</div>
              <p class="q-mb-lg">Please login to access the application form</p>

              <div class="row justify-center q-gutter-md">
                <CustomButton label="Login to Apply" color="primary" @click="redirectToLogin"
                  customStyle="width: 200px" />
              </div>

              <div class="q-mt-md  text-caption text-grey">
                Don't have an account?
                <a href="#" @click.prevent="redirectToRegister" class="text-primary q-ml-md">Register here</a>
              </div>
            </q-card-section>
          </template>
        </div>
        <q-inner-loading :showing="loading" color="primary" size="md" />
      </div>
    </div>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import RentalService from 'src/services/RentalService'
import SignaturePad from '../elements/SignaturePad.vue'

export default {
  name: 'CombinedUnitApplication',
  props: {
    unit: {
      type: Object,
      required: true
    }
  },
  data() {
    const today = new Date();
    const nextYear = today.getFullYear() + 1;
    return {
      loading: true,
      isLoggedIn: false,
      currentImageIndex: 0,
      userDetails: {},
      rentalDetails: {
        user: "",
        unit: "",
        rentalStartDate: `${nextYear}-01-01`,
        rentalEndDate: `${nextYear}-12-31`,
        accessKeyIsTrue: null,
        accessKey: '',
        parking: {
          hasParking: false,
          fee: 400.0
        }
      },
      myRentals: [],
      signatureData: null,
      nextAvailabilityDate: null,
      minDate: new Date().toISOString().split('T')[0],
      showImageDialog: false,

      selectedPriceIndex: null,
      selectedPrice: null,
      selectedOption: null,

      guardianSignatureData: null,
    }
  },
  components: {
    CustomButton,
    SignaturePad
  },
  computed: {
    hasAllRequiredDocuments() {
      const requiredTypes = [
        'registration',
        'proof_of_address',
        'id_or_passport',
        'bank_statements',
        'credit_check'
      ];

      const uploadedTypes = this.userDetails.documents?.map(doc => doc.docType) || [];

      return requiredTypes.every(type => uploadedTypes.includes(type));
    },
    isAccessKeyAllowed() {
      const allowedUnits = [
        '1-04', '1-05', '1-06', '1-07',
        '2-04', '2-05', '2-06', '2-07',
        '3-04', '3-05', '3-06', '3-07'
      ]
      return allowedUnits.includes(this.unit.unitNumber)
    },
    hasOngoingRentals() {
      return this.myRentals.length > 0
    },
    hasActiveRental() {
      return this.myRentals?.status === 'active';
    },
    currentDialogImageUrl() {
      if (!this.unit.images || !this.unit.images.length) return null
      const image = this.unit.images[this.currentImageIndex]
      if (!image || !image.imageUrl) return null
      return this.getImageUrl(image.imageUrl)
    },
    canSubmit() {
      return this.userDetails.verification?.isVerified &&
        (
          this.userDetails?.username === 'testuser' ||
          this.userDetails?.username === 'WayneL' ||
          this.userDetails?.username === 'yusri' ||
          this.userDetails?.username === 'admin'
        ) &&
        this.userDetails?.age &&
        // this.userDetails.documents?.length === 3 &&
        this.rentalDetails.rentalStartDate &&
        this.rentalDetails.rentalEndDate
      // this.signatureData
    },


    // subunit computed code
    // ----------------------------------------------------------------------------------------------------------

    filteredSubUnits() {
      if (!this.unit?.subUnits) return [];
      return this.unit.subUnits.filter(su => {
        const matchesRoom = this.selectedRoomType
          ? su.roomType?.includes(this.selectedRoomType)
          : true;
        const matchesBed = this.selectedBedType
          ? su.bedType === this.selectedBedType
          : true;
        return matchesRoom && matchesBed && su.isAvailable;
      });
    },
    selectOptions() {
      return this.filteredSubUnits.map(su => {
        const isRoom = su.type === 'room';
        const isBed = su.type === 'bed';

        let label = '';

        if (isRoom) {
          label = `${su.roomType}`;
        } else if (isBed) {
          label = `${su.bedType}`;
        } else {
          label = `${su.roomType ?? 'Room'} - ${su.bedType ?? 'Bed'}`;
        }

        return {
          ...su,
          label
        };
      });
    },
    selectLabel() {
      if (this.selectedRoomType && !this.selectedBedType) return "Choose your bed";
      if (this.selectedBedType && !this.selectedRoomType) return "Choose your room";
      return "Select Option";
    },

    priceOptions() {
      if (!this.selectedOption || !this.selectedOption.price) return [];

      const sortedPrices = [...this.selectedOption.price].sort((a, b) => a.price - b.price);

      return sortedPrices.map((priceObj, index) => {
        const paymentPlanSuffix = 'payment plan';

        return {
          value: priceObj.price,
          label: `R ${priceObj.price.toFixed(2)} / mo`,
          description: `${priceObj.name} ${paymentPlanSuffix}`,
          index,
        };
      });
    },

    currentPrice() {
      if (this.selectedPrice !== null) {
        return this.selectedPrice;
      }
      if (!this.selectedOption) return this.unit.unitPrice;
      if (this.selectedOption.price && this.selectedOption.price.length > 0) {
        return this.selectedOption.price[0].price;
      }
      return this.unit.unitPrice;
    },
  },

  watch: {
    selectedOption(newOption) {
      if (newOption && newOption.price && newOption.price.length > 0) {
        this.selectedPrice = newOption.price[0].price;
      }
    },
  },
  async created() {
    console.log(this.unit)
    await this.checkLoginStatus()
  },
  methods: {
    getImageUrl: Helper.getImageUrl, formatDate: Helper.formatDate,

    updateSelectedPrice() {
      if (this.selectedOption && this.selectedPriceIndex !== null) {

        const updatedOption = { ...this.selectedOption };

        updatedOption.selectedPrice = this.selectedOption.price[this.selectedPriceIndex];
        updatedOption.selectedPriceIndex = this.selectedPriceIndex;

        this.selectedOption = updatedOption;
      }
    },

    getPricePlanDescription(price) {
      const match = this.priceOptions.find(p => Number(p.value) === Number(price));
      return match?.description || '';
    },


    getSubUnitType(subUnits) {
      if (!Array.isArray(subUnits)) return null;

      const hasStrand = subUnits.some(su => su.bedType?.toLowerCase().includes('the strand'));
      const hasPinnacle = subUnits.some(su => su.roomType?.toLowerCase().includes('the pinnacle'));
      const hasCore = subUnits.some(su => su.roomType?.toLowerCase().includes('the core'));

      if (hasStrand) return 'strand';
      if (hasPinnacle && hasCore) return 'mixed';
      if (hasPinnacle) return 'pinnacle';
      if (hasCore) return 'core';

      return null;
    },

    // IMAGES AND FULLSCREEN
    // ------------------------------------------------------------------------------------------

    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length
    },

    redirectToLogin() {
      this.$router.push({
        path: '/auth/login',
        query: { redirect: this.$route.fullPath }
      })
    },

    redirectToRegister() {
      this.$router.push({
        path: '/auth/register',
        query: { redirect: this.$route.fullPath }
      })
    },

    async checkLoginStatus() {
      this.loading = true;
      this.isLoggedIn = await Helper.checkCookie();
      if (this.isLoggedIn) {
        await this.fetchUserDetails();
        const rentals = await RentalService.findMyRentals(this.userDetails._id);
        this.myRentals = rentals.filter(r => ['Pending', 'Active'].includes(r.status));
      }
      this.loading = false;
    },

    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
      this.nextAvailabilityDate = await this.nextAvailability()
    },

    setAccessKeyTrue() {
      this.rentalDetails.accessKeyIsTrue = true
    },

    handleSignatureSave(signature) {
      this.signatureData = signature
    },

    handleGuardianSignatureSave(signature) {
      this.guardianSignatureData = signature
    },


    base64ToFile(dataUrl, filename) {
      const arr = dataUrl.split(',')
      const mime = arr[0].match(/:(.*?);/)[1]
      const bstr = atob(arr[1])
      let n = bstr.length
      const u8arr = new Uint8Array(n)
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n)
      }
      return new File([u8arr], filename, { type: mime })
    },

    async createRentalApplication(unit) {

      // if (this.userDetails.age < 21 && !this.guardianSignatureData) {
      //   this.$q.notify({ type: 'negative', message: 'Guardian signature is required for applicants under 21' })
      //   return
      // }

      if (this.selectedOption.price && this.selectedOption.price.length > 1 &&
        this.selectedPrice === null) {
        this.$q.notify({ type: 'negative', message: 'Please select a price option' });
        return;
      }

      if (!this.selectedOption) {
        this.$q.notify({ type: 'negative', message: 'Please select your unit type!' })
        return
      }

      // Find the selected price object by matching price value
      const matchedPriceObj = this.selectedOption?.price?.find(p => p.price === this.selectedPrice) || null;

      const selectedSubUnitWithPrice = {
        ...this.selectedOption,
        price: matchedPriceObj || { name: 'default', price: this.selectedPrice !== null ? this.selectedPrice : (this.unit.unitPrice || 0) }
      };


      // Remove the separate selectedPrice field if it exists
      delete this.rentalDetails.selectedPrice;

      if (!this.selectedOption) {
        this.$q.notify({ type: 'negative', message: 'Please select your unit type!' })
        return
      }

      if (this.rentalDetails.accessKeyIsTrue && !this.isAccessKeyAllowed) {
        this.$q.notify({ type: 'negative', message: 'Access keys are not allowed for this unit' });
        return;
      }

      if (!this.rentalDetails.rentalStartDate || !this.rentalDetails.rentalEndDate) {
        this.$q.notify({ type: 'negative', message: 'Please specify start and end dates' })
        return
      }

      if (this.hasOngoingRentals) {
        this.$q.notify({ type: 'negative', message: 'You already have an active or pending application' })
        return
      }

      this.rentalDetails.user = this.userDetails._id
      this.rentalDetails.unit = unit._id

      if (!this.userDetails.gender) {
        this.$q.notify({ type: 'negative', message: 'Please specify your gender' })
        return
      }

      if (unit.genderAssignment && unit.genderAssignment !== this.userDetails.gender) {
        this.$q.notify({ type: 'negative', message: `This unit is for ${unit.genderAssignment}s only` })
        return
      }

      // if (unit.accessKey.isShared && this.rentalDetails.accessKey.toLowerCase() !== unit.accessKey.assignedKey) {
      //   this.$q.notify({ type: 'negative', message: 'Invalid access key' })
      //   return
      // }
      if (unit.accessKey.isShared) {
        // console.log('[DEBUG] Input Key:', this.rentalDetails.accessKey)
        // console.log('[DEBUG] Assigned Key:', unit.accessKey.assignedKey)

        const inputKey = this.rentalDetails.accessKey?.trim().toLowerCase()
        const assignedKey = unit.accessKey?.assignedKey?.trim().toLowerCase()

        // console.log('[DEBUG] Normalized Input:', inputKey)
        // console.log('[DEBUG] Normalized Assigned:', assignedKey)

        if (inputKey !== assignedKey) {
          this.$q.notify({ type: 'negative', message: 'Invalid access key' })
          return
        }
      }
      this.rentalDetails.selectedSubUnit = selectedSubUnitWithPrice;
      const formData = new FormData()
      for (const key in this.rentalDetails) {
        if (key !== 'signature') {
          const value = this.rentalDetails[key];

          if (key === 'selectedSubUnit' && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else if (key === 'parking' && typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, value);
          }
        }
      }

      // if (this.signatureData) {
      //   const signatureFile = this.base64ToFile(
      //     this.signatureData,
      //     `${this.userDetails.firstName}${this.userDetails.lastName}_Signature.png`
      //   )
      //   formData.append('signatureImage[]', signatureFile)
      // }

      // if (this.userDetails.age < 21 && this.guardianSignatureData) {
      //   const guardianFile = this.base64ToFile(
      //     this.guardianSignatureData,
      //     `${this.userDetails.firstName}${this.userDetails.lastName}_GuardianSignature.png`
      //   )
      //   formData.append('guardianSignatureImage[]', guardianFile)
      // }

      try {
        for (let pair of formData.entries()) {
          console.log(pair[0], pair[1])
        }
        const response = await RentalService.createRental(formData)
        // console.log(response)
        let message = 'Application submitted successfully'
        if (response.accessKey) {
          message += `. Your access key: ${response.accessKey}`
        }
        this.$q.notify({ type: 'positive', message })
        this.$router.push('/user/applications');
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.message || 'Application failed' })
      }
    },

    async nextAvailability() {
      if (this.unit.currentOccupants >= this.unit.unitOccupants) {
        const rentals = await RentalService.findAllRentals()
        const activeOrPendingRentals = rentals.filter(rental =>
          rental.unit === this.unit._id && ['Pending', 'Active'].includes(rental.status)
        )

        if (activeOrPendingRentals.length > 0) {
          const latestRental = activeOrPendingRentals.reduce((latest, rental) =>
            new Date(rental.rentalEndDate) > new Date(latest.rentalEndDate) ? rental : latest
          )
          return latestRental.rentalEndDate
        }
      }
      return null
    },

    goToUserProfile() {
      if (this.userDetails?._id) {
        this.$router.push('/user/profile');
      } else {
        this.$q.notify({ type: 'negative', message: 'User ID is missing' });
      }
    }
  }
}
</script>


<style lang="sass" scoped>

.room-type-badge
  padding: 4px 8px
  border-radius: 4px
  font-size: 0.9rem
  font-weight: 500

  &.strand
    background-color: #e3f2fd
    color: #0d47a1

  &.pinnacle
    background-color: #e8f5e9
    color: #2e7d32

  &.core
    background-color: #fff3e0
    color: #e65100

  &.mixed
    background-color: #f3e5f5
    color: #6a1b9a

.login-splash
  padding: 40px 20px
  display: flex
  flex-direction: column
  align-items: center
  justify-content: center
  min-height: 400px

.q-icon
  margin-bottom: 20px

p
  font-size: 1.1rem
  line-height: 1.5
  margin-bottom: 30px
  color: #555

.specs-grid
  display: grid
  grid-template-columns: 1fr
  gap: 8px

.description-text
  line-height: 1.6
  white-space: pre-wrap
  color: #555

@media (min-width: $breakpoint-sm-min)
  .specs-grid
    grid-template-columns: 1fr 1fr
    gap: 12px

.combined-unit-card
  width: 100%
  max-width: 1300px
  padding: 16px

.image-container
  position: relative
  width: 100%
  height: 430px
  overflow: hidden
  border-radius: 4px
  // background: #f5f5f5
  display: flex
  justify-content: center
  align-items: center

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0, 0, 0, 0.2)
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px

.cursor-zoom-in
  cursor: zoom-in

.image-dialog-card
  background: rgba(0, 0, 0, 0.9) !important

.dialog-image-section
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  position: relative

.enlarged-image
  max-width: 100%
  max-height: 100%
  width: auto
  height: auto

.close-button
  position: fixed
  right: 15px
  top: 10px
  z-index: 2
  background: transparent
  color: white

.dialog-nav
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: transparent
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px

.wrap-text
  white-space: pre-wrap

.available-unit
  color: $positive

.occupied-unit
  color: $negative

@media (max-width: $breakpoint-sm-max)
  .combined-unit-card
    flex-direction: column

.left-card
  display: flex
  flex-direction: column
  height: 100%
</style>
