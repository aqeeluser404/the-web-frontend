<template>
  <q-card style="min-width: 340px; max-width: 900px; width: 100%">

    <!-- Page 1 -->
    <div class="pdf-container">
      <div class="pdf-page">
        <img src="/files/digitalForms/CreditCheckApproval1.png" />

        <!-- student info -->
        <PDFInput v-model="studentInfo.studentNumber" :top="159" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.title" :top="183" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.firstName" :top="206" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.surname" :top="229" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.dateOfBirth" :top="252" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.nationality" :top="280" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.idNumber" :top="310" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.passportNumber" :top="333" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.maritalStatus" :top="356" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.email" :top="379" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.telephoneNumber" :top="403" :left="230" :width="150" />
        <PDFInput v-model="studentInfo.residentialAddress" :top="426" :left="230" :width="463" />
        <PDFInput v-model="studentInfo.postalAddress" :top="449" :left="230" :width="463" />

        <PDFCheckbox v-model="studentInfo.theWeb" :top="187" :left="409" type="tick"
          @update:modelValue="handleCheckboxChange('theWeb', $event)" />

        <PDFCheckbox v-model="studentInfo.helshoogte" :top="233" :left="409" type="tick"
          @update:modelValue="handleCheckboxChange('helshoogte', $event)" />

        <PDFCheckbox v-model="studentInfo.botmaskop" :top="276" :left="409" type="tick"
          @update:modelValue="handleCheckboxChange('botmaskop', $event)" />

        <!-- parent guardian info -->
        <PDFInput v-model="parentInfo.firstName" :top="495" :left="230" :width="150" />
        <PDFInput v-model="parentInfo.surname" :top="519" :left="230" :width="150" />
        <PDFInput v-model="parentInfo.phone" :top="542" :left="230" :width="150" />
        <PDFInput v-model="parentInfo.fax" :top="565" :left="230" :width="150" />
        <PDFInput v-model="parentInfo.email" :top="589" :left="230" :width="150" />

        <PDFInput v-model="parentInfo.employersName" :top="496" :left="590" :width="150" />
        <PDFInput v-model="parentInfo.employersAddress" :top="519" :left="590" :width="150" />
        <PDFInput v-model="parentInfo.occupation" :top="542" :left="590" :width="150" />
        <PDFInput v-model="parentInfo.monthlyIncome" :top="565" :left="590" :width="150" />
        <PDFInput v-model="parentInfo.periodEmployed" :top="589" :left="590" :width="150" />

        <!-- personal responsible for payment -->
        <PDFInput v-model="paymentInfo.firstName" :top="636" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.surname" :top="660" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.idNumber" :top="682" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.phone" :top="705" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.email" :top="729" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.telephoneNumber" :top="753" :left="230" :width="150" />
        <PDFInput v-model="paymentInfo.residentialAddress" :top="776" :left="230" :width="463" />
        <PDFInput v-model="paymentInfo.postalAddress" :top="800" :left="230" :width="463" />

        <PDFInput v-model="paymentInfo.bank" :top="636" :left="590" :width="150" />
        <PDFInput v-model="paymentInfo.bankName" :top="660" :left="590" :width="150" />
        <PDFInput v-model="paymentInfo.branchCode" :top="682" :left="590" :width="150" />
        <PDFInput v-model="paymentInfo.accountNumber" :top="705" :left="590" :width="150" />
        <PDFInput v-model="paymentInfo.typeOfAccount" :top="729" :left="590" :width="150" />
      </div>

      <!-- Page 2 -->
      <div class="pdf-page">
        <img src="/files/digitalForms/CreditCheckApproval2.png" />

        <!-- Signature section -->
        <PDFSignPad :top="169" :left="157" :width="249" :height="38" ref="sig1" />
        <PDFInput v-model="signatureInfo1.nameAndTitle" :top="209" :left="157" :width="218" />
        <PDFInput v-model="signatureInfo1.date" :top="233" :left="157" :width="218" />

        <PDFSignPad :top="169" :left="517" :width="249" :height="38" ref="sig2" />
        <PDFInput v-model="signatureInfo2.nameAndTitle" :top="209" :left="517" :width="218" />
        <PDFInput v-model="signatureInfo2.date" :top="232" :left="517" :width="218" />

        <!-- prospective section -->
        <PDFInput v-model="prospectiveInfo.prospectiveStudentName" :top="288" :left="245" :width="290" />
        <PDFSignPad :top="682" :left="180" :width="430" :height="30" ref="sig3Applicant" />
        <PDFInput v-model="prospectiveInfo.nameOfParentOrGuardian" :top="730" :left="210" :width="348" />

        <PDFSignPad :top="780" :left="103" :width="150" :height="25" ref="sig4Witness1" />
        <PDFSignPad :top="780" :left="303" :width="150" :height="25" ref="sig5Witness2" />

        <PDFInput v-model="prospectiveInfo.dateAt" :top="823" :left="95" :width="180" />
        <PDFInput v-model="prospectiveInfo.onThis" :top="823" :left="322" :width="46" />
        <PDFInput v-model="prospectiveInfo.dayOf" :top="823" :left="405" :width="88" />
        <PDFInput v-model="prospectiveInfo.year" :top="823" :left="525" :width="25" />

        <PDFSignPad :top="905" :left="50" :width="440" :height="25" ref="sig6StudentOrGuardian" />
      </div>

      <q-card-actions class="row justify-between">
        <div>
          <q-btn color="secondary" label="Save Changes" icon="eva-save-outline" class="custom-button q-mr-sm"
            :loading="isSaving" @click="saveDraft" />
          <q-btn icon="eva-cloud-download-outline" color="secondary" @click="loadDraft" />
        </div>
        <div>
          <CustomButton label="Submit Form" :disabled="!isFormComplete" color="primary" @click="generateSignedPdf"
            customStyle="width: 150px;" class="q-mr-sm" />
          <CustomButton label="Clear Signatures" color="primary" @click="clearSignatures" customStyle="width: 150px;"
            class="q-mr-sm" />
          <CustomButton label="Home" color="black" textColor="white" to="/" customStyle="width: 90px;" />
        </div>


      </q-card-actions>

      <q-card-section v-if="lastSaved" class="row justify-end text-caption text-grey-6 q-px-md">
        Last saved: {{ lastSaved.toLocaleTimeString() }}
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { PDFDocument, rgb } from 'pdf-lib'
import PDFInput from '../elements/PDFInput.vue';
import PDFCheckbox from '../elements/PDFCheckbox.vue';
import PDFSignPad from '../elements/PDFSignPad.vue';
import RentalService from 'src/services/api/RentalService';
import EmailService from 'src/services/api/EmailService';
import DraftService from 'src/services/api/DraftService.js';

import CustomButton from '../elements/CustomButton.vue';

export default {
  name: 'DigitalApplicationForm',
  data() {
    return {
      docType: 'Signed And Filled Application Form',
      draftId: null,
      isSaving: false,
      lastSaved: null,
      autoSaveInterval: null,

      file: null,
      studentInfo: {
        studentNumber: '', title: '', firstName: '', surname: '', dateOfBirth: '', nationality: '', idNumber: '', passportNumber: '', maritalStatus: '', email: '', telephoneNumber: '', residentialAddress: '', postalAddress: '',
        theWeb: true, helshoogte: false, botmaskop: false
      },
      parentInfo: {
        firstName: '', surname: '', phone: '', fax: '', email: '',
        employersName: '', employersAddress: '', occupation: '', monthlyIncome: '', periodEmployed: ''
      },
      paymentInfo: {
        firstName: '', surname: '', idNumber: '', phone: '', email: '', telephoneNumber: '', residentialAddress: '', postalAddress: '',
        bank: '', bankName: '', branchCode: '', accountNumber: '', typeOfAccount: ''
      },
      signatureInfo1: {
        nameAndTitle: '', date: '',
      },
      signatureInfo2: {
        nameAndTitle: '', date: '',
      },
      prospectiveInfo: {
        prospectiveStudentName: '',
        nameOfParentOrGuardian: '',
        dateAt: '', onThis: '', dayOf: '', year: ''
      },

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

    isFormComplete() {
      // Student Info - Required fields
      const requiredStudentFields = [
        'studentNumber', 'firstName', 'surname', 'dateOfBirth',
        'nationality', 'idNumber', 'email', 'telephoneNumber'
      ];

      const studentComplete = requiredStudentFields.every(field =>
        this.studentInfo[field] && this.studentInfo[field].trim() !== ''
      );

      // Parent Info - Required fields
      const requiredParentFields = [
        'firstName', 'surname', 'phone', 'email'
      ];

      const parentComplete = requiredParentFields.every(field =>
        this.parentInfo[field] && this.parentInfo[field].trim() !== ''
      );

      // Payment Info - Required fields
      const requiredPaymentFields = [
        'firstName', 'surname', 'idNumber', 'phone', 'email'
      ];

      const paymentComplete = requiredPaymentFields.every(field =>
        this.paymentInfo[field] && this.paymentInfo[field].trim() !== ''
      );

      // Signature Info - Must have signatures
      const hasSignatures =
        this.$refs.sig1?.getSignature() &&
        this.$refs.sig2?.getSignature() &&
        this.$refs.sig3Applicant?.getSignature() &&
        this.$refs.sig6StudentOrGuardian?.getSignature();

      // Prospective Info - Required fields
      const requiredProspectiveFields = [
        'prospectiveStudentName', 'nameOfParentOrGuardian', 'dateAt'
      ];

      const prospectiveComplete = requiredProspectiveFields.every(field =>
        this.prospectiveInfo[field] && this.prospectiveInfo[field].trim() !== ''
      );

      return studentComplete && parentComplete && paymentComplete &&
        prospectiveComplete && hasSignatures;
    },

    // Get missing fields for debug/display
    missingFields() {
      const missing = [];

      const requiredStudentFields = [
        'studentNumber', 'firstName', 'surname', 'dateOfBirth',
        'nationality', 'idNumber', 'email', 'telephoneNumber'
      ];

      requiredStudentFields.forEach(field => {
        if (!this.studentInfo[field] || this.studentInfo[field].trim() === '') {
          missing.push(`Student: ${field}`);
        }
      });

      const requiredParentFields = ['firstName', 'surname', 'phone', 'email'];
      requiredParentFields.forEach(field => {
        if (!this.parentInfo[field] || this.parentInfo[field].trim() === '') {
          missing.push(`Parent: ${field}`);
        }
      });

      const requiredPaymentFields = ['firstName', 'surname', 'idNumber', 'phone', 'email'];
      requiredPaymentFields.forEach(field => {
        if (!this.paymentInfo[field] || this.paymentInfo[field].trim() === '') {
          missing.push(`Payment: ${field}`);
        }
      });

      const requiredProspectiveFields = ['prospectiveStudentName', 'nameOfParentOrGuardian', 'dateAt'];
      requiredProspectiveFields.forEach(field => {
        if (!this.prospectiveInfo[field] || this.prospectiveInfo[field].trim() === '') {
          missing.push(`Prospective: ${field}`);
        }
      });

      if (!this.$refs.sig1?.getSignature()) missing.push('Signature 1');
      if (!this.$refs.sig2?.getSignature()) missing.push('Signature 2');
      if (!this.$refs.sig3Applicant?.getSignature()) missing.push('Applicant Signature');
      if (!this.$refs.sig6StudentOrGuardian?.getSignature()) missing.push('Student/Guardian Signature');

      return missing;
    },
  },
  methods: {
    clearSignatures() {
      this.$refs.sig1?.clear();
      this.$refs.sig2?.clear();
      this.$refs.sig3Applicant?.clear();
      this.$refs.sig4Witness1?.clear();
      this.$refs.sig5Witness2?.clear();
      this.$refs.sig6StudentOrGuardian?.clear();
    },
    handleCheckboxChange(selectedOption, isChecked) {
      if (selectedOption === 'theWeb' && !isChecked) {
        this.studentInfo.theWeb = true;
        return;
      }
      if (selectedOption === 'helshoogte' || selectedOption === 'botmaskop') {
        if (selectedOption === 'helshoogte') {
          this.studentInfo.botmaskop = false;
        } else {
          this.studentInfo.helshoogte = false;
        }
      }
    },
    async generateSignedPdf() {
      try {
        const existingPdfBytes = await fetch('/files/digitalForms/CreditCheckApproval.pdf').then(res => res.arrayBuffer())
        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const pages = pdfDoc.getPages()

        const { width: pdfWidth, height: pdfHeight } = pages[0].getSize()
        const { width: pdfWidth1, height: pdfHeight1 } = pages[1].getSize()

        const imageWidth = 812
        const imageHeight = 1052

        // Calculate scale to map image coordinates to PDF coordinates
        const scaleX = pdfWidth / imageWidth
        const scaleY = pdfHeight / imageHeight
        const scaleX1 = pdfWidth1 / imageWidth
        const scaleY1 = pdfHeight1 / imageHeight

        // console.log('Scale X:', scaleX, 'Scale Y:', scaleY)

        const OFFSET_X = 0   // Positive moves right, negative moves left
        const OFFSET_Y = 8   // Positive moves down, negative moves up
        const PAGE1_OFFSET_X = 0  // Separate offset for page 1 if needed
        const PAGE1_OFFSET_Y = 0  // Separate offset for page 1 if needed

        const toPdf = (x, y) => ({
          x: (x * scaleX) + OFFSET_X,
          y: pdfHeight - (y * scaleY) - OFFSET_Y
        })

        const toPdf1 = (x, y) => ({
          x: (x * scaleX1) + OFFSET_X + PAGE1_OFFSET_X,
          y: pdfHeight1 - (y * scaleY1) - OFFSET_Y - PAGE1_OFFSET_Y
        })

        // === PAGE 1 ===

        // Student Info
        const studentFields = {
          studentNumber: { x: 230, y: 159 },
          title: { x: 230, y: 183 },
          firstName: { x: 230, y: 206 },
          surname: { x: 230, y: 229 },
          dateOfBirth: { x: 230, y: 252 },
          nationality: { x: 230, y: 280 },
          idNumber: { x: 230, y: 310 },
          passportNumber: { x: 230, y: 333 },
          maritalStatus: { x: 230, y: 356 },
          email: { x: 230, y: 379 },
          telephoneNumber: { x: 230, y: 403 },
          residentialAddress: { x: 230, y: 426 },
          postalAddress: { x: 230, y: 449 }
        }
        for (const [key, coords] of Object.entries(studentFields)) {
          const value = this.studentInfo[key] || ''
          const pdfPos = toPdf(coords.x, coords.y)
          pages[0].drawText(value, {
            x: pdfPos.x,
            y: pdfPos.y,
            size: 10 * scaleY,
            color: rgb(0, 0, 0)
          })
        }
        // Checkboxes
        const checkboxFields = {
          theWeb: { x: 409, y: 177 },
          helshoogte: { x: 409, y: 223 },
          botmaskop: { x: 409, y: 264 }
        }
        for (const [key, coords] of Object.entries(checkboxFields)) {
          if (this.studentInfo[key]) {
            const pdfPos = toPdf(coords.x, coords.y)
            pages[0].drawText('X', {
              x: pdfPos.x,
              y: pdfPos.y - (10 * scaleY),
              size: 12 * scaleY,
              color: rgb(0, 0, 0)
            })
          }
        }
        // Parent/Guardian Info
        const parentFields = {
          firstName: { x: 230, y: 495 },
          surname: { x: 230, y: 519 },
          phone: { x: 230, y: 542 },
          fax: { x: 230, y: 565 },
          email: { x: 230, y: 589 },
          employersName: { x: 590, y: 496 },
          employersAddress: { x: 590, y: 519 },
          occupation: { x: 590, y: 542 },
          monthlyIncome: { x: 590, y: 565 },
          periodEmployed: { x: 590, y: 589 }
        }
        for (const [key, coords] of Object.entries(parentFields)) {
          const value = this.parentInfo[key] || ''
          const pdfPos = toPdf(coords.x, coords.y)
          pages[0].drawText(value, {
            x: pdfPos.x,
            y: pdfPos.y,
            size: 10 * scaleY,
            color: rgb(0, 0, 0)
          })
        }
        // Payment Info
        const paymentFields = {
          firstName: { x: 230, y: 636 },
          surname: { x: 230, y: 660 },
          idNumber: { x: 230, y: 682 },
          phone: { x: 230, y: 705 },
          email: { x: 230, y: 729 },
          telephoneNumber: { x: 230, y: 753 },
          residentialAddress: { x: 230, y: 776 },
          postalAddress: { x: 230, y: 800 },
          bank: { x: 590, y: 636 },
          bankName: { x: 590, y: 660 },
          branchCode: { x: 590, y: 682 },
          accountNumber: { x: 590, y: 705 },
          typeOfAccount: { x: 590, y: 729 }
        }
        for (const [key, coords] of Object.entries(paymentFields)) {
          const value = this.paymentInfo[key] || ''
          const pdfPos = toPdf(coords.x, coords.y)
          pages[0].drawText(value, {
            x: pdfPos.x,
            y: pdfPos.y,
            size: 10 * scaleY,
            color: rgb(0, 0, 0)
          })
        }

        // === PAGE 2 ===

        // Signature Info 1
        let pdfPos = toPdf1(157, 209)
        pages[1].drawText(this.signatureInfo1.nameAndTitle || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(157, 233)
        pages[1].drawText(this.signatureInfo1.date || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        // Signature Info 2
        pdfPos = toPdf1(517, 209)
        pages[1].drawText(this.signatureInfo2.nameAndTitle || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(517, 232)
        pages[1].drawText(this.signatureInfo2.date || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        // Prospective Info
        pdfPos = toPdf1(245, 288)
        pages[1].drawText(this.prospectiveInfo.prospectiveStudentName || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(210, 730)
        pages[1].drawText(this.prospectiveInfo.nameOfParentOrGuardian || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        // Date fields
        pdfPos = toPdf1(95, 823)
        pages[1].drawText(this.prospectiveInfo.dateAt || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(322, 823)
        pages[1].drawText(this.prospectiveInfo.onThis || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(405, 823)
        pages[1].drawText(this.prospectiveInfo.dayOf || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        pdfPos = toPdf1(525, 823)
        pages[1].drawText(this.prospectiveInfo.year || '', {
          x: pdfPos.x,
          y: pdfPos.y,
          size: 10 * scaleY1,
          color: rgb(0, 0, 0)
        })
        // === SIGNATURES ===
        const signatures = [
          { ref: this.$refs.sig1, x: 157, y: 159, width: 249, height: 38 },
          { ref: this.$refs.sig2, x: 517, y: 159, width: 249, height: 38 },
          { ref: this.$refs.sig3Applicant, x: 180, y: 672, width: 430, height: 30 },
          { ref: this.$refs.sig4Witness1, x: 103, y: 770, width: 150, height: 25 },
          { ref: this.$refs.sig5Witness2, x: 303, y: 770, width: 150, height: 25 },
          { ref: this.$refs.sig6StudentOrGuardian, x: 50, y: 895, width: 440, height: 25 }
        ]
        for (const sig of signatures) {
          if (sig.ref) {
            const sigDataUrl = sig.ref.getSignature()
            if (sigDataUrl) {
              try {
                const sigImage = await pdfDoc.embedPng(sigDataUrl)
                pdfPos = toPdf1(sig.x, sig.y)
                pages[1].drawImage(sigImage, {
                  x: pdfPos.x,
                  y: pdfPos.y - (sig.height * scaleY1),
                  width: sig.width * scaleX1,
                  height: sig.height * scaleY1
                })
              } catch (error) {
                console.warn('Failed to embed signature:', error)
              }
            }
          }
        }
        // Save and download
        const pdfBytes = await pdfDoc.save()

        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = 'ApplicationForm_signed.pdf'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(link.href)

        this.file = new File([pdfBytes], 'ApplicationForm_signed.pdf', { type: 'application/pdf' })
        await this.addDocument(this.file)
      } catch (error) {
        console.error('Error generating PDF:', error)
        alert('Failed to generate PDF. Please check console for details.')
      }
    },
    async addDocument(document) {
      const newFileName = `${this.user.firstName}_${this.user.lastName}_${this.docType}_document.pdf`;
      const formData = new FormData()

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

    hasDocumentInRental() {
      if (!this.pendingRental) return false;

      return this.pendingRental.documents &&
            Array.isArray(this.pendingRental.documents) &&
            this.pendingRental.documents.length > 0;
    },

    async saveDraft() {
      if (this.isSaving) return;

      if (!this.pendingRental || this.pendingRental.status !== 'Pending') {
        // this.$q.notify({
        //   type: 'warning',
        //   message: 'No pending rental found. Cannot save draft.'
        // });
        return;
      }

      if (this.file) {
        // console.log('Skipping draft save - document already generated');
        // this.$q.notify({
        //   type: 'warning',
        //   message: 'Document already generated. Draft cannot be saved.'
        // });
        return;
      }
      if (this.hasDocumentInRental()) {
        // console.log('Skipping draft save - document already in rental');
        // this.$q.notify({
        //   type: 'warning',
        //   message: 'Document already submitted. Draft cannot be saved.'
        // });
        return;
      }

      try {
        this.isSaving = true;

        const signatures = {
          sig1: this.$refs.sig1?.getSignature() || null,
          sig2: this.$refs.sig2?.getSignature() || null,
          sig3Applicant: this.$refs.sig3Applicant?.getSignature() || null,
          sig4Witness1: this.$refs.sig4Witness1?.getSignature() || null,
          sig5Witness2: this.$refs.sig5Witness2?.getSignature() || null,
          sig6StudentOrGuardian: this.$refs.sig6StudentOrGuardian?.getSignature() || null
        }

        const draftData = {
          userId: this.user._id,
          rentalId: this.pendingRental?._id || null,
          studentInfo: this.studentInfo,
          parentInfo: this.parentInfo,
          paymentInfo: this.paymentInfo,
          signatureInfo1: this.signatureInfo1,
          signatureInfo2: this.signatureInfo2,
          prospectiveInfo: this.prospectiveInfo,
          signatures: signatures,
          file: this.file ? {
            name: this.file.name,
            size: this.file.size,
            type: this.file.type
          } : null
        }
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
      try {
        if (!this.user || !this.user._id) {
          console.log('No user found, skipping draft load');
          return;
        }

        const userId = this.user._id;

        const draft = await DraftService.getApplicationDraft(userId);

        if (draft) {
          this.studentInfo = { ...this.studentInfo, ...draft.studentInfo };
          this.parentInfo = { ...this.parentInfo, ...draft.parentInfo };
          this.paymentInfo = { ...this.paymentInfo, ...draft.paymentInfo };
          this.signatureInfo1 = { ...this.signatureInfo1, ...draft.signatureInfo1 };
          this.signatureInfo2 = { ...this.signatureInfo2, ...draft.signatureInfo2 };
          this.prospectiveInfo = { ...this.prospectiveInfo, ...draft.prospectiveInfo };
          this.draftId = draft._id;
          this.lastSaved = draft.updatedAt ? new Date(draft.updatedAt) : new Date();

          if (draft.signatures) {
            await this.restoreSignatures(draft.signatures);
          }

          this.$q.notify({
            type: 'info',
            color: 'primary',
            message: 'Draft loaded successfully!'
          });
        }
      }
      catch (error) {
        console.error('Error loading draft:', error);
      }
    },

    async restoreSignatures(signatures) {
      const sigMap = {
        sig1: this.$refs.sig1,
        sig2: this.$refs.sig2,
        sig3Applicant: this.$refs.sig3Applicant,
        sig4Witness1: this.$refs.sig4Witness1,
        sig5Witness2: this.$refs.sig5Witness2,
        sig6StudentOrGuardian: this.$refs.sig6StudentOrGuardian
      };

      for (const [refName, sigData] of Object.entries(signatures)) {
        if (sigData && sigMap[refName]) {
          await this.loadSignatureToCanvas(sigMap[refName], sigData);
        }
      }
    },

    loadSignatureToCanvas(signaturePad, dataUrl) {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          const canvas = signaturePad.$refs.sigPad;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve();
        };
        img.onerror = () => {
          console.warn('Failed to load signature for:', signaturePad);
          resolve(); // Still resolve so the app doesn't break
        };
        img.src = dataUrl;
      });
    },



    startAutoSave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
      }
      this.autoSaveInterval = setInterval(() => {
        if (this.user?._id) {
          this.saveDraft();
        }
      }, 60000);
    },
    stopAutoSave() {
      if (this.autoSaveInterval) {
        clearInterval(this.autoSaveInterval);
        this.autoSaveInterval = null;
      }
    }
  },
  mounted() {

  //   this.studentInfo = {
  //     studentNumber: 'S1234567',
  //     title: 'Mr',
  //     firstName: 'John',
  //     surname: 'Doe',
  //     dateOfBirth: '15/05/1995',
  //     nationality: 'South African',
  //     idNumber: '9505151234089',
  //     passportNumber: 'A12345678',
  //     maritalStatus: 'Single',
  //     email: 'john.doe@email.com',
  //     telephoneNumber: '0821234567',
  //     residentialAddress: '123 Main Street, Cape Town',
  //     postalAddress: 'PO Box 456, Cape Town, 8000',
  //     theWeb: true,
  //     helshoogte: false,
  //     botmaskop: true
  //   }
  //   this.parentInfo = {
  //     firstName: 'Mary',
  //     surname: 'Doe',
  //     phone: '0832345678',
  //     fax: '0861234567',
  //     email: 'mary.doe@email.com',
  //     employersName: 'ABC Company',
  //     employersAddress: '456 Business Park, Johannesburg',
  //     occupation: 'Accountant',
  //     monthlyIncome: 'R45,000',
  //     periodEmployed: '5 years'
  //   }
  //   this.paymentInfo = {
  //     firstName: 'John',
  //     surname: 'Doe',
  //     idNumber: '9505151234089',
  //     phone: '0821234567',
  //     email: 'john.doe@email.com',
  //     telephoneNumber: '0211234567',
  //     residentialAddress: '123 Main Street, Cape Town',
  //     postalAddress: 'PO Box 456, Cape Town, 8000',
  //     bank: 'ABSA',
  //     bankName: 'ABSA Bank',
  //     branchCode: '632005',
  //     accountNumber: '1234567890',
  //     typeOfAccount: 'Cheque'
  //   }
  //   this.signatureInfo1 = {
  //     nameAndTitle: 'John Doe (Student)',
  //     date: '25/06/2026',
  //   }
  //   this.signatureInfo2 = {
  //     nameAndTitle: 'Mary Doe (Parent)',
  //     date: '25/06/2026',
  //   }
  //   this.prospectiveInfo = {
  //     prospectiveStudentName: 'John Doe Jr',
  //     nameOfParentOrGuardian: 'Mary Doe',
  //     dateAt: '25 June 2026',
  //     onThis: '25',
  //     dayOf: 'June',
  //     year: '2026'
  //   }

    // console.log(this.pendingRental)
    if (this.user?._id) {
      this.loadDraft();
      this.startAutoSave();
    }
  },
  beforeUnmount() {
    if (this.user?._id) {
      this.saveDraft();
    }
    this.stopAutoSave();
  },
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser?._id) {
          this.loadDraft();
          this.startAutoSave();
        }
      }
    }
  },
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
}

.pdf-page img {
  width: 100%;
  display: block;
}
</style>
