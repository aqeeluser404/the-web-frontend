import axiosInstance from 'src/services/api/axiosInstance'
import EmailService from 'src/services/api/EmailService';

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
        agentEmail: 'byronl@trafalgar.co.za',
        ownerEmail: 'earle.williams@the-web.co.za'
      };
      const jotformResponse = await axiosInstance.post('/jotform/create-session', payload);
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
      const agentEmail = 'byronl@trafalgar.co.za';
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
      const ownerEmail = 'earle.williams@the-web.co.za';
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
