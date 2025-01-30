<template>
  <q-page>
    Users
  </q-page>
</template>

<script>
import UserService from 'src/services/UserService';

export default {
  name: "AdminUsersCard",

  data() {
    return {
      users: []
    }
  },
  methods: {
    async findALlUsers() {
      this.users = await UserService.findAllUsers()
      console.log(this.users)
    }
  },
  created() {
    this.findALlUsers()
  }
}
</script>
