<template>
  <q-page>
    <q-parallax :src="parallax" :height="300" :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        " class="text-white text-center column justify-center items-center q-pa-xl">
        <q-card-section>
          <div class="text-h3 hero-heading">Residence Fees Schedule</div>
          <br />
          <div class="text-body1 q-mb-lg hero-subheading">
            We have various payment plans with discount offered for upfront payments, returning
            residents as well as siblings.
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center subBanner">
        <div class="text-h4">Get to Know The-WEB Fees</div>
      </div>
    </div>

    <q-card flat bordered style="height: 100%" class="q-pa-xl q-mx-md q-mt-md">
      <div class="constrain text-center">
        <div class="text-h5 text-weight-medium">Fee Structure</div>
        <br />

        <!-- Unit Costs Table -->
        <q-table class="q-mt-xl" :columns="[
          { name: 'type', label: '', field: 'type', align: 'left', style: 'border-right: 1px solid #ddd; width: 40%', headerStyle: 'background-color: #f5f5f5; font-weight: 600; white-space: normal; word-wrap: break-word;' },
          { name: 'annual', label: 'Annual Rental', field: 'annual', align: 'left', style: 'border-right: 1px solid #ddd; width: 15%', headerStyle: 'background-color: #f5f5f5; font-weight: 600; white-space: normal; word-wrap: break-word;' },
          { name: 'over10', label: '10 monthly instalments (monthly payment)', field: 'over10', align: 'left', style: 'border-right: 1px solid #ddd; width: 15%', headerStyle: 'background-color: #f5f5f5; font-weight: 600; white-space: normal; word-wrap: break-word;' },
          { name: 'over11', label: '11 monthly instalments (monthly payment)', field: 'over11', align: 'left', style: 'border-right: 1px solid #ddd; width: 15%', headerStyle: 'background-color: #f5f5f5; font-weight: 600; white-space: normal; word-wrap: break-word;' },
          { name: 'annually', label: 'Yearly payment (4% discount paid by 30 Nov)', field: 'annually', align: 'left', style: 'width: 15%', headerStyle: 'background-color: #f5f5f5; font-weight: 600; white-space: normal; word-wrap: break-word;' }
        ]" :rows="[
          { id: 1, type: 'Options', annual: '', over10: '', over11: '', annually: '' },

          { id: 2, type: 'Helshoogte', annual: 'R68 750', over10: 'R6 875', over11: 'R6 250', annually: 'R66 000' },
          { id: 3, type: 'Botmaskop', annual: 'R132 000', over10: 'R13 200', over11: 'R12 000', annually: 'R126 720' },
          { id: 4, type: 'Parking', annual: 'R4 950', over10: 'R495', over11: 'R450', annually: 'R4 752' },

          { id: 5, type: 'Deposit', annual: '', over10: '', over11: '', annually: '' },

          { id: 6, type: 'Helshoogte', annual: '', over10: 'R6 250', over11: 'R6 250', annually: 'R6 250' },
          { id: 7, type: 'Botmaskop', annual: '', over10: 'R12 000', over11: 'R12 000', annually: 'R12 000' },
          { id: 8, type: 'Application Fee (Non refundable)', annual: '', over10: 'R1 200', over11: 'R1 200', annually: 'R1 200' }
        ]" row-key="id" flat bordered hide-pagination :pagination="{ rowsPerPage: 0 }"
          style="max-width: 900px; margin: 0 auto">
          <!-- Table header title -->
          <template v-slot:top>
            <tr>
              <th id="unitCosts" colspan="5" style="text-align: center; font-size: 1.2rem" class="text-center">
                Repayment options
              </th>
            </tr>
          </template>
          <!-- Custom styling for Deposit row -->
          <template v-slot:body-cell-type="props">
            <q-td :props="props" :style="(props.row.type === 'Deposit' || props.row.type === 'Options')
              ? 'font-weight: bold; text-decoration: underline;'
              : ''">
              {{ props.value }}
            </q-td>
          </template>
        </q-table>


        <br />

        <div class="text-body2">
          Instalments payable through monthly debit orders (no cash payments)
        </div>


        <!-- Other Fees Table -->
        <!-- <q-table class="q-mt-xl" :columns="[
          { name: 'feeType', label: 'Fee Type', field: 'feeType', align: 'left', style: 'border-right: 1px solid #ddd; width: 70%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' },
          { name: 'amount', label: 'Amount', field: 'amount', align: 'right', style: 'width: 30%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' }
        ]" :rows="[
          { id: 1, feeType: 'Application Fee', amount: 'R1 200,00' },
          { id: 2, feeType: 'Parking per Month', amount: 'R495,00' }
        ]" row-key="id" flat bordered hide-pagination style="max-width: 700px; margin: 0 auto">
          <template v-slot:top>
            <tr>
              <th id="otherFees" colspan="2" style="text-align: center; font-size: 1.2rem">
                Other Fees
              </th>
            </tr>
          </template>
        </q-table> -->
      </div>
    </q-card>

    <!-- <q-card flat bordered style="height: 100%" class="q-pa-xl q-mx-md q-mt-md">
      <div class="constrain text-center">
        <div class="text-h5 text-weight-medium">Discounts</div>
        <br />

        <q-table class="q-mt-xl" :columns="[
          { name: 'category', label: 'Category', field: 'category', align: 'left', style: 'border-right: 1px solid #ddd; width: 40%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' },
          { name: 'conditions', label: 'Conditions', field: 'conditions', align: 'left', style: 'border-right: 1px solid #ddd; width: 35%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' },
          { name: 'deadline', label: 'Deadline', field: 'deadline', align: 'center', style: 'border-right: 1px solid #ddd; width: 10%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' },
          { name: 'discount', label: 'Discount', field: 'discount', align: 'center', style: 'width: 10%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' }
        ]" :rows="[
          { category: 'All Students', conditions: 'Full Payment & Application', deadline: '31 Oct 2025', discount: '3%' },
        ]" row-key="id" flat bordered hide-pagination style="max-width: 700px; margin: 0 auto">
          <template v-slot:top>
            <tr>
              <th id="discountOptions" colspan="5" style="text-align: center; font-size: 1.2rem">
                Discount Conditions
              </th>
            </tr>
          </template>
        </q-table>
      </div>
    </q-card>

    <q-card flat bordered style="height: 100%" class="q-card q-pa-xl q-mx-md q-mb-md q-mt-md">
      <div class="constrain text-center">
        <div class="text-h5 text-weight-medium">Payments</div>
        <br />

        <q-table class="q-mt-xl" :columns="[
          { name: 'payment', label: 'Payment', field: 'payment', align: 'left', style: 'border-right: 1px solid #ddd; width: 25%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' },
          { name: 'details', label: 'Details', field: 'details', align: 'left', style: 'width: 65%', headerStyle: 'background-color: #f5f5f5; font-weight: 600;' }
        ]" :rows="[
          { payment: 'Deposit', details: 'Months deposit due on booking' },
          { payment: 'Early Full Payment', details: 'Full payment by 31 October 2025 (3% Discount)' },
          { payment: 'Monthly Payments', details: 'Option to pay over 10/11 months for those who paying monthly' }
        ]" row-key="id" flat bordered hide-pagination style="max-width: 700px; margin: 0 auto">
          <template v-slot:top>
            <tr>
              <th id="paymentOptions" colspan="3" style="text-align: center; font-size: 1.2rem">
                Payment Options
              </th>
            </tr>
          </template>
        </q-table>
      </div>
    </q-card> -->



    <div style="height: 60px; background-color: white"></div>
  </q-page>
</template>

<script>
import home2 from 'src/assets/resources/home/slider/2.jpg';

export default {
  data() {
    return {
      parallax: home2
    };
  }
};
</script>

<style>
#unitCosts {
  text-align: center;
}
.q-table th {
  background-color: #f5f5f5;
  font-weight: 600;
  border-top: 1px solid #ddd;
}

.q-table__container {
  border-collapse: collapse;
}

.q-table th,
.q-table td {
  border-right: 1px solid #ddd;
}

.q-table th:last-child,
.q-table td:last-child {
  border-right: none;
}

/* media queries */

/* xs: Extra small (default for < 600px) */
@media screen and (max-width: 599.98px) {
  .q-card.q-pa-xl {
    padding: 1px 1px;
    border: none;
  }

  .text-h5 {
    font-size: 1rem;
    font-weight: 500;
    margin-top: 1rem;
  }

  #paymentOptions,
  #discountOptions {
    font-size: 0.9rem !important;
  }
}
</style>
