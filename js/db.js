/* Sends website reservations and enquiries to the 24 Society customer database (Supabase).
   The key below is the public "anon" key. It can only call the submit function, never read data. */
window.submitEnquiry = (function () {
  var URL = 'https://egrdkyepiklnwusoybza.supabase.co';
  var KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVncmRreWVwaWtsbnd1c295YnphIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTM4MTYxOTksImV4cCI6MjEwOTM5MjE5OX0.9xNsCcRls1F-mT4q2a_scsfNqNDYpGl6MK172XbY0MM';
  var client = null;
  return function (d) {
    if (!window.supabase) return Promise.resolve({ error: new Error('offline') });
    client = client || window.supabase.createClient(URL, KEY);
    return client.rpc('submit_enquiry', {
      p_name: d.name, p_phone: d.phone, p_email: d.email, p_opt_in: !!d.optin,
      p_service: d.service || null, p_date: d.date || null, p_slot: d.slot || null, p_message: d.message || null
    });
  };
})();
