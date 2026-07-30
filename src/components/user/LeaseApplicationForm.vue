<template>
  <q-card style="min-width: 340px; max-width: 900px; width: 100%">

    <!-- ============================================================ -->
    <!-- PAGE 1 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement1.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p1Signature" />



      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 2 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement2.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p2Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 3 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement3.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p3Signature" />

        <!-- 1.1 - 1.10 -->
        <PDFInput v-model="propertyPractitioner.name" :top="85" :left="300" :width="250" />
        <PDFCheckbox v-model="propertyPractitioner.mandatoryDisclosureForm" :top="120" :left="340" type="tick"
          :val="true" />
        <PDFCheckbox v-model="propertyPractitioner.mandatoryDisclosureForm" :top="120" :left="400" type="tick"
          :val="false" />

        <PDFInput v-model="landlordInfo.name" :top="145" :left="300" :width="250" />
        <PDFInput v-model="landlordInfo.registrationNumber" :top="175" :left="427" :width="250" />
        <PDFInput v-model="landlordInfo.vatNumber" :top="205" :left="427" :width="250" />

        <!-- 1.3 - Tenant(s) -->
        <PDFInput v-model="tenantInfo.name" :top="260" :left="150" :width="150" />
        <PDFInput v-model="tenantInfo.registrationNumber" :top="320" :left="150" :width="150" />
        <PDFInput v-model="tenantInfo.vatNumber" :top="380" :left="150" :width="150" />
        <!-- Tenant 2 (if applicable) -->
        <PDFInput v-model="tenantInfo.tenant2Name" :top="260" :left="310" :width="150" />
        <PDFInput v-model="tenantInfo.tenant2Registration" :top="320" :left="310" :width="150" />
        <PDFInput v-model="tenantInfo.tenant2Vat" :top="380" :left="310" :width="150" />
        <!-- Tenant 3 (if applicable) -->
        <PDFInput v-model="tenantInfo.tenant3Name" :top="260" :left="470" :width="150" />
        <PDFInput v-model="tenantInfo.tenant3Registration" :top="320" :left="470" :width="150" />
        <PDFInput v-model="tenantInfo.tenant3Vat" :top="380" :left="470" :width="150" />

        <PDFInput v-model="premisesInfo.unitNumber" :top="450" :left="300" :width="120" />
        <PDFInput v-model="premisesInfo.buildingName" :top="450" :left="551" :width="120" />
        <PDFInput v-model="premisesInfo.streetNumber" :top="480" :left="300" :width="120" />
        <PDFInput v-model="premisesInfo.streetName" :top="480" :left="551" :width="120" />
        <PDFInput v-model="premisesInfo.suburb" :top="510" :left="300" :width="120" />
        <PDFInput v-model="premisesInfo.city" :top="510" :left="551" :width="120" />
        <PDFInput v-model="premisesInfo.province" :top="540" :left="300" :width="120" />
        <PDFInput v-model="premisesInfo.postalCode" :top="540" :left="551" :width="120" />

        <PDFInput v-model="parkingInfo.bayNumber" :top="570" :left="300" :width="425" />

        <PDFCheckbox v-model="smokingAllowed" :top="605" :left="340" type="tick" :val="true" />
        <PDFCheckbox v-model="smokingAllowed" :top="605" :left="400" type="tick" :val="false" />

        <PDFCheckbox v-model="petsInfo.petsAllowed" :top="635" :left="340" type="tick" :val="true" />
        <PDFCheckbox v-model="petsInfo.petsAllowed" :top="635" :left="400" type="tick" :val="false" />
        <PDFInput v-model="petsInfo.numberAndDetails" :top="630" :left="551" :width="150" />

        <PDFInput v-model="rentalInfo.amount" :top="690" :left="320" :width="200" />
        <PDFCheckbox v-model="rentalInfo.paymentMethod" :top="725" :left="388" type="checkbox" :val="'debit_order'" />
        <PDFCheckbox v-model="rentalInfo.paymentMethod" :top="725" :left="500" type="checkbox" :val="'bank_deposit'" />
        <PDFCheckbox v-model="rentalInfo.paymentMethod" :top="725" :left="700" type="checkbox" :val="'eft'" />

        <PDFInput v-model="depositInfo.amount" :top="757" :left="320" :width="90" />
        <PDFCheckbox v-model="depositInfo.heldBy" :top="757" :left="634" type="checkbox"
          :val="'property_practitioner'" />
        <PDFCheckbox v-model="depositInfo.heldBy" :top="757" :left="709" type="checkbox" :val="'landlord'" />

        <PDFCheckbox v-model="depositInfo.mustBePaidBeforeValid" :top="790" :left="500" type="tick" :val="true" />
        <PDFCheckbox v-model="depositInfo.mustBePaidBeforeValid" :top="790" :left="560" type="tick" :val="false" />

        <PDFInput v-model="fees.parking" :top="847" :left="320" :width="405" />
        <PDFInput v-model="fees.security" :top="877" :left="320" :width="405" />
        <PDFInput v-model="fees.cleaning" :top="907" :left="320" :width="405" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 4 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement4.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p4Signature" />

        <PDFInput v-model="fees.internet" :top="48" :left="320" :width="405" />

        <PDFInput v-model="additionalCharges.administrationFee" :top="84" :left="320" :width="405" />
        <PDFInput v-model="additionalCharges.creditCheckFee" :top="114" :left="320" :width="405" />
        <PDFInput v-model="additionalCharges.rentalEscalation" :top="144" :left="300" :width="70" />
        <PDFInput v-model="additionalCharges.inspectionFee" :top="174" :left="320" :width="405" />
        <PDFInput v-model="additionalCharges.surcharge" :top="203" :left="320" :width="405" />

        <PDFInput v-model="tenantBankAccount.accountHolder" :top="264" :left="320" :width="405" />
        <PDFInput v-model="tenantBankAccount.bank" :top="294" :left="320" :width="405" />
        <PDFInput v-model="tenantBankAccount.branch" :top="324" :left="320" :width="405" />
        <PDFInput v-model="tenantBankAccount.branchCode" :top="354" :left="320" :width="405" />
        <PDFInput v-model="tenantBankAccount.accountNumber" :top="383" :left="320" :width="405" />
        <PDFInput v-model="tenantBankAccount.reference" :top="414" :left="320" :width="405" />

        <PDFInput v-model="landlordBankAccount.accountHolder" :top="473" :left="320" :width="405" />
        <PDFInput v-model="landlordBankAccount.bank" :top="503" :left="320" :width="405" />
        <PDFInput v-model="landlordBankAccount.branch" :top="533" :left="320" :width="405" />
        <PDFInput v-model="landlordBankAccount.branchCode" :top="563" :left="320" :width="405" />
        <PDFInput v-model="landlordBankAccount.accountNumber" :top="593" :left="320" :width="405" />
        <PDFInput v-model="landlordBankAccount.reference" :top="623" :left="320" :width="405" />

        <PDFInput v-model="landlordContact.physicalAddress" :top="683" :left="320" :width="405" />
        <PDFInput v-model="landlordContact.postalAddress" :top="713" :left="320" :width="405" />
        <PDFInput v-model="landlordContact.homePhone" :top="743" :left="320" :width="405" />
        <PDFInput v-model="landlordContact.workPhone" :top="773" :left="320" :width="405" />
        <PDFInput v-model="landlordContact.cellPhone" :top="803" :left="320" :width="405" />
        <PDFInput v-model="landlordContact.email" :top="833" :left="320" :width="405" />

        <PDFInput v-model="tenantContact.physicalAddress" :top="893" :left="320" :width="405" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 5 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement5.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p5Signature" />

        <PDFInput v-model="tenantContact.postalAddress" :top="47" :left="320" :width="405" />
        <PDFInput v-model="tenantContact.homePhone" :top="77" :left="320" :width="405" />
        <PDFInput v-model="tenantContact.workPhone" :top="108" :left="320" :width="405" />
        <PDFInput v-model="tenantContact.cellPhone" :top="138" :left="320" :width="405" />
        <PDFInput v-model="tenantContact.email" :top="167" :left="320" :width="405" />

        <PDFInput v-model="practitionerContact.physicalAddress" :top="227" :left="320" :width="405" />
        <PDFInput v-model="practitionerContact.postalAddress" :top="257" :left="320" :width="405" />
        <PDFInput v-model="practitionerContact.homePhone" :top="287" :left="320" :width="405" />
        <PDFInput v-model="practitionerContact.workPhone" :top="317" :left="320" :width="405" />
        <PDFInput v-model="practitionerContact.cellPhone" :top="347" :left="320" :width="405" />
        <PDFInput v-model="practitionerContact.email" :top="377" :left="320" :width="405" />


        <PDFInput v-model="interestRate" :top="357" :left="80" :width="70" />
        <!-- <PDFInput v-model="initialPeriod.months" :top="397" :left="140" :width="70" />
        <PDFInput v-model="initialPeriod.effectiveDate" :top="427" :left="140" :width="150" />
        <PDFInput v-model="initialPeriod.terminationDate" :top="457" :left="140" :width="150" />
        <PDFInput v-model="financialBenefit.benefit" :top="507" :left="280" :width="405" />
        <PDFInput v-model="financialBenefit.keyReturnDate" :top="547" :left="280" :width="405" />
        <PDFInput v-model="occupantsInfo.maximumOccupants" :top="597" :left="200" :width="100" />
        <PDFInput v-model="occupantsInfo.permanentVehicles" :top="627" :left="200" :width="100" />
        <PDFInput v-model="occupantsInfo.occupantName" :top="657" :left="200" :width="405" />
        <PDFInput v-model="occupantsInfo.occupantIdNumber" :top="687" :left="200" :width="405" />
        <PDFInput v-model="occupantsInfo.alternativeAccommodation" :top="717" :left="200" :width="405" />
        <PDFInput v-model="cancellationPenalty.monthsRent" :top="767" :left="320" :width="70" />
        <PDFInput v-model="cancellationPenalty.maxMonths" :top="797" :left="320" :width="70" /> -->
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 6 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement6.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p6Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 7 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement7.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p7Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 8 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement8.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p8Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 9 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement9.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p9Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 10 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement10.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p10Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 11 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement11.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p11Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 12 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement12.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p12Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 13 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement13.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p13Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 14 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement14.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p14Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 15 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement15.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p15Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 16 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement16.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p16Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 17 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement17.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p17Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 18 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement18.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p18Signature" />
      </div>
    </div>

    <!-- ============================================================ -->
    <!-- PAGE 19 -->
    <!-- ============================================================ -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/LeaseAgreement19.jpg" />
        <PDFSignPad :top="940" :left="370" :width="325" :height="43" ref="p19Signature" />
      </div>
    </div>

    <q-card-actions class="row justify-between">
      <div>
        <q-btn color="secondary" label="Save Changes" icon="eva-save-outline" class="custom-button q-mr-sm"
          :loading="isSaving" @click="saveDraft" />
        <q-btn icon="eva-cloud-download-outline" color="secondary" @click="loadDraft" />
      </div>
      <div>
        <CustomButton label="Submit Form" color="primary" @click="generateSignedPdf" customStyle="width: 150px;"
          class="q-mr-sm" />
        <CustomButton label="Clear Signatures" color="primary" @click="clearSignatures" customStyle="width: 150px;"
          class="q-mr-sm" />
        <CustomButton label="Home" color="black" textColor="white" to="/" customStyle="width: 90px;" />
      </div>


    </q-card-actions>

    <!-- <q-card-section v-if="lastSaved" class="row justify-end text-caption text-grey-6 q-px-md">
      Last saved: {{ lastSaved.toLocaleTimeString() }}
    </q-card-section> -->
  </q-card>


</template>

<script>
import { PDFDocument, rgb } from 'pdf-lib'
import PDFInput from '../elements/PDFInput.vue';
import PDFCheckbox from '../elements/PDFCheckbox.vue';
import PDFSignPad from '../elements/PDFSignPad.vue';
import RentalService from 'src/services/RentalService.js';
import EmailService from 'src/services/EmailService.js';
import CustomButton from '../elements/CustomButton.vue';

export default {
  name: "LeaseApplicationForm",
  data() {
    return {
      docType: 'Signed And Filled Lease Form',
      draftId: null,
      isSaving: false,
      lastSaved: null,
      autoSaveInterval: null,

      file: null,

      // page 3 ============================================================
      // Section 1.1 - Property Practitioner
      propertyPractitioner: {
        name: '',
        mandatoryDisclosureForm: null, // Yes/No
      },

      // Section 1.2 - The Landlord
      landlordInfo: {
        name: '',
        registrationNumber: '',
        vatNumber: '',
      },

      // Section 1.3 - Tenant(s)
      tenantInfo: {
        name: '',
        registrationNumber: '',
        vatNumber: '',

        tenant2Name: '',
        tenant2Registration: '',
        tenant2Vat: '',

        tenant3Name: '',
        tenant3Registration: '',
        tenant3Vat: '',
      },

      // Section 1.4 - Description of Premises
      premisesInfo: {
        unitNumber: '',
        buildingName: '',
        streetNumber: '',
        streetName: '',
        suburb: '',
        city: '',
        province: '',
        postalCode: '',
      },

      // Section 1.5 - Parking
      parkingInfo: {
        bayNumber: '',
      },

      // Section 1.6 - Smoking
      smokingAllowed: null,

      // Section 1.7 - Pets
      petsInfo: {
        petsAllowed: null,
        numberAndDetails: ''
      },

      // Section 1.8 - Rental
      rentalInfo: {
        amount: '',
        paymentMethod: '', // 'debit_order', 'bank_deposit', 'eft'
      },

      // Section 1.9 - Deposit
      depositInfo: {
        amount: '',
        heldBy: '', // 'property_practitioner', 'landlord'
        mustBePaidBeforeValid: null,
      },

      // Section 1.10 - Fees
      fees: {
        parking: '',
        security: '',
        cleaning: '',
        internet: ''
      },

      // page 4 ============================================================

      // Section 1.11 - 1.15
      additionalCharges: {
        administrationFee: '',
        creditCheckFee: '',
        rentalEscalation: '',
        inspectionFee: '',
        surcharge: '',
      },

      // Section 1.16 - Tenant's Bank Account
      tenantBankAccount: {
        accountHolder: '',
        bank: '',
        branch: '',
        branchCode: '',
        accountNumber: '',
        reference: '',
      },

      // Section 1.17 - Landlord's Bank Account
      landlordBankAccount: {
        accountHolder: '',
        bank: '',
        branch: '',
        branchCode: '',
        accountNumber: '',
        reference: '',
      },

      // Section 1.18 - Landlord Contact Details
      landlordContact: {
        physicalAddress: '',
        postalAddress: '',
        homePhone: '',
        workPhone: '',
        cellPhone: '',
        email: '',
      },

      // Section 1.19 - Tenant Contact Details
      tenantContact: {
        physicalAddress: '',
        postalAddress: '',
        homePhone: '',
        workPhone: '',
        cellPhone: '',
        email: '',
      },

      // page 5 ============================================================

      // Section 1.20 - Property Practitioner Contact
      practitionerContact: {
        physicalAddress: '',
        postalAddress: '',
        homePhone: '',
        workPhone: '',
        cellPhone: '',
        email: '',
      },

      // Section 1.21 - Interest Rate (default 2%)
      interestRate: '2',

      // Section 1.22 - Initial Period
      initialPeriod: {
        months: '',
        effectiveDate: '',
        terminationDate: '',
      },

      // Section 1.25 - Financial Benefit (>24 Months)
      financialBenefit: {
        benefit: '',
        keyReturnDate: '',
      },

      // Section 1.26 - Occupants & Vehicles
      occupantsInfo: {
        maximumOccupants: '',
        permanentVehicles: '',
        occupantName: '',
        occupantIdNumber: '',
        alternativeAccommodation: '',
      },

      // Section 1.27 - Cancellation Penalty
      cancellationPenalty: {
        monthsRent: '',
      },

      // Section 1.28 - Sales Commission
      salesCommission: '',

      // Section 1.29 - Special Conditions
      specialConditions: '',

      // Signatures - Page 18-19
      signatures: {
        landlord: {
          place: '',
          date: '',
          signature: null,
          witness1: '',
          witness2: '',
        },
        tenant1: {
          place: '',
          date: '',
          signature: null,
          witness1: '',
          witness2: '',
        },
        tenant2: {
          place: '',
          date: '',
          signature: null,
          witness1: '',
          witness2: '',
        }
      }
    }
  },

  props: {
    user: {
      type: Object,
      required: true,
      default: () => ({})
    },
    pendingRental: {
      type: Object,
      default: null
    },
  },

  components: {
    PDFInput, PDFCheckbox, PDFSignPad, CustomButton
  },
  computed: {
    isFormComplete() { },

    missingFields() { },


  },
  methods: {
    handleYesNoToggle(field, value) {
      // If Yes is selected, set the field to true
      // If No is selected, set the field to false
      this[field] = value;
    },
    clearSignatures() { },

    handleCheckboxChange() { },

    async generateSignedPdf() {
      try {

      } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Failed to generate PDF. Please check console for details.')
      }
    },

    async addDocument(document) {
      const newFileName = `${this.user.firstName}_${this.user.lastName}_${this.docType}_document.pdf`;
      const formData = new FormData();

      formData.append('documents', document, newFileName);
      formData.append('type', this.docType);
      formData.append('label', this.docType);

      const response = await RentalService.uploadRentalDocs(this.user._id, formData);

      this.$q.notify({ type: 'positive', message: 'Application submitted successfully!' });
      this.draftId = null;
      this.lastSaved = null;

      setTimeout(() => {
        window.location.reload();
      }, 500);
    },

    async saveDraft() {
      if (this.isSaving) return;

      try {
        this.isSaving = true;

        // const signatures = {
        //   sig1: this.$refs.sig1?.getSignature() || null,
        //   sig2: this.$refs.sig2?.getSignature() || null,
        //   sig3Applicant: this.$refs.sig3Applicant?.getSignature() || null,
        //   sig4Witness1: this.$refs.sig4Witness1?.getSignature() || null,
        //   sig5Witness2: this.$refs.sig5Witness2?.getSignature() || null,
        //   sig6StudentOrGuardian: this.$refs.sig6StudentOrGuardian?.getSignature() || null
        // }

        // const draftData = {
        //   userId: this.user._id,
        //   rentalId: this.pendingRental?._id || null,
        //   studentInfo: this.studentInfo,
        //   parentInfo: this.parentInfo,
        //   paymentInfo: this.paymentInfo,
        //   signatureInfo1: this.signatureInfo1,
        //   signatureInfo2: this.signatureInfo2,
        //   prospectiveInfo: this.prospectiveInfo,
        //   signatures: signatures,
        //   file: this.file ? {
        //     name: this.file.name,
        //     size: this.file.size,
        //     type: this.file.type
        //   } : null
        // }
        const response = await DraftService.saveApplicationDraft(draftData);

        if (response.success) {
          this.draftId = response._id;
          this.lastSaved = new Date();
          this.$q.notify({
            type: 'positive',
            message: 'Draft saved successfully!'
          });
        }

      } catch (error) {
        console.error('Error saving draft:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to save draft.'
        });
      } finally {
        this.isSaving = false;
      }
    },
    async loadDraft() {

    },

    async restoreSignatures(signatures) {

    },

    loadSignatureToCanvas(signaturePad, dataUrl) {

    },

    // startAutoSave() {
    //   if (this.autoSaveInterval) {
    //     clearInterval(this.autoSaveInterval);
    //   }
    //   this.autoSaveInterval = setInterval(() => {
    //     if (this.user?._id) {
    //       this.saveDraft();
    //     }
    //   }, 60000);
    // },
    // stopAutoSave() {
    //   if (this.autoSaveInterval) {
    //     clearInterval(this.autoSaveInterval);
    //     this.autoSaveInterval = null;
    //   }
    // }
  },
  // mounted() {
  // //   this.studentInfo = {
  // //     studentNumber: 'S1234567',
  // //     title: 'Mr',
  // //     firstName: 'John',
  // //     surname: 'Doe',
  // //     dateOfBirth: '15/05/1995',
  // //     nationality: 'South African',
  // //     idNumber: '9505151234089',
  // //     passportNumber: 'A12345678',
  // //     maritalStatus: 'Single',
  // //     email: 'john.doe@email.com',
  // //     telephoneNumber: '0821234567',
  // //     residentialAddress: '123 Main Street, Cape Town',
  // //     postalAddress: 'PO Box 456, Cape Town, 8000',
  // //     theWeb: true,
  // //     helshoogte: false,
  // //     botmaskop: true
  // //   }
  // //   this.parentInfo = {
  // //     firstName: 'Mary',
  // //     surname: 'Doe',
  // //     phone: '0832345678',
  // //     fax: '0861234567',
  // //     email: 'mary.doe@email.com',
  // //     employersName: 'ABC Company',
  // //     employersAddress: '456 Business Park, Johannesburg',
  // //     occupation: 'Accountant',
  // //     monthlyIncome: 'R45,000',
  // //     periodEmployed: '5 years'
  // //   }
  // //   this.paymentInfo = {
  // //     firstName: 'John',
  // //     surname: 'Doe',
  // //     idNumber: '9505151234089',
  // //     phone: '0821234567',
  // //     email: 'john.doe@email.com',
  // //     telephoneNumber: '0211234567',
  // //     residentialAddress: '123 Main Street, Cape Town',
  // //     postalAddress: 'PO Box 456, Cape Town, 8000',
  // //     bank: 'ABSA',
  // //     bankName: 'ABSA Bank',
  // //     branchCode: '632005',
  // //     accountNumber: '1234567890',
  // //     typeOfAccount: 'Cheque'
  // //   }
  // //   this.signatureInfo1 = {
  // //     nameAndTitle: 'John Doe (Student)',
  // //     date: '25/06/2026',
  // //   }
  // //   this.signatureInfo2 = {
  // //     nameAndTitle: 'Mary Doe (Parent)',
  // //     date: '25/06/2026',
  // //   }
  // //   this.prospectiveInfo = {
  // //     prospectiveStudentName: 'John Doe Jr',
  // //     nameOfParentOrGuardian: 'Mary Doe',
  // //     dateAt: '25 June 2026',
  // //     onThis: '25',
  // //     dayOf: 'June',
  // //     year: '2026'
  // //   }

  //   // console.log(this.pendingRental)
  //   if (this.user?._id) {
  //     this.loadDraft();
  //     this.startAutoSave();
  //   }
  // },
  // beforeUnmount() {
  //   if (this.user?._id) {
  //     this.saveDraft();
  //   }
  //   this.stopAutoSave();
  // },
  // watch: {
  //   user: {
  //     immediate: true,
  //     handler(newUser) {
  //       if (newUser?._id) {
  //         this.loadDraft();
  //         this.startAutoSave();
  //       }
  //     }
  //   }
  // },
}

</script>

<style>
.pdf-container {
  width: 100%;
  overflow-x: auto;
}

.pdf-page {
  position: relative;
  width: 812px;
  margin: 0 auto;
  border: 1px solid black;
}

.pdf-page img {
  width: 100%;
  display: block;
}
</style>
