<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Review and Validate Information</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-md"><b>Applicant Information</b></div>
          <ul>
            <li>User/Tenant ID: <span class="id-underlined">{{ rental.userId }}</span></li>
            <li>First Name: {{ capitalizeFirstLetter(rental.userFirstName) }}</li>
            <li>Last Name: {{ capitalizeFirstLetter(rental.userLastName) }}</li>
            <li>Gender: {{ rental.userGender }}</li>
            <li v-if="rental.userAge">Age: {{ rental.userAge }}</li>
            <li class="text-negative" v-else>Age: {{ capitalizeFirstLetter(rental.userFirstName) }} has not specified
              their
              age yet</li>
            <li>Username: {{ rental.userUsername }}</li>
            <li>Phone: {{ rental.userPhone }}</li>
            <li>Email: {{ rental.userEmail }}</li>

            <li v-if="rental.userHasBursary">Bursary Student: Yes</li>
            <li v-else>Bursary Student: No</li>

            <li v-if="rental.userRegistered">Registered Student: Registered</li>
            <li v-else>Registered Student: Awaiting Registration</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <b>Credit Score Information </b><span v-if="rental.userHasBursary">(The applicant has a bursary)</span>
            <span v-if="!rental.userHasBursary">(The applicant does not have a bursary)</span>
          </div>
          <ul v-if="rental.userHasBursary">
            <li>The applicant has a bursary, so a credit score is not required.</li>
          </ul>
          <div v-else class="q-mb-md">
            <ul v-if="rental.payerData && Object.values(rental.payerData).some(value => value)">
              <li v-if="rental.payerData.score">Credit Information <span style="text-decoration: underline;">(Score: {{
                rental.payerData.score }}/80)</span></li>
              <li v-if="rental.payerData.firstName">First Name: {{ rental.payerData.firstName }}</li>
              <li v-if="rental.payerData.lastName">Last Name: {{ rental.payerData.lastName }}</li>
              <li v-if="rental.payerData.email">Email: {{ rental.payerData.email }}</li>
              <li v-if="rental.payerData.idNumber">ID Number: {{ rental.payerData.idNumber }}</li>
              <li v-if="rental.payerData.bankName">Bank Name: {{ rental.payerData.bankName }}</li>
              <li v-if="rental.payerData.salary">Salary: R {{ rental.payerData.salary }}</li>
            </ul>
            <div v-else>
              <ul>
                <li class="text-negative">Not scored yet</li>
              </ul>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <b>Parking Information</b><br>
          </div>
          <ul v-if="rental.parking?.hasParking">
            <li v-if="rental.selectedSubUnits?.price?.name === 'annual'">
              Accounting for Parking Fees in Once Off Payment (Fee: R{{ Number(rental.parking.fee).toFixed(2)
              }})
            </li>
            <li v-else>
              Accounting for Parking Fees in Monthly Pricing (Fee: R{{ Number(rental.parking.fee).toFixed(2)
              }} / mo)
            </li>
          </ul>
          <ul v-else>
            <li>Parking Not Included</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Rental Information</b></div>
          <ul>
            <li>Application ID: <span class="id-underlined">{{ rental._id }}</span></li>
            <li>
              <span>Application Date:</span> {{ formatDate(rental.applicationDate) }}
            </li>
            <li>
              <div v-if="rental.selectedSubUnits?.price?.name">Lease Duration: {{
                rental.selectedSubUnits?.price?.name }} Payment Plan</div>
              <div v-else>Lease Duration: Standard Payment Plan</div>
            </li>
            <li v-if="!defaultValues">
              Start Date: {{ formatDate(rental.rentalStartDate) }}
            </li>
            <li v-else>
              Start Date: <span class="text-negative"><b>Being processed</b></span>
            </li>
            <li v-if="!defaultValues">
              End Date: {{ formatDate(rental.rentalEndDate) }}
            </li>
            <li v-else>
              End Date: <span class="text-negative"><b>Being processed</b></span>
            </li>
            <li v-if="rental.earlyEndDate">
              Early End Date: {{ formatDate(rental.earlyEndDate) }}
            </li>
          </ul>
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" class="large-screen-only" />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Unit Information</b></div>
          <ul>
            <li>Unit ID: <span class="id-underlined">{{ rental.unitId }}</span></li>
            <li>Unit Number: {{ rental.unitNumber }}</li>
            <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.roomType">
              Room: {{ rental.selectedSubUnits.roomType }}
            </li>
            <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.bedType">
              Bed: {{ rental.selectedSubUnits.bedType }}
            </li>
            <li v-if="rental.selectedSubUnits?.price?.name === 'annual'">
              Unit Price: R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} {{
                rental.selectedSubUnits?.price?.name }} payment
            </li>

            <li
              v-else-if="rental.selectedSubUnits?.price?.name === '11-month' || rental.selectedSubUnits?.price?.name === '10-month'">
              Unit Price: R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} over {{
                rental.selectedSubUnits?.price?.name }}
            </li>

            <li v-else>
              Unit Price: R {{ Number(rental.selectedSubUnits?.price).toFixed(2) }}
            </li>

            <li v-if="rental.accessKey">
              This user is sharing this unit with family or acquaintances.
            </li>
            <li v-else>
              This user is not sharing this unit with family or acquaintances.
            </li>
            <li v-if="rental.accessKey">Shared Access Key: <span class="id-underlined">{{ rental.accessKey
            }}</span></li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Reassign Tenant's Unit</b></div>
          <q-item>
            This option is provided for cases where multiple pending applications of different genders exist for the same unit.
            Once one applicant is approved, the unit becomes gender‑restricted, preventing the other applicant from being approved.
          </q-item>

          <q-item>
            Use this option to reassign a tenant when the selected unit has reached full capacity or when their gender does not align with the unit’s restriction.
            Ensure that the reassigned unit reflects the correct pricing and monthly payment terms to maintain consistency and accuracy in tenant records.
          </q-item>

          <q-item>
            <q-item-section v-if="unitDetails?.genderAssignment" >
              <div class="row items-center">
                <div>
                  Unit's Assignment: {{ unitDetails.genderAssignment }}
                </div>
                <q-icon
                  :name="unitDetails.genderAssignment === rental.userGender ? 'check' : 'close'"
                  :color="unitDetails.genderAssignment === rental.userGender ? 'green' : 'red'"
                  class="q-ml-sm"
                />
              </div>
            </q-item-section>
            <q-item-section v-else>
              <div class="row items-center">
                <div>
                  Unit Gender Unassigned
                </div>
                <q-icon
                  name="check"
                  color="green"
                  class="q-ml-sm"
                />
              </div>
            </q-item-section>

            <q-item-section>
              <div class="row items-center">
                <div>
                  Unit's Occupancy: {{ unitDetails.currentOccupants }} / {{ unitDetails.unitOccupants }}
                </div>
                <q-icon
                  :name="unitDetails.currentOccupants <= unitDetails.unitOccupants ? 'check' : 'close'"
                  :color="unitDetails.currentOccupants <= unitDetails.unitOccupants ? 'green' : 'red'"
                  class="q-ml-sm"
                />
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <q-select
                v-model="selectedUnit"
                :options="genderBasedUnits.map(unit => ({
                  label: `${unit.unitNumber} - ${unit.genderAssignment || 'Unassigned'}`,
                  value: unit._id
                }))"
                label="Select Unit"
                @update:model-value="loadSubUnits"
              />
            </q-item-section>

            <q-item-section class="text-left text-subtitle1">
              <q-select
                v-if="availableSubUnits.length > 0"
                v-model="selectedSubUnit"
                :options="availableSubUnits"
                option-label="label"
                emit-value="false"
                map-options
                option-value="value"
                label="Select Bed/Room"
                @update:model-value="onSubUnitSelected"
              />
            </q-item-section>

            <q-item-section class="text-left text-subtitle1">
              <q-select
                v-if="selectedSubUnit"
                v-model="selectedPricePlan"
                :options="availablePrices"
                option-label="name"
                emit-value="false"
                map-options
                label="Select Payment Plan"
              />
            </q-item-section>
          </q-item>

          <q-item>
            <div
              :class="[
                ((unitDetails.genderAssignment === rental.userGender || !unitDetails.genderAssignment)
                && (unitDetails.currentOccupants < unitDetails.unitOccupants))
                  ? 'text-green text-bold text-caption'
                  : 'text-red text-bold text-caption'
              ]"
            >
              <div class="row items-center">
                <div>
                  {{
                    (unitDetails.genderAssignment === rental.userGender || !unitDetails.genderAssignment)
                    && (unitDetails.currentOccupants < unitDetails.unitOccupants)
                      ? "Unit is valid for approval. No reassignment needed."
                      : "Unit has issues. Please reassign tenant."
                  }}
                </div>
              </div>
            </div>
          </q-item>

          <q-item>
            <q-item-section>
              <CustomButton label="Re-Assign Unit" :disable="!selectedSubUnit" @click="reassignUnit" customStyle="width: 100%" />
            </q-item-section>
            <q-item-section></q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Payment Information</b></div>
          <!-- Payment Cards -->
          <div class="row q-col-gutter-md q-mb-md">
            <!-- Upfront Payment Card -->
            <div class="col-12 col-sm-6" v-if="rental.selectedSubUnits?.price.name === 'annual'">
              <q-card flat bordered class="bg-green-1">
                <q-card-section>
                  <div class="text-weight-medium">Discounted Price (Payment by 30 Nov)</div>
                  <div class="text-h6 text-green">
                    R {{
                      rental.parking?.hasParking
                        ? (
                          (Number(rental.selectedSubUnits?.price?.price) * 0.96) +
                          (Number(rental.parking?.fee) * 0.96)
                        ).toFixed(2)
                        : (Number(rental.selectedSubUnits?.price?.price) * 0.96).toFixed(2)
                    }}
                  </div>
                  <div class="text-caption text-grey">
                    <span v-if="rental.parking?.hasParking">
                      Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.96).toFixed(2) }} / once
                      off rent<br>
                      + R {{ (Number(rental.parking?.fee) * 0.96).toFixed(2) }} / once off parking
                    </span>
                    <span v-else>
                      Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.96).toFixed(2) }} / once
                      off rent
                    </span>
                  </div>
                </q-card-section>
              </q-card>

              <!-- Original Price Without Discount -->
              <q-card flat bordered class="bg-grey-2 q-mt-md">
                <q-card-section>
                  <div class="text-weight-medium">Original Price</div>
                  <div class="text-h6 text-grey">
                    R {{
                      rental.parking?.hasParking
                        ? (
                          Number(rental.selectedSubUnits?.price?.price) +
                          Number(rental.parking?.fee)
                        ).toFixed(2)
                        : Number(rental.selectedSubUnits?.price?.price).toFixed(2)
                    }}
                  </div>
                  <div class="text-caption text-grey">
                    <span v-if="rental.parking?.hasParking">
                      R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / once
                      off rent<br>
                      + R {{ Number(rental.parking?.fee).toFixed(2) }} / once off parking
                    </span>
                    <span v-else>
                      R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} rent
                    </span>
                  </div>
                </q-card-section>
              </q-card>
            </div>

            <!-- Monthly Payment Card -->
            <div class="col-12 col-sm-6" v-else>
              <q-card flat bordered class="bg-grey-1">
                <q-card-section>
                  <div class="text-weight-medium">Monthly Payment Plan</div>
                  <div class="text-h6">R {{ Number(rental.rentalPrice).toFixed(2) }}</div>
                  <div class="text-caption text-grey">
                    <span v-if="rental.parking?.hasParking">
                      R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / mo rent<br>
                      + R {{ Number(rental.parking.fee).toFixed(2) }} / mo parking
                    </span>
                    <span v-else>No parking included</span>
                  </div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Verification Status</b></div>
          <div class="row q-mb-sm">
            <q-icon :name="userDetails?.verification?.isVerified ? 'check_circle' : 'error'"
              :color="userDetails?.verification?.isVerified ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">
              Email {{ userDetails?.verification?.isVerified ? 'verified' : 'not verified' }}
            </span>
          </div>
          <div class="row q-mb-sm">
            <q-icon :name="hasAllRequiredDocuments ? 'check_circle' : 'error'"
              :color="hasAllRequiredDocuments ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">
              Documents {{ hasAllRequiredDocuments ? 'complete' : 'incomplete' }}
            </span>
          </div>
          <div class="row q-mb-sm">
            <q-icon :name="userDetails.dateOfBirth ? 'check_circle' : 'error'"
              :color="userDetails.dateOfBirth ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">Age {{ userDetails.dateOfBirth ? 'verified' : 'not verified' }}</span>
          </div>
        </q-card-section>

        <q-card-section v-if="isApproved" class="row justify-between">
          <div class="col-md-6 col-12 q-px-sm"><q-input filled type="date" v-model="rental.rentalStartDate"
              label="Rental Start Date" :min="minDate" /></div>
          <div class="col-md-6 col-12 q-px-sm"><q-input filled type="date" v-model="rental.rentalEndDate"
              label="Rental End Date" :min="rentalStartDate || minDate" /></div>
        </q-card-section>

        <q-card-section>
          <q-radio v-model="isApproved" :val="null" label="Request More Info" />
          <q-radio v-model="isApproved" :val="true" label="Approved" />
          <q-radio v-model="isApproved" :val="false" label="Declined" />
        </q-card-section>

        <q-card-section v-if="isApproved === null">
          <q-input filled label-color="black" v-model="message" label="Message to Applicant" type="textarea" stack-label
            required style="border: 2px solid white;" />
        </q-card-section>

        <q-card-section v-if="isApproved === false">
          <q-input filled label-color="black" v-model="message" label="Message to Applicant" type="textarea" stack-label
            required style="border: 2px solid white;">
          </q-input>
        </q-card-section>

        <q-card-section class="justify-between row">
          <CustomButton v-if="isApproved === true" label="Approve" @click="approveRental" customStyle="width: 100%" />
          <CustomButton v-if="isApproved === false" label="Decline" @click="rejectRental" customStyle="width: 100%" />
          <CustomButton v-if="isApproved === null" label="Send Request" @click="requestMoreInfo"
            customStyle="width: 100%" />
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue'
import Helper from 'src/services/utils'
import RentalService from 'src/services/RentalService';
import UserService from 'src/services/UserService';
import EmailService from 'src/services/EmailService';
import UnitService from 'src/services/UnitService';

export default {
  name: 'AdminRentalApprovalComponent',
  components: { CustomButton },
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      unitDetails: {},
      isApproved: null,
      userDetails: {},
      message: '',
      minDate: new Date().toISOString().split('T')[0],

      genderBasedUnits: [],
      selectedUnit: null,
      selectedSubUnit: null,
      availableSubUnits: [],
      availablePrices: [],

      selectedPricePlan: null

    }
  },
  async created() {
    await this.getUnitAvailability();
    await this.fetchUserDetails();
  },
  computed: {
    hasAllRequiredDocuments() {
      // Define required docs per category (with prefixes)
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

      // Detect category from prefix of first uploaded doc
      let category = null;
      const firstDoc = uploadedTypes[0];
      if (firstDoc.startsWith('private_')) category = 'Private Client';
      else if (firstDoc.startsWith('business_')) category = 'Business';
      else if (firstDoc.startsWith('bursary_')) category = 'Bursary Application';

      if (!category) return false;

      const requiredTypes = requiredDocsByCategory[category] || [];
      return requiredTypes.every(type => uploadedTypes.includes(type));
    },

    defaultValues() {
      const toDateOnly = (dateStr) => dateStr?.split('T')[0] || '';
      const today = new Date();
      const nextYear = today.getFullYear() + 1;
      const defaultStart = `${nextYear}-01-01`;
      const defaultEnd = `${nextYear}-12-31`;

      const start = toDateOnly(this.rental?.rentalStartDate);
      const end = toDateOnly(this.rental?.rentalEndDate);

      return start === defaultStart && end === defaultEnd;
    },
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    setRentalDates(startDate, endDate) {
      this.rental.rentalStartDate = startDate;
      this.rental.rentalEndDate = endDate;
    },

    async loadSubUnits(selectedOption) {
      this.selectedSubUnit = null;
      this.availableSubUnits = [];
      this.availablePrices = [];

      const unitId = typeof selectedOption === 'object' ? selectedOption.value : selectedOption;
      const unit = await UnitService.getByIdUnit(unitId);

      this.availableSubUnits = (unit.subUnits || [])
        .filter(sub => sub.isAvailable)
        .map(sub => ({
          value: sub.roomType || sub.bedType || sub.type,
          label: sub.roomType || sub.bedType || sub.type,
          prices: sub.price || []
        }));
    },

    onSubUnitSelected(sub) {
      this.availablePrices = sub?.prices || [];
      this.selectedPricePlan = null;
    },

    // async reassignUnit() {
    //   try {
    //     const unit = this.genderBasedUnits.find(u => u._id === this.selectedUnit.value)
    //     if (!unit) {
    //       console.error("Unit not found")
    //       return
    //     }
    //     const subUnit = (unit.subUnits || []).find(su => su.bedType === this.selectedSubUnit.value || su.roomType === this.selectedSubUnit.value);
    //     if (!subUnit) {
    //       console.error("Subunit not found");
    //       return;
    //     }
    //     const rentalPrice = this.rental?.selectedSubUnits?.price;
    //     const matchedPrice = (subUnit.price || []).find(
    //       p => p.name === rentalPrice?.name && p.price === rentalPrice?.price
    //     );
    //     if (!matchedPrice) {
    //       console.error("No matching price plan found for this subunit");
    //       return;
    //     }

    //     this.$q.dialog({
    //       title: 'Confirm', message: `You are about to reassign this tenant to another unit, continue?`, color: 'primary', cancel: true, persistent: true
    //     }).onOk(async () => {
    //       const payload = {
    //         rentalId: this.rental._id,
    //         newUnitId: unit._id,
    //         newSubUnit: {
    //           type: subUnit.type,
    //           roomType: subUnit.roomType,
    //           bedType: subUnit.bedType,
    //           price: matchedPrice
    //         }
    //       }

    //       const response = await RentalService.reassignUnit(payload);
    //       if (response) {
    //         this.$q.notify({ type: 'positive', color: 'primary', message: 'Reassign successful!' })
    //         this.$emit('close')
    //       } else {
    //         this.$q.notify({ type: 'negative', message: 'Reassing unit failed. Please try again.' })
    //       }
    //     }).onCancel(() => {
    //       return
    //     })
    //   } catch (err) {
    //     console.error("Error during reassignment:", err);
    //   }
    // },

    async reassignUnit() {
      try {
        const unit = this.genderBasedUnits.find(u => u._id === this.selectedUnit.value);
        if (!unit) {
          console.error("Unit not found");
          return;
        }

        const subUnit = (unit.subUnits || []).find(
          su => su.bedType === this.selectedSubUnit.value || su.roomType === this.selectedSubUnit.value
        );
        if (!subUnit) {
          console.error("Subunit not found");
          return;
        }

        // Use the selected payment plan instead of defaulting
        const matchedPrice = this.selectedPricePlan;
        if (!matchedPrice) {
          console.error("No payment plan selected");
          return;
        }

        this.$q.dialog({
          title: 'Confirm',
          message: `You are about to reassign this tenant to another unit, continue?`,
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const payload = {
            rentalId: this.rental._id,
            newUnitId: unit._id,
            newSubUnit: {
              type: subUnit.type,
              roomType: subUnit.roomType,
              bedType: subUnit.bedType,
              price: matchedPrice
            }
          };

          const response = await RentalService.reassignUnit(payload);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Reassign successful!' });
            this.$emit('close');
          } else {
            this.$q.notify({ type: 'negative', message: 'Reassign unit failed. Please try again.' });
          }
        }).onCancel(() => {
          return;
        });
      } catch (err) {
        console.error("Error during reassignment:", err);
      }
    },

    async findAllGenderBasedUnits(userGender, selectedPriceName, selectedPriceValue) {
      const response = await UnitService.getAllUnits();

      this.genderBasedUnits = response
        .filter(unit => !unit.genderAssignment || unit.genderAssignment === userGender)

        .filter(unit => {
          const subUnits = unit.subUnits || [];
          return subUnits.some(subUnit =>
            (subUnit.price || []).some(p =>
              p.name === selectedPriceName && p.price === selectedPriceValue
            )
          );
        })
        .filter(unit => unit.currentOccupants < unit.unitOccupants)
        .sort((a, b) => {
          if (a.unitNumber < b.unitNumber) return -1;
          if (a.unitNumber > b.unitNumber) return 1;
          return 0;
        });
    },

    async getUnitAvailability() {
      const response = await UnitService.getByIdUnit(this.rental.unit)
      this.unitDetails = response

      await this.findAllGenderBasedUnits(
        this.rental.userGender,
        this.rental?.selectedSubUnits?.price?.name,
        this.rental?.selectedSubUnits?.price?.price
      );
    },

    async fetchUserDetails() {
      try {
        const response = await UserService.findUserById(this.rental.userId);
        this.userDetails = response;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load user details.'
        });
      }
    },

    async requestMoreInfo() {
      if (!this.message) {
        this.$q.notify({ type: 'warning', message: 'Please enter a message before sending.' })
        return
      }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to request more information from the applicant. Continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await EmailService.RentalActionReminder(this.rental.userId, this.message)
          this.$q.notify({ type: 'info', color: 'primary', message: 'Request sent to applicant.' })
          this.$emit('close')
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'Failed to send request. Please try again.' })
        }
      })
    },

    async approveRental() {
      if (this.unitDetails.currentOccupants >= this.unitDetails.unitOccupants) {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          position: 'top',
          message: `Unit ${this.unitDetails.unitNumber} is already at max capacity (${this.unitDetails.unitOccupants}). Please Reassign this tenant to another unit.`
        });
        return;
      }

      if (this.unitDetails.genderAssignment) {
        const applicant = await UserService.findUserById(this.rental.userId);
        if (applicant && applicant.gender !== this.unitDetails.genderAssignment) {
          this.$q.notify({
            type: 'negative',
            color: 'red',
            position: 'top',
            message: `Unit ${this.unitDetails.unitNumber} is restricted to ${this.unitDetails.genderAssignment}s.`
          });
          return;
        }
      }

      if (this.isApproved === true) {
        const today = new Date();
        const nextYear = today.getFullYear() + 1;
        const defaultStart = `${nextYear}-01-01`;
        const defaultEnd = `${nextYear}-12-31`;

        if (this.rental.rentalStartDate == defaultStart && this.rental.rentalEndDate === defaultEnd) {
          this.$q.notify({
            type: 'warning',
            message: 'Please update the rental start and end dates before approval.'
          });
          return;
        }

        this.$q.dialog({
          title: 'Confirm', message: `You are about to approve this rental and notify applicant, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {

          const subUnit = this.rental.selectedSubUnits;
          const unitTypeForRental =
            subUnit?.roomType ||
            subUnit?.bedType ||
            this.unitDetails.unitType;

          const approvedRental = {
            applicationDate: this.rental.applicationDate,
            status: "Active",
            rentalStartDate: this.rental.rentalStartDate,
            rentalEndDate: this.rental.rentalEndDate,
            rentalPrice: this.rental.rentalPrice,
            unit: this.rental.unit,
            unitType: unitTypeForRental,   // <-- now correct
            user: this.rental.user,
            selectedSubUnits: subUnit      // keep full subunit details
          }

          const response = await RentalService.updateRental(this.rental._id, approvedRental)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Approved!' })
            await EmailService.ApprovedRental(this.rental.userId, this.rental.unit, this.rental._id)
            await UserService.findUserById(this.rental.userId)
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Approve rental failed. Please try again.' })
          }
        }).onCancel(() => {
          return
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'Approve rental failed. Please try again.' })
      }
    },

    async rejectRental() {
      const rejectedRental = {
        applicationDate: this.rental.applicationDate,
        status: "Rejected",
        rentalStartDate: null,
        rentalEndDate: null,
        rentalPrice: this.rental.rentalPrice,
        unit: this.rental.unit,
        unitType: this.rental.unitType,
        user: this.rental.user
      }
      if (this.isApproved === false && this.message) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to reject this rental and notify applicant, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          // console.log(this.rental._id, rejectedRental)
          const response = await RentalService.updateRental(this.rental._id, rejectedRental)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Rejected!' })
            await EmailService.RejectedRental(this.rental.userId, this.message)
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Reject rental failed. Please try again.' })
          }
        }).onCancel(() => {
          return
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'Reject rental failed. Please try again.' })
      }
    },
  }
}
</script>

<style lang="sass">
.left-card
  display: flex
  flex-direction: column
  height: 100%

.combined-unit-card
  width: 100%
  max-width: 100%
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px
</style>
