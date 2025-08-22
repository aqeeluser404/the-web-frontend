<template>
  <q-page>
    <q-parallax
      :src="parallax"
      :height="300"
      :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important"
    >
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        "
        class="text-white text-center column justify-center items-center q-pa-xl"
      >
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

    <!-- <div style="height: 60px; background-color: white"></div> -->

    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center subBanner">
        <div class="text-h4">Get to Know The-WEB Fees</div>
      </div>
    </div>

    <q-card flat bordered style="height: 100%" class="q-card q-pa-xl q-mx-md q-mb-md q-mt-md">
      <div class="constrain text-center">
        <div class="text-h5 text-weight-medium">Payments</div>
        <br />

        <!-- Payments Table -->
        <q-table
          class="q-mt-xl"
          :rows="paymentRows"
          :columns="paymentColumns"
          row-key="name"
          flat
          bordered
          hide-pagination
          style="max-width: 700px; margin: 0 auto"
        >
          <template v-slot:top>
            <tr>
              <th id="paymentOptions" colspan="3" style="text-align: center; font-size: 1.2rem">
                Payment Options
              </th>
            </tr>
          </template>
        </q-table>
      </div>
    </q-card>

    <q-card flat bordered style="height: 100%" class="q-pa-xl q-mx-md q-mt-md">
      <div class="constrain text-center">
        <div class="text-h5 text-weight-medium">Discounts</div>
        <br />

        <!-- Discounts Table -->
        <q-table
          class="q-mt-xl"
          :rows="discountRows"
          :columns="discountColumns"
          row-key="name"
          flat
          bordered
          hide-pagination
          style="max-width: 700px; margin: 0 auto"
        >
          <template v-slot:top>
            <tr>
              <th id="discountOptions" colspan="3" style="text-align: center; font-size: 1.2rem">
                Discount Conditions
              </th>
            </tr>
          </template>
        </q-table>
      </div>
    </q-card>
    <!-- <q-separator /> -->

    <div style="height: 60px; background-color: white"></div>
  </q-page>
</template>

<script>
import home2 from 'src/assets/resources/home/slider/2.jpg';

export default {
  data() {
    return {
      parallax: home2,
      discountColumns: [
        {
          name: 'category',
          align: 'left',
          label: '',
          field: 'category',
          style: 'border-right: 1px solid #ddd; width: 20%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
        {
          name: 'conditions',
          align: 'left',
          label: 'Conditions',
          field: 'conditions',
          style: 'border-right: 1px solid #ddd; width: 25%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
        {
          name: 'deadline',
          align: 'center',
          label: 'Deadline',
          field: 'deadline',
          style: 'border-right: 1px solid #ddd; width: 10%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
        {
          name: 'discount',
          align: 'center',
          label: 'Discount',
          field: 'discount',
          style: 'width: 5%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
      ],
      discountRows: [
        {
          category: 'All Students',
          conditions: 'Full Payment & Application',
          deadline: '31 Oct 2025',
          discount: '2.5%',
        },
        {
          category: 'Returning Students | 2nd year',
          conditions: 'First Payment & Application',
          deadline: '31 Oct 2025',
          discount: '2.5%',
        },
        {
          category: 'Returning Students | 3rd year & up',
          conditions: 'First Payment & Application',
          deadline: '31 Oct 2025',
          discount: '5%',
        },
        {
          category: 'Siblings | Previously or Current',
          conditions: 'First Payment & Application',
          deadline: '31 Oct 2025',
          discount: '2.5%',
        },
        { category: 'Maximum discount per student', conditions: '', deadline: '', discount: '5%' },
      ],
      paymentColumns: [
        {
          name: '#',
          align: 'left',
          label: '#',
          field: '#',
          style: 'border-right: 1px solid #ddd; width: 10%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
        {
          name: 'Payment Options',
          align: 'left',
          label: 'Payment',
          field: 'payment',
          style: 'border-right: 1px solid #ddd; width: 25%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
        {
          name: 'Details',
          align: 'left',
          label: 'Details',
          field: 'details',
          style: 'border-right: 1px solid #ddd; width: 25%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;',
        },
      ],
      paymentRows: [
        { '#': '1', payment: 'Deposit', details: 'Months deposit due on booking' },
        {
          '#': '2',
          payment: 'Early Full Payment',
          details: 'full payment by 31 October 2025 (5% Discount)',
        },
        {
          '#': '3',
          payment: 'Monthly Payments',
          details: 'Option to pay over 10/11 months for those who payning monthly',
        },
      ],
    }
  },
}
</script>

<style>

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
 .text-h5{
  font-size: 1rem;
  font-weight: 500;
  margin-top: 1rem;
}
#paymentOptions, #discountOptions {
  font-size: 0.9rem !important;
}
}

/* sm: Small (600px to < 1024px) */
@media screen and (min-width: 600px) and (max-width: 1023.98px) {
}

/* md: Medium (1024px to < 1440px) */
/* @media screen and (min-width: 1024px) and (max-width: 1439.98px) { */
/* styles for md */
/* } */

/* lg: Large (1440px to < 1920px) */
/* @media screen and (min-width: 1440px) and (max-width: 1919.98px) { */
/* styles for lg */
/* } */
</style>
