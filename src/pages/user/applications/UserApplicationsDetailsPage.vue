<template>
  <q-page class="bg-grey-2">
    <div class="constrain-standard row justify-center q-py-md">
      <q-card flat v-if="!loading" class="col-md-12 col-12" style="background: transparent; box-shadow: none;"
>
        <q-card-section>
          <div>
            <q-timeline :layout="layout" color="secondary">

              <q-timeline-entry heading>
                <div class="text-h4">
                  Rental Application Process
                </div>
              </q-timeline-entry>

              <!-- Account creation -->
              <q-timeline-entry title="Account Creation" icon="eva-people" side="right" color="orange"
                :subtitle="formatDate(rental.userDateCreated)">
                <q-card-section>
                  <div class="q-mb-md"><b>Applicant Information</b></div>
                  <ul>
                    <li>User/Tenant ID: <span class="id">{{ rental.userId }}</span></li>
                    <li>First Name: {{ capitalizeFirstLetter(rental.userFirstName) }}</li>
                    <li>Last Name: {{ capitalizeFirstLetter(rental.userLastName) }}</li>
                    <li>Gender: {{ rental.userGender }}</li>
                    <li v-if="rental.userAge">Age: {{ rental.userAge }}</li>
                    <li class="text-negative" v-else>Age: {{ capitalizeFirstLetter(rental.userFirstName) }} has not
                      specified their age yet</li>
                    <li>Username: {{ rental.userUsername }}</li>
                    <li>Phone: {{ rental.userPhone }}</li>
                    <li>Email: {{ rental.userEmail }}</li>
                  </ul>
                </q-card-section>
              </q-timeline-entry>

              <!-- Account verification -->
              <q-timeline-entry v-if="rental.userVerified === true" title="Account has been Verified" icon="done_all"
                side="left" />

              <q-timeline-entry v-if="rental.userVerified === false" title="Account has not been Verified" color="red"
                icon="close" side="left" />

              <!-- Rental creation -->
              <q-timeline-entry title="Rental Creation" :subtitle="formatDate(rental.applicationDate)" icon="done_all"
                side="right">

                <q-card-section>
                  <div class="q-mb-md"><b>Payment Information</b></div>

                  <!-- Terms in list format to match above -->
                  <ul class="q-mt-md" v-if="rental.selectedSubUnits?.price.name === 'annual'">
                    <li v-if="rental.parking?.hasParking">
                      Upfront payment includes 11 months at discounted rate (3% off both rent, shuttle and parking)
                    </li>
                    <li v-else>
                      Upfront payment includes 11 months rent at discounted rate (3% off)
                    </li>
                    <li>Payment must be made by 30 November to qualify for discount</li>
                    <li>Monthly payments are due on the 1st of each month</li>
                  </ul>

                  <ul class="q-mt-md" v-else>
                    <li v-if="rental.selectedSubUnits && rental.selectedSubUnits?.roomType?.startsWith('Botmaskop')">
                      A deposit of R 9 250.00 must be paid upon approval
                    </li>
                    <li
                      v-else-if="rental.selectedSubUnits && rental.selectedSubUnits?.bedType?.startsWith('Helshoogte')">
                      A deposit of R6 500.00 must be paid upon approval
                    </li>
                    <li v-else>
                      A deposit is required upon approval
                    </li>
                    <li>Discount of 3% is only applicable for annual payments</li>
                    <li>Monthly payments are due on the 1st of each month</li>
                  </ul>
                  <br>

                  <!-- Payment Cards -->
                  <div class="row q-col-gutter-md q-mb-md">
                    <!-- Upfront Payment Card -->
                    <div class="col-12 col-sm-6" v-if="rental.selectedSubUnits?.price.name === 'annual'">
                      <q-card flat bordered class="bg-green-1">
                        <q-card-section>
                          <div class="text-weight-medium">Discounted Price (Payment by 30 Nov)</div>
                          <div class="text-h6 text-green">
                            R {{
                              (() => {
                                let total = Number(rental.selectedSubUnits?.price?.price) * 0.97;
                                if (rental.parking?.hasParking) {
                                  total += Number(rental.parking?.fee) * 0.97;
                                }
                                if (rental.shuttle?.hasShuttle) {
                                  total += Number(rental.shuttle?.fee) * 0.97;
                                }
                                return total.toFixed(2);
                              })()
                            }}
                          </div>
                          <div class="text-caption text-grey">
                            <span v-if="rental.parking?.hasParking && rental.shuttle?.hasShuttle">
                              Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.97).toFixed(2) }} / once off rent<br>
                              + R {{ (Number(rental.parking?.fee) * 0.97).toFixed(2) }} / once off parking<br>
                              + R {{ (Number(rental.shuttle?.fee) * 0.97).toFixed(2) }} / once off shuttle
                            </span>
                            <span v-else-if="rental.parking?.hasParking">
                              Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.97).toFixed(2) }} / once off rent<br>
                              + R {{ (Number(rental.parking?.fee) * 0.97).toFixed(2) }} / once off parking
                            </span>
                            <span v-else-if="rental.shuttle?.hasShuttle">
                              Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.97).toFixed(2) }} / once off rent<br>
                              + R {{ (Number(rental.shuttle?.fee) * 0.97).toFixed(2) }} / once off shuttle
                            </span>
                            <span v-else>
                              Save 4%: R {{ (Number(rental.selectedSubUnits?.price?.price) * 0.97).toFixed(2) }} / once off rent
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
                              (() => {
                                let total = Number(rental.selectedSubUnits?.price?.price);
                                if (rental.parking?.hasParking) {
                                  total += Number(rental.parking?.fee);
                                }
                                if (rental.shuttle?.hasShuttle) {
                                  total += Number(rental.shuttle?.fee);
                                }
                                return total.toFixed(2);
                              })()
                            }}
                          </div>
                          <div class="text-caption text-grey">
                            <span v-if="rental.parking?.hasParking && rental.shuttle?.hasShuttle">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / once off rent<br>
                              + R {{ Number(rental.parking?.fee).toFixed(2) }} / once off parking<br>
                              + R {{ Number(rental.shuttle?.fee).toFixed(2) }} / once off shuttle
                            </span>
                            <span v-else-if="rental.parking?.hasParking">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / once off rent<br>
                              + R {{ Number(rental.parking?.fee).toFixed(2) }} / once off parking
                            </span>
                            <span v-else-if="rental.shuttle?.hasShuttle">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / once off rent<br>
                              + R {{ Number(rental.shuttle?.fee).toFixed(2) }} / once off shuttle
                            </span>
                            <span v-else>
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / once off rent
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
                            <span v-if="rental.parking?.hasParking && rental.shuttle?.hasShuttle">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / mo rent<br>
                              + R {{ Number(rental.parking.fee).toFixed(2) }} / mo parking<br>
                              + R {{ Number(rental.shuttle.fee).toFixed(2) }} / mo shuttle
                            </span>
                            <span v-else-if="rental.parking?.hasParking">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / mo rent<br>
                              + R {{ Number(rental.parking.fee).toFixed(2) }} / mo parking
                            </span>
                            <span v-else-if="rental.shuttle?.hasShuttle">
                              R {{ Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} / mo rent<br>
                              + R {{ Number(rental.shuttle.fee).toFixed(2) }} / mo shuttle
                            </span>
                            <span v-else>No parking or shuttle included</span>
                          </div>
                        </q-card-section>
                      </q-card>
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
                  <div class="q-mb-md">
                    <b>Shuttle Information</b><br>
                  </div>
                  <ul v-if="rental.shuttle?.hasShuttle">
                    <li v-if="rental.selectedSubUnits?.price?.name === 'annual'">
                      Accounting for Shuttle Fees in Once Off Payment (Fee: R{{ Number(rental.shuttle.fee).toFixed(2)
                      }})
                    </li>
                    <li v-else>
                      Accounting for Shuttle Fees in Monthly Pricing (Fee: R{{ Number(rental.shuttle.fee).toFixed(2)
                      }} / mo)
                    </li>
                  </ul>
                  <ul v-else>
                    <li>Shuttle Not Included</li>
                  </ul>
                </q-card-section>

                <q-card-section>
                  <div class="q-mb-md"><b>Rental Information</b></div>
                  <ul>
                    <li>Application ID: <span class="id">{{ rental._id }}</span></li>
                    <li>
                      <span>Application Date:</span> {{ formatDate(rental.applicationDate) }}
                    </li>
                    <li>
                      <div v-if="rental.selectedSubUnits?.price?.name">Lease Duration: {{
                        rental.selectedSubUnits?.price?.name }} Payment Plan</div>
                      <div v-else>Lease Duration: Standard Payment Plan</div>
                    </li>
                    <li>
                      Start Date: {{ formatDate(rental.rentalStartDate) }}
                    </li>
                    <li>
                      End Date: {{ formatDate(rental.rentalEndDate) }}
                    </li>
                    <li v-if="rental.earlyEndDate">
                      Early End Date: {{ formatDate(rental.earlyEndDate) }}
                    </li>
                  </ul>
                </q-card-section>

                <q-card-section>
                  <div class="q-mb-md"><b>Unit Information</b></div>
                  <ul>
                    <li>Unit ID: <span class="id">{{ rental.unitId }}</span></li>
                    <li v-if="rental.accessKey">
                      This user is sharing this unit with family or acquaintances.
                    </li>
                    <li v-else>
                      This user is not sharing this unit with family or acquaintances.
                    </li>
                    <li v-if="rental.accessKey">Shared Access Key: <span class="id">{{ rental.accessKey
                    }}</span></li>
                    <li>Unit Number: {{ rental.unitNumber }}</li>
                    <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.roomType">
                      Room: {{ rental.selectedSubUnits.roomType }}
                    </li>
                    <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.bedType">
                      Bed: {{ rental.selectedSubUnits.bedType }}
                    </li>
                    <!-- <li v-if="rental.selectedSubUnits?.price?.price">Unit Price: R {{
                      Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} over {{
                        rental.selectedSubUnits?.price?.name }}s</li>
                    <li v-else>
                      Unit Price: R {{ Number(rental.selectedSubUnits?.price).toFixed(2) }}
                    </li> -->

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
                  </ul>
                </q-card-section>

              </q-timeline-entry>

              <!-- Documents upload -->
              <q-timeline-entry v-if="hasAllRequiredDocuments"
                title="Documents have been Uploaded" side="left" icon="done_all" />

              <q-timeline-entry v-else title="Remaining Documents to Complete Submission" side="left" color="red"
                icon="close" />

              <q-timeline-entry v-if="rental.status === 'Active' || rental.status === 'Ended'"
                title="Documents have been Approved" side="right" icon="done_all" />

              <!-- Document Approvals -->
              <q-timeline-entry v-else title="Document Approval" side="right" color="grey"
                icon="eva-file-text-outline" />

              <!-- Rental Approvals -->
              <q-timeline-entry v-if="rental.status === 'Pending'" title="Approve Rental" color="grey"
                icon="eva-briefcase-outline" side="left">
                <div class="q-mb-md"></div>
              </q-timeline-entry>

              <!-- rejected rental -->
              <q-timeline-entry v-if="rental.status === 'Rejected'" title="Rental has been Rejected" icon="close"
                color="red" side="left" />

              <!-- approved rental -->
              <q-timeline-entry v-if="rental.status === 'Active'" title="Rental has been Approved"
                :subtitle="formatDate(rental.rentalStartDate)" icon="done_all" side="left" />

              <!-- scheduled ended rental -->
              <q-timeline-entry v-if="rental.status === 'Ended' && rental.earlyEndDate === null"
                title="Rental has ended" :subtitle="formatDate(rental.rentalEndDate)"
                :body="`The rental period concluded as scheduled.`" icon="done_all" side="left" color="orange" />

              <!-- early ended rental -->
              <q-timeline-entry v-if="rental.status === 'Ended' && rental.earlyEndDate !== null"
                title="Rental has ended" :subtitle="formatDate(rental.earlyEndDate)"
                :body="`The rental period concluded ahead of the scheduled end date.`" icon="done_all" side="left"
                color="orange" />
            </q-timeline>
          </div>
        </q-card-section>
      </q-card>
      <q-inner-loading :showing="loading" color="primary" size="md" />
    </div>
  </q-page>
</template>

<script>
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import RentalService from 'src/services/api/RentalService';
import UnitService from 'src/services/api/UnitService';
import UserService from 'src/services/api/UserService';
import Helper from 'src/services/helper/utils';

export default {
  name: "RentalDetails",

  data() {
    return {
      loading: true,
      rental: {},
      userDetails: {},
      currentUser: {}
    }
  },
  created() {
    this.fetchRentalDetails()
    this.getUser()
  },
  computed: {
    layout() {
      return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose');
    },
    hasAllRequiredDocuments() {
      // Define required docs per category
      const requiredDocsByCategory = {
        'Private Client': [
          // 'private_application_form',
          'private_student_registration',
          'private_id_student',
          'private_id_person',
          'private_proof_of_address',
          'private_3_months_payslips',
          'private_3_months_bank_statements',
          'private_credit_check_proof_of_payment',
        ],
        'Business': [
          // 'business_application_form',
          'business_student_registration',
          'business_id_directors',
          'business_proof_of_address',
          'business_cipc_documents',
          'business_6_months_bank_statements',
          'business_credit_check_proof_of_payment',
        ],
        'Bursary Application': [
          // 'bursary_application_form',
          'bursary_student_registration',
          'bursary_confirmation',
          'bursary_proof_of_address',
          'bursary_id_documents',
          'bursary_credit_check_proof_of_payment',
        ]
      };

      const uploadedTypes = this.rental.userDocuments?.map(doc => doc.docType) || [];
      if (uploadedTypes.length === 0) return false;

      // Detect category from prefix
      let category = null;
      const firstDoc = uploadedTypes[0];
      if (firstDoc.startsWith('private_')) category = 'Private Client';
      else if (firstDoc.startsWith('business_')) category = 'Business';
      else if (firstDoc.startsWith('bursary_')) category = 'Bursary Application';

      if (!category) return false;

      const requiredTypes = requiredDocsByCategory[category] || [];
      return requiredTypes.every(type => uploadedTypes.includes(type));
    },

    // defaultValues() {
    //   const toDateOnly = (dateStr) => dateStr?.split('T')[0] || '';
    //   const today = new Date();
    //   const nextYear = today.getFullYear() + 1;
    //   const defaultStart = `${nextYear}-01-01`;
    //   const defaultEnd = `${nextYear}-12-31`;

    //   const start = toDateOnly(this.rental?.rentalStartDate);
    //   const end = toDateOnly(this.rental?.rentalEndDate);

    //   return start === defaultStart && end === defaultEnd;
    // },
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async fetchRentalDetails() {
      this.loading = true;
      const encryptedId = this.$route.params.id;
      const decryptedBytes = AES.decrypt(decodeURIComponent(encryptedId), 'secret-key');
      const decryptedId = decryptedBytes.toString(Utf8);

      try {

        this.userDetails = await Helper.fetchUserDetails()
        const myRentals = await RentalService.findMyRentals(this.userDetails._id)
        const response = myRentals.find(rental => rental._id === decryptedId)
        if (!response) {
          throw new Error('Rental not found');
        }
        const unit = await UnitService.getByIdUnit(response.unit);
        this.rental = {
          ...response,

          unitNumber: unit.unitNumber,
          unitPrice: unit.unitPrice,
          unitType: unit.unitType,
          unitId: unit._id,

          userId: this.userDetails._id,
          userUsername: this.userDetails.username,
          userFirstName: this.userDetails.firstName,
          userLastName: this.userDetails.lastName,
          userEmail: this.userDetails.email,
          userPhone: this.userDetails.phone,
          userGender: this.userDetails.gender,
          userAge: this.userDetails.age,
          userDateCreated: this.userDetails.dateCreated,
          userVerified: this.userDetails.verification.isVerified,
          userDocuments: this.userDetails.documents,
          userType: this.userDetails.userType,

          userHasBursary: this.userDetails.studentInfo.hasBursary,
        };
        // console.log(this.rental)
      } catch (error) {
        console.error('Error fetching rental details:', error);
        this.$q.notify({ type: 'negative', message: 'Failed to load rental details' });
      } finally {
        this.loading = false;
      }
    },

    async getUser() {
      this.currentUser = await Helper.fetchUserDetails()
    }

  }
}
</script>
