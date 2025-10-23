<template>
  <q-page>

    <div class="constrain-standard row justify-center q-py-md">
      <q-card flat class="col-md-12 col-12">
        <q-card-section>
          <div v-if="!loading">

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

                    <li v-if="rental.userHasBursary">Bursary Student: Yes</li>
                    <li v-else>Bursary Student: No</li>

                    <li v-if="rental.userRegistered">Registered Student: Registered</li>
                    <li v-else>Registered Student: Awaiting Registration</li>
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
                      Upfront payment includes 11 months at discounted rate (4% off both rent and parking)
                    </li>
                    <li v-else>
                      Upfront payment includes 11 months rent at discounted rate (4% off)
                    </li>
                    <li>Payment must be made by 30 November to qualify for discount</li>
                    <li>Monthly payments are due on the 1st of each month</li>
                  </ul>

                  <ul class="q-mt-md" v-else>
                    <li v-if="rental.selectedSubUnits && rental.selectedSubUnits?.roomType?.startsWith('Botmaskop')">
                      A deposit of R12 000 must be paid upon approval
                    </li>
                    <li
                      v-else-if="rental.selectedSubUnits && rental.selectedSubUnits?.bedType?.startsWith('Helshoogte')">
                      A deposit of R6 250 must be paid upon approval
                    </li>
                    <li v-else>
                      A deposit is required upon approval
                    </li>
                    <li>Discount of 4% is only applicable for annual payments</li>
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
                    <li v-if="rental.accessKey">Shared Access Key: <span class="id-underlined">{{ rental.accessKey
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
                    <b>Credit Score Information </b><span v-if="rental.userHasBursary">(The applicant has a
                      bursary)</span> <span v-if="!rental.userHasBursary">(The applicant does not have a bursary)</span>
                  </div>
                  <ul v-if="rental.userHasBursary">
                    <li>The applicant has a bursary, so a credit score is not required.</li>
                  </ul>
                  <div v-else class="q-mb-md">
                    <ul v-if="rental.payerData && Object.values(rental.payerData).some(value => value)">
                      <li v-if="rental.payerData.score">Credit Information <span
                          style="text-decoration: underline;">(Score: {{
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
                        <li><span class="text-negative"><b>Not scored yet</b></span></li>
                      </ul>
                    </div>
                  </div>
                </q-card-section>

              </q-timeline-entry>

              <!-- Documents upload -->
              <q-timeline-entry v-if="rental.userDocuments && rental.userDocuments.length === 5"
                title="Documents have been Uploaded" side="left" icon="done_all" />

              <q-timeline-entry v-else title="Remaining Documents to Complete Submission" side="left" color="red"
                icon="close" />

              <q-timeline-entry v-if="rental.status === 'Active' || rental.status === 'Ended'"
                title="Documents have been Approved" side="right" icon="done_all" />

              <!-- Document Approvals -->
              <q-timeline-entry v-else title="Document Approval" side="right" color="grey" icon="eva-file-text-outline">
                <div class="q-mb-md" style="cursor: pointer; text-decoration: underline;"
                  @click="openUserDocumentsDialog">Please verify if the following documents are valid.</div>
                <ul>
                  <li>Registration Form</li>
                  <li>Proof of Residential Address</li>
                  <li>South African Identity Document (ID) or Passport</li>
                  <li>Three Months' Bank Statements</li>
                  <!-- <li>Six Months' Bank Statements</li> -->
                  <li>Proof of Bursary (if applicable)</li>
                  <li>Check Credit Approval</li>
                </ul>
              </q-timeline-entry>

              <!-- Rental Approvals -->
              <q-timeline-entry v-if="rental.status === 'Pending'" title="Approve Rental" color="grey"
                icon="eva-briefcase-outline" side="left">
                <div class="q-mb-md"></div>
                <div @click="openRentalApprovalDialog" style="cursor: pointer; text-decoration: underline;">
                  Approve the rental information and desired lease period.
                </div>
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

          <q-inner-loading :showing="loading" color="primary" size="md" />
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="documentDialog" v-if="typeof rental?.userId === 'string' && rental.userId">
      <AdminDocumentApprovalComponent :userId="rental.userId" @close="handleDialogClose" />
    </q-dialog>

    <q-dialog v-model="rentalDialog">
      <AdminRentalApprovalComponent :rental="rental" @close="handleRentalDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import AdminDocumentApprovalComponent from 'src/components/admin/AdminDocumentApprovalComponent.vue';
import AdminRentalApprovalComponent from 'src/components/admin/AdminRentalApprovalComponent.vue';

export default {
  name: "AdminRentalDetails",

  data() {
    return {
      loading: true,
      rental: {},
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies posuere, nunc nunc',
      documentDialog: false,
      rentalDialog: false
    }
  },
  components: {
    CustomButton,
    AdminDocumentApprovalComponent,
    AdminRentalApprovalComponent
  },
  computed: {
    layout() {
      return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose');
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
  created() {
    this.fetchRentalDetails()
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    openRentalApprovalDialog() {
      this.rentalDialog = true;
    },
    handleRentalDialogClose() {
      this.rentalDialog = false;
      this.fetchRentalDetails()
    },
    openUserDocumentsDialog() {
      this.documentDialog = true;
    },
    handleDialogClose() {
      this.documentDialog = false;
      this.fetchRentalDetails()
    },
    async fetchRentalDetails() {
      this.loading = true;
      const encryptedId = this.$route.params.id;
      const decryptedBytes = AES.decrypt(decodeURIComponent(encryptedId), 'secret-key');
      const decryptedId = decryptedBytes.toString(Utf8);

      const response = await RentalService.findRentalById(decryptedId);

      const unit = await UnitService.getByIdUnit(response.unit);
      const user = await UserService.findUserById(response.user);

      this.rental = {
        ...response,

        unitNumber: unit.unitNumber,
        unitPrice: unit.unitPrice,
        unitType: unit.unitType,
        unitId: unit._id,

        userId: user._id,
        userUsername: user.username,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userEmail: user.email,
        userPhone: user.phone,
        userGender: user.gender,
        userAge: user.age,
        userDateCreated: user.dateCreated,
        userVerified: user.verification.isVerified,
        userDocuments: user.documents,

        userHasBursary: user.studentInfo.hasBursary,
        userRegistered: user.studentInfo.isRegisteredStudent,
      };
      this.loading = false;

      // console.log(this.rental.userDocuments)
    },
  }
}
</script>
