<template>
  <q-page>
    <q-parallax :src="parallax" :height="300" :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important;">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        " class="text-white text-center column justify-center items-center q-pa-xl">
        <q-card-section>
          <div class="text-h3">Residence Fees Schedule</div>
          <br>
          <div class="text-body1 q-mb-lg">
            We have various payment plans with discount offered for upfront payments, returning residents as well as
            siblings.
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 60px; background-color: white;"></div>
    <q-separator />

    <div style="height: 100%;" class="q-pa-xl">
      <div class="constrain-more">
        <div class="text-h4 text-center">PAYMENTS</div>
        <div class="text-h5 text-center q-mt-md">
          2025-2026
        </div>
        <br>
        <ul class="q-mb-lg">
          <li>Months deposit due on booking</li>
          <li>Full payment by 31 October 2025 (5% Discount)</li>
          <li>Option to pay over 10/11 months for those who payning monthly</li>
        </ul>
      </div>

    </div>

    <q-separator />

    <div style="height: 100%;" class="q-pa-xl">
      <div class="constrain text-center">
        <div class="text-h4">DISCOUNTS</div>
        <div class="text-h5 q-mt-md">
          Conditions & Deadlines
        </div>
        <br>

        <!-- Discounts Table -->
        <q-table class="q-mt-xl" :rows="discountRows" :columns="discountColumns" row-key="name" flat bordered
          hide-pagination style="max-width: 700px; margin: 0 auto;" />
      </div>
    </div>

    <q-separator />
    <div style="height: 60px; background-color: white;"></div>

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
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;'
        },
        {
          name: 'conditions',
          align: 'left',
          label: 'Conditions',
          field: 'conditions',
          style: 'border-right: 1px solid #ddd; width: 25%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;'
        },
        {
          name: 'deadline',
          align: 'center',
          label: 'Deadline',
          field: 'deadline',
          style: 'border-right: 1px solid #ddd; width: 10%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;'
        },
        {
          name: 'discount',
          align: 'center',
          label: 'Discount',
          field: 'discount',
          style: 'width: 5%',
          headerStyle: 'background-color: #f5f5f5; font-weight: 600;'
        }
      ],
      discountRows: [
        { category: 'All Students', conditions: 'Full Payment & Application', deadline: '31 Oct 2025', discount: '2.5%' },
        { category: 'Returning Students | 2nd year', conditions: 'First Payment & Application', deadline: '31 Oct 2025', discount: '2.5%' },
        { category: 'Returning Students | 3rd year & up', conditions: 'First Payment & Application', deadline: '31 Oct 2025', discount: '5%' },
        { category: 'Siblings | Previously or Current', conditions: 'First Payment & Application', deadline: '31 Oct 2025', discount: '2.5%' },
        { category: 'Maximum discount per student', conditions: '', deadline: '', discount: '5%' }
      ]
    }
  }
}
</script>

<style>
.q-table th {
  background-color: #f5f5f5;
  font-weight: 600;
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
</style>
