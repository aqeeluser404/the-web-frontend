<template>
  <q-card class="combined-unit-card">
    <div class="row">

      <!-- Left Side - Unit Details -->
      <!-- ===================================================================================================== -->
      <div class="col-md-7 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Unit {{ unit.unitNumber }}</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="image-container">
            <q-img v-if="unit.images && unit.images.length > 0"
              :src="getImageUrl(unit.images[currentImageIndex].imageUrl)" class="product-image cursor-zoom-in"
              @click="showImageDialog = true" fit="contain" />
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
              <SimpleZoom v-if="currentDialogImageUrl">
                <img :src="currentDialogImageUrl" class="enlarged-image"
                  style="object-fit: contain; width: 100%; height: auto;" />
              </SimpleZoom>

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
            <div class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7">
                <b>{{unit.subUnits?.some(sub => sub.bedType) ? 'Bed Type:' : 'Room Type:'}}</b>
              </div>
              <div class="col-md-6 col-7">
                <q-select v-if="filteredSubUnits.length" v-model="selectedOption" :options="selectOptions"
                  option-label="label" class="text-caption" dense filled :label="selectLabel"
                  :menu-anchor="'bottom start'" :menu-self="'top start'" :menu-cover="false" fit />
              </div>
            </div>

            <!-- Unit Number -->
            <div class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7"><b>Number:</b></div>
              <div class="col-md-6 col-7">{{ unit.unitNumber }}</div>
            </div>

            <!-- Payment Plan -->
            <div v-if="selectedOption && selectedOption.price && selectedOption.price.length > 1"
              class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7"><b>Payment:</b></div>
              <div class="col-md-6 col-7">
                <q-select v-model="selectedPrice" :options="priceOptions" dense filled label="Select Payment Plan"
                  option-value="value" option-label="label" emit-value map-options :menu-anchor="'bottom start'"
                  :menu-self="'top start'" :menu-cover="false" fit>
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
            <div class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7"><b>Status:</b></div>
              <div class="col-md-6 col-7">
                <q-badge :color="unit.unitStatus === 'Available' ? 'positive' : 'negative'" :label="unit.unitStatus"
                  class="text-capitalize q-px-sm q-py-xs" />
              </div>
            </div>

            <!-- Next Available -->
            <div v-if="nextAvailabilityDate" class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7"><b>Next Available:</b></div>
              <div class="col-md-6 col-7">{{ formatDate(nextAvailabilityDate) }}</div>
            </div>

            <!-- Occupancy -->
            <div class="row items-center justify-around">
              <div class="col-md-4 col-5 text-grey-7"><b>Occupancy:</b></div>
              <div class="col-md-6 col-7">
                <!-- Access Key Based Assignment -->
                <q-badge v-if="unit.accessKey?.isShared" label="Access Key" size="sm" color="orange" text-color="white"
                  class="q-px-sm q-py-xs" />
                <!-- Gender Based Assignment -->
                <q-badge v-else-if="unit.genderAssignment === 'Male'" label="Assigned to Males" size="sm" color="blue"
                  text-color="white" class="q-px-sm q-py-xs" />
                <q-badge v-else-if="unit.genderAssignment === 'Female'" label="Assigned to Females" size="sm"
                  color="pink" text-color="white" class="q-px-sm q-py-xs" />
                <!-- Fallback -->
                <span v-else class="text-grey">Gender</span>
              </div>
            </div>

            <!-- Availability -->
            <template v-if="unit.unitStatus !== 'Occupied'">
              <div class="row items-center justify-around">
                <div class="col-md-4 col-5 text-grey-7"><b>Availability:</b></div>
                <div class="col-md-6 col-7">
                  {{ getAvailableSubUnits(unit) }}/{{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                    unit.unitOccupants || 0}}
                  Available
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
              <!-- <div v-if="selectedOption && selectedOption?.bedType">
                <div class="text-h6 text-primary q-mb-sm" v-if="getSelectedPriceObject()?.name === 'annual'">
                  R {{ Number(currentPrice).toFixed(2) }} / once off / bed
                </div>
                <div class="text-h6 text-primary q-mb-sm" v-else>
                  R {{ Number(currentPrice).toFixed(2) }} / month / bed
                </div>
              </div>

              <div v-if="selectedOption && selectedOption?.roomType">
                <div class="text-h6 text-primary q-mb-sm" v-if="getSelectedPriceObject()?.name === 'annual'">
                  R {{ Number(currentPrice).toFixed(2) }} / once off / room
                </div>
                <div class="text-h6 text-primary q-mb-sm" v-else>
                  R {{ Number(currentPrice).toFixed(2) }} / month / room
                </div>
              </div> -->

              <div v-if="selectedOption && selectedOption?.bedType">
                <div class="text-h6 text-primary q-mb-sm" v-if="getSelectedPriceObject()?.name === 'annual'">
                  R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;once-off
                </div>
                <div class="text-h6 text-primary q-mb-sm" v-else>
                  R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;per&nbsp;month
                </div>
              </div>

              <div v-if="selectedOption && selectedOption?.roomType">
                <div class="text-h6 text-primary q-mb-sm" v-if="getSelectedPriceObject()?.name === 'annual'">
                  R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;once-off
                </div>
                <div class="text-h6 text-primary q-mb-sm" v-else>
                  R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;per&nbsp;month
                </div>
              </div>


              <div class="text-caption1 text-grey">
                {{ capitalizeFirstLetter(getPricePlanDescription(selectedPrice)) }}
              </div>
            </div>
            <div v-else>
              <div class="text-h6 text-primary q-mb-sm">
                R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;per&nbsp;month
              </div>
              <div class="text-caption1 text-grey">Starting from R{{ Number(currentPrice).toLocaleString('en-ZA') }}&nbsp;per&nbsp;person&nbsp;per&nbsp;month.
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

      <!-- Right Side -->
      <!-- ===================================================================================================== -->
      <div class="col-md-5 col-12 q-pa-md">
        <div v-if="!loading">

          <!-- Application Form -->
          <template v-if="isLoggedIn && !hasOngoingRentals">
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
                class="large-screen-only" />
            </q-card-section>
            <template v-if="unit.unitStatus === 'Available'">
              <q-card-section>
                <div class="q-mb-sm"><b>Confirm your information</b></div>
                <ul>
                  <li>First Name: {{ userDetails.firstName }}</li>
                  <li>Last Name: {{ userDetails.lastName }}</li>
                  <li>Phone Number: {{ userDetails.phone }}</li>
                  <li>Email Address: {{ userDetails.email }}</li>
                </ul>
              </q-card-section>

              <!-- <q-card-section v-if="isAccessKeyAllowed && !unit.accessKey.isShared && !unit.genderAssignment">
                <div class="q-mb-sm"><b>Generate Shared Access Key</b></div>
                <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="true" label="Yes" />
                <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="false" label="No" />
              </q-card-section> -->

              <q-card-section v-if="unit.accessKey.isShared">
                <div class="q-mb-sm"><b>Provide Shared Access Key</b></div>
                <q-input v-model="rentalDetails.accessKey" @input="setAccessKeyTrue" label="Enter access key" required
                  outlined />
              </q-card-section>

              <q-card-section>
                <div class="q-mb-sm"><b>Would you like to add parking?</b></div>
                <q-radio
                  v-if="getSelectedPriceObject()?.name === 'annual'"
                  v-model="rentalDetails.parking.hasParking"
                  :val="true"
                  :label="`Include Parking (R${Number(rentalDetails.parking.fee).toLocaleString('en-ZA')} / once-off)`"
                />
                <q-radio v-else v-model="rentalDetails.parking.hasParking" :val="true"
                  :label="`Include Parking (R${Number(rentalDetails.parking.fee).toLocaleString('en-ZA')} / mo)`" />
                <br>
                <q-radio v-model="rentalDetails.parking.hasParking" :val="false" label="No parking needed" />
              </q-card-section>

              <q-card-section v-if="getSelectedPriceObject()?.name === 'annual'">
                <div class="q-mb-sm"><b>Discounted Price (Payment by 30 Nov)</b></div>
                <div>
                  <div class="text-grey-9">
                    <li>Upfront payment includes 11 months at discounted rate (4% off both rent and parking)</li>
                    <li>Payment must be made by 30 November to qualify for discount</li>
                    <li>Monthly payments are due on the 1st of each month</li>
                  </div>
                </div>
              </q-card-section>

              <q-card-section>
                <div class="q-mb-sm"><b>Lease Period</b></div>
                <div class="row q-col-gutter-md">
                  <div class="col-6">
                    <q-field label="Start Date" borderless stack-label>
                      <template v-slot:control>
                        <div class="text-primary">
                          {{ new Date(rentalDetails.rentalStartDate).toLocaleDateString('en-ZA', {
                            month: 'short', year:
                              'numeric'
                          }) }}
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
                <div class="text-grey-9">
                  Lease dates are provisional and will be updated during the application processing.
                </div>
              </q-card-section>

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
                    <!-- You may still apply, but please upload your documents as soon as possible for smooth processing. -->
                   Please upload your documents Before making your application.

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
          <template v-else-if="isLoggedIn && hasOngoingRentals">
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
                class="large-screen-only" />
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
          <template v-else>
            <q-card-section class="row justify-end items-center q-py-none q-py-xs">
              <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
                class="large-screen-only" />
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
import SimpleZoom from '../elements/SimpleZoom.vue'
import EmailService from 'src/services/EmailService'

export default {
  name: 'CombinedUnitApplication',
  props: {
    unit: {
      type: Object,
      required: true
    },
    subUnit: {
      type: String,
      required: false,
      default: null
    }
  },
  data() {
    const today = new Date();
    const month = today.getMonth();
    let year = today.getFullYear();
    if (month >= 10) {
      year = year + 1;
    }
    return {
      pinchZoomInstance: null,

      loading: true,
      isLoggedIn: false,
      currentImageIndex: 0,
      userDetails: {},
      rentalDetails: {
        user: "",
        unit: "",
        rentalStartDate: `${year}-02-01`,
        rentalEndDate: `${year}-12-15`,
        accessKeyIsTrue: false,
        accessKey: '',
        parking: {
          hasParking: false,
          fee: 495.0
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

      selectedRoomType: null,
      selectedBedType: null,

      guardianSignatureData: null,
    }
  },
  components: {
    CustomButton,
    SignaturePad,
    SimpleZoom
  },
  computed: {
    // hasAllRequiredDocuments() {
    //   const requiredTypes = [
    //     'registration',
    //     'proof_of_address',
    //     'id_or_passport',
    //     'bank_statements',
    //     'proof_of_bursary',
    //     'credit_check'
    //   ];
    //   const uploadedTypes = this.userDetails.documents?.map(doc => doc.docType) || [];
    //   return requiredTypes.every(type => uploadedTypes.includes(type));
    // },

    hasAllRequiredDocuments() {
      const requiredDocsByCategory = {
        'Private Client': [
          'private_application_form',
          'private_student_registration',
          'private_id_student',
          'private_id_person',
          'private_proof_of_address',
          'private_3_months_payslips',
          'private_3_months_bank_statements'
        ],
        'Business': [
          'business_application_form',
          'business_student_registration',
          'business_id_directors',
          'business_proof_of_address',
          'business_cipc_documents',
          'business_6_months_bank_statements'
        ],
        'Bursary Application': [
          'bursary_application_form',
          'bursary_student_registration',
          'bursary_confirmation',
          'bursary_proof_of_address',
          'bursary_id_documents'
        ]
      };

      // Get uploaded docTypes
      const uploadedTypes = this.userDetails.documents?.map(doc => doc.docType) || [];
      if (uploadedTypes.length === 0) return false;

      // Detect category from the first uploaded doc prefix
      let category = null;
      const firstDoc = uploadedTypes[0];
      if (firstDoc.startsWith('private_')) category = 'Private Client';
      else if (firstDoc.startsWith('business_')) category = 'Business';
      else if (firstDoc.startsWith('bursary_')) category = 'Bursary Application';

      if (!category) return false;

      const requiredTypes = requiredDocsByCategory[category] || [];
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
      // return this.userDetails.verification?.isVerified &&
      //   (
      //     this.userDetails?.username === 'testuser' ||
      //     this.userDetails?.username === 'WayneL' ||
      //     this.userDetails?.username === 'yusri' ||
      //     this.userDetails?.username === 'admin'
      //   ) &&
      //   this.userDetails?.age &&
      //   this.rentalDetails.rentalStartDate &&
      //   this.rentalDetails.rentalEndDate

      return this.rentalDetails.rentalStartDate &&
        this.rentalDetails.rentalEndDate
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
        const isAvailable = su.isAvailable && !su.reservedBy;

        return matchesRoom && matchesBed && isAvailable;
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
      return "Select Room Type";
    },

    priceOptions() {
      if (!this.selectedOption || !this.selectedOption.price) return [];
      const sortedPrices = [...this.selectedOption.price].sort((a, b) => a.price - b.price);

      return sortedPrices.map((priceObj, index) => {
        const paymentPlanSuffix = 'payment plan';

        return {
          value: priceObj.price,
          label: `R${priceObj.price.toLocaleString('en-ZA')}`,
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
    selectedPrice(newPrice) {
      if (this.selectedOption && this.selectedOption.price) {
        const priceObj = this.selectedOption.price.find(p => p.price === newPrice);
        if (priceObj) {
          if (priceObj.name === '10-month')
            this.rentalDetails.parking.fee = 495.0
          else if (priceObj.name === '11-month')
            this.rentalDetails.parking.fee = 450.0
          else if (priceObj.name === 'annual')
            this.rentalDetails.parking.fee = 4950.0
        }
      }
    },
    selectedOption(newOption) {
      if (newOption && newOption.price && newOption.price.length > 0) {
        this.selectedPrice = newOption.price[0].price;
      }
    },
    subUnit: {
      immediate: true,
      handler(newSubUnit) {
        if (newSubUnit && this.unit && this.selectOptions?.length > 0) {
          this.initializeSelectedOption();
        } else {
          this.selectedOption = null;
          this.selectedPrice = null;
        }
      }
    }
  },
  async created() {
    await this.checkLoginStatus()
  },
  methods: {
    getImageUrl: Helper.getImageUrl, formatDate: Helper.formatDate, capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    initializeSelectedOption() {
      if (this.subUnit && this.unit && Array.isArray(this.unit.subUnits)) {
        const floorNumber = this.$route.params.floor || '1';

        const sampleType = this.selectOptions[0]?.roomType || this.selectOptions[0]?.bedType || '';
        const basePrefix = sampleType.split(' ')[0];

        const fullRoomType = `${basePrefix} ${floorNumber}-${this.subUnit}`;

        const option = this.selectOptions.find(
          su => su.roomType === fullRoomType || su.bedType === fullRoomType
        );

        if (option) {
          this.selectedOption = option;
          if (option.price?.length > 0) {
            this.selectedPriceIndex = 0;
            this.selectedPrice = option.price[0].price;
          }
        } else {
          this.$q.notify({
            type: 'negative',
            message: `Room ${fullRoomType} is already reserved or unavailable.`,
            position: 'top'
          });
        }
      }
    },

    updateSelectedPrice() {
      if (this.selectedOption && this.selectedPriceIndex !== null) {

        const updatedOption = { ...this.selectedOption };

        updatedOption.selectedPrice = this.selectedOption.price[this.selectedPriceIndex];
        updatedOption.selectedPriceIndex = this.selectedPriceIndex;

        this.selectedOption = updatedOption;
      }
    },

    getSelectedPriceObject() {
      if (!this.selectedOption || !this.selectedOption.price || !this.selectedPrice) return null;
      return this.selectedOption.price.find(p => p.price === this.selectedPrice);
    },

    getPricePlanDescription(price) {
      const match = this.priceOptions.find(p => Number(p.value) === Number(price));
      return match?.description || '';
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

    getAvailableSubUnits(unit) {
      if (unit.subUnits && Array.isArray(unit.subUnits)) {
        return unit.subUnits.filter(sub => sub.isAvailable && !sub.reservedBy).length;
      }
      // fallback for old units
      if (unit.unitOccupants != null && unit.currentOccupants != null) {
        return unit.unitOccupants - unit.currentOccupants;
      }
      return 0;
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

      // if (!this.hasAllRequiredDocuments) {
      //   this.$q.notify({ type: 'negative', message: 'Please upload all required documents before proceeding.' });
      //   return;
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

      if (unit.accessKey.isShared) {
        const inputKey = this.rentalDetails.accessKey?.trim().toLowerCase()
        const assignedKey = unit.accessKey?.assignedKey?.trim().toLowerCase()

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

      try {
        const response = await RentalService.createRental(formData)
        await EmailService.RentalApplicationEmail(this.userDetails._id);
        await EmailService.RentalApplicationToUserEmail(this.userDetails._id);
        // const rentalId = response.rental?._id;

        // console.log(rentalId)

        // if (rentalId) {
        //   await EmailService.RentalApplicationEmail(this.userDetails._id, rentalId);
        // }

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
  max-width: 1570px
  padding: 16px

.image-container
  position: relative
  width: 100%
  height: auto
  overflow: hidden
  border-radius: 4px
  display: flex
  justify-content: center
  align-items: center

  @media (max-width: 1025px)
    width: 100%
    height: 100%  // let container collapse or fill parent height if needed

.product-image
  max-width: 100%
  max-height: 100%
  object-fit: contain
  display: block

  @media (max-width: 1025px)
    width: 120%         // make the image bigger than container width
    height: 120%        // also bigger than container height
    object-fit: cover   // fill and crop to cover container fully
    max-width: none     // disable max-width to allow overflow
    max-height: none    // disable max-height

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

// .pinch-zoom-wrapper
//   touch-action: none
//   overflow: hidden
//   max-width: 100%
//   max-height: 100%

//   img
//     width: 100%
//     height: auto
//     display: block

// .pinch-zoom-wrapper
//   width: 100%
//   height: 100%
//   overflow: hidden
//   touch-action: none
//   display: flex
//   justify-content: center
//   align-items: center

// .enlarged-image
//   max-width: 100%
//   max-height: 100%
//   object-fit: contain
//   display: block

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
