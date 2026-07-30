import axiosInstance from "src/services/axiosInstance";
import EmailService from "./EmailService";

class JotformService {
  static async sendSigningLinks(tenant, rentalId) {
    try {
      const payload = {
        tenant: {
          _id: tenant._id,
          firstName: tenant.firstName,
          lastName: tenant.lastName,
          email: tenant.email
        },
        rentalId: rentalId,
        agentEmail: 'admin@the-web.co.za',
        ownerEmail: 'aqeelhanslo@gmail.com'
      };

      console.log('Sending to backend:', JSON.stringify(payload, null, 2));

      const jotformResponse = await axiosInstance.post('/jotform/create-session', payload);

      console.log('Backend response:', jotformResponse.data);

      if (!jotformResponse.data.success) {
        throw new Error('Failed to create Jotform session');
      }

      // Tenant
      const tenantLink = jotformResponse.data.tenantLink;
      await EmailService.sendLeaseSigningLink({
        to: tenant.email,
        name: tenant.firstName,
        link: tenantLink,
        rentalId: rentalId,
        role: 'Tenant'
      });

      // agent
      const agentEmail = 'admin@the-web.co.za';
      if (agentEmail) {
        const agentLink = jotformResponse.data.agentLink || tenantLink;

        await EmailService.sendLeaseSigningLink({
          to: agentEmail,
          name: 'Agent',
          link: agentLink,
          rentalId: rentalId,
          role: 'Agent'
        });
      }

      const ownerEmail = 'aqeelhanslo@gmail.com';
      if (ownerEmail) {
        const ownerLink = jotformResponse.data.ownerLink || tenantLink;
        await EmailService.sendLeaseSigningLink({
          to: ownerEmail,
          name: 'Owner',
          link: ownerLink,
          rentalId: rentalId,
          role: 'Owner'
        });
      }



      return { success: true };
    } catch (error) {
      console.error('Error sending Jotform links:', error);
      throw error;
    }
  }
}

export default JotformService
