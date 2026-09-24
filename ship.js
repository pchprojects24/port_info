// Ship-wide info that stays the same from port to port.
// Port files (ports/*.js) add their own port-specific sections on top of this.
window.SHIP_DATA = {
  shipContacts: [
    { name: "Brow", sub: "Number to be confirmed — update before sailing", phone: "" },
    { name: "Cox'n", sub: "Number to be confirmed — update before sailing", phone: "" },
    { name: "XO", sub: "Number to be confirmed — update before sailing", phone: "" },
    { name: "Duty Medical", sub: "Number to be confirmed — update before sailing", phone: "" }
  ],

  // Always shown first on the "Ship Routine & Leave" page.
  routine: [
    { title: "Port Window", html: "<p>Per Routine Orders.</p>" },
    { title: "Daily Routine", html: "<p>Per Routine Orders.</p>" },
    { title: "Leave", html: "<p>Per Routine Orders.</p>" },
    { title: "Overnight Leave", items: [
      "Have your hotel name, address, and phone number ready before requesting leave.",
      "Provide a contact number where you can be reached at all times.",
      "Know your leave expiry time and plan return travel accordingly.",
      "If your plans change, inform the ship per routine as soon as possible.",
      "Keep your military ID and leave pass on your person."
    ] }
  ],

  // Used on the Safety page when a port file doesn't define its own `safety`.
  safety: [
    { title: "General", items: [
      "Use common sense and stay aware of your surroundings, particularly at night.",
      "Buddy system, especially at night.",
      "Know how you're getting back to the ship before you go out.",
      "Look out for your shipmates."
    ] },
    { title: "ID / Valuables", items: [
      "Carry your military ID and a second piece of government photo ID.",
      "Don't carry more cash than you need; use a card where accepted.",
      "Leave valuables secured aboard or in your hotel safe."
    ] },
    { title: "Medical & Emergencies", items: [
      "Use the emergency numbers at the top of this page — confirm them locally on arrival.",
      "Inform the ship of any incidents as soon as practical."
    ] }
  ]
};
