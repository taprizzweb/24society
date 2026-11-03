/* Rate card data — source: 24societysalonandwellness.com/rates and /services/*
   All prices in INR, exclusive of GST. "op" = onwards pricing. */
window.RATES = [
  { id: 'hair-women', label: 'Hair · Women', type: 'tier',
    tiers: ['Stylist', 'Artist', 'Creative', 'Assoc. Director'],
    rows: [
      ['Cut & Styling', '1,500', '2,000', '2,500', '3,500'],
      ['Cut & Styling (under 12 yrs)', '1,000', '1,500', '2,000', '2,500'],
      ['Bangs & Fringes', '700', '1,200', '1,700', '2,200'],
      ['Blast Dry', '800', '800', '800', '800'],
      ['Blow Dry (Styling)', '1,200', '1,500', '1,800', '2,100 op'],
      ['Tonging (Ironing)', '1,700', '2,000', '2,300', '2,700 op'],
      ['Party Hair Do', '2,500', '3,000', '3,500', '4,500 op'],
      ['Bridal Hair Do', '5,000', '6,500', '7,500', '9,000 op']
    ] },
  { id: 'hair-men', label: 'Hair · Men', type: 'tier',
    tiers: ['Stylist', 'Artist', 'Creative', 'Assoc. Director'],
    rows: [
      ['Cut & Styling', '1,000', '1,500', '2,000', '2,500'],
      ['Cut & Styling (under 12 yrs)', '700', '1,000', '1,200', '1,500'],
      ['Styling', '1,000', '1,500', '2,000', '2,500'],
      ['Beard Trim', '800', '–', '–', '–']
    ] },
  { id: 'colour-women', label: 'Colour · Women', type: 'tier',
    tiers: ['Stylist', 'Artist', 'Creative', 'Assoc. Director'],
    rows: [
      ['Root Touch-Up', '1,800', '2,000', '2,500', '3,500 op'],
      ['Global Hair Colour', '6,000', '7,000', '8,000', '9,000 op'],
      ['Melted Dimension', '5,000', '6,000', '7,000', '8,000 op'],
      ['Soft Contour', '5,000', '6,000', '7,000', '8,000 op'],
      ['Balayage', '9,000', '10,000', '12,000', '14,000 op'],
      ['Precision Highlights', '9,000', '10,000', '12,000', '14,000 op'],
      ['Partial Highlights', '5,000', '6,500', '7,500', '8,000 op'],
      ['Colour Enhancement', '4,000', '4,500', '5,000', '6,500 op'],
      ['Per Strand Highlights', '1,000', '1,500', '2,000', '2,500 op']
    ] },
  { id: 'colour-men', label: 'Colour · Men', type: 'tier',
    tiers: ['Stylist', 'Artist', 'Creative', 'Assoc. Director'],
    rows: [
      ['Root Touch-Up', '1,500', '2,000', '2,500', '3,500 op'],
      ['Global Colour', '2,000', '2,500', '3,000', '3,500 op'],
      ['Precision Highlights', '5,000', '5,500', '6,000', '7,000 op'],
      ['Balayage', '5,000', '5,500', '6,000', '7,000 op']
    ] },
  { id: 'rituals', label: 'Hair Rituals', type: 'rows',
    rows: [
      ['Instant Moisture · 30 min', 'A quick hydration ritual for dry, dehydrated hair — softness and shine without weight.', '₹3,500'],
      ['Nourish & Restore · 30 min', 'Replenishes essential nutrients and strengthens weakened hair from within.', '₹3,500'],
      ['Strengthen & Reconstruction · 45 min', 'Rebuilds damaged fibres for chemically or heat-treated hair.', '₹5,500'],
      ['Smooth & Anti-Frizz · 45 min', 'Controls frizz, tames flyaways and enhances natural shine.', '₹5,500'],
      ['Peptide Bond Repair · 45 min', 'Rebuilds weakened bonds and restores elasticity. Blast dry included.', '₹6,000'],
      ['Express Bond Repair', 'Rapid strengthening treatment.', '₹3,500'],
      ['Add-On Colour', 'Extends colour longevity and vibrancy.', '₹4,500'],
      ['24 Society VIP Bespoke Ritual · 45 min', 'AI diagnostic-led, personalised hair wellness ritual.', 'Men ₹6,000\nWomen ₹7,500'],
      ['Texture Treatment', 'Full-service texture protocols.', 'Partial ₹6,000\nFull ₹12,000 op'],
      ['Perming', 'Full.', '₹12,000 op']
    ] },
  { id: 'scalp', label: 'Korean Scalp', type: 'rows',
    rows: [
      ['Express Scalp Treatment', 'AI diagnostic followed by deep cleansing and nourishment — the ideal foundation.', 'Men ₹3,500\nWomen ₹3,500'],
      ['Dry Scalp Treatment', 'AI-guided intense moisture therapy to restore balance.', 'Men ₹4,500\nWomen ₹5,500'],
      ['Oily Scalp Treatment', 'Balances excess oil without stripping natural moisture.', 'Men ₹4,500\nWomen ₹5,500'],
      ['Dandruff Scalp Treatment', 'Exfoliates, purifies and soothes at the source.', 'Men ₹4,500\nWomen ₹5,500'],
      ['Hair Fall Scalp Treatment', 'Scalp diagnostics with targeted care to strengthen roots and reduce fall.', 'Men ₹4,500\nWomen ₹5,500'],
      ['Add-On Blow Dry', 'A finishing blow-dry on any scalp treatment.', '₹1,500'],
      ['Add-On Salt & Mud', 'A salt and mud treatment on any scalp treatment.', '₹1,500']
    ] },
  { id: 'skin', label: 'Advanced Skin', type: 'rows',
    rows: [
      ['Radiance Antiox Treatment', 'For dullness, uneven texture and environmental stress. Restores luminosity.', '₹8,000'],
      ['Multi-Peptide Better Aging', 'For fine lines and loss of firmness. Stronger, more resilient skin.', '₹9,000'],
      ['CityLife Hydration Treatment', 'For dehydration, urban pollution and barrier repair.', '₹5,500'],
      ['Clarifying Mineral Treatment', 'For congestion, excess oil and acne-prone skin.', '₹6,000'],
      ['Urban Maintenance Ritual', 'Weekly maintenance for busy lifestyles.', '₹2,000'],
      ['Eye Care Ritual', 'For puffiness, fine lines and dark circles.', '₹3,000']
    ] },
  { id: 'face', label: 'Face Gym', type: 'rows',
    rows: [
      ['Cardio Lift · 30 min', 'High-performance facial workout — energises muscles and boosts vitality.', '₹4,000'],
      ['Sculpt & Define · 45 min', 'Targeted workout to lift, contour and tone facial features.', '₹5,000'],
      ['Recovery Reset · 60 min', 'Restorative ritual that calms, hydrates and rebalances the skin.', '₹6,000'],
      ['Personalised Treatment Mask', 'Customised professional mask. Add-on.', '₹4,000'],
      ['LED Light Therapy', 'Supports skin renewal and post-treatment recovery. Add-on.', '₹5,000'],
      ['Hydra Glow Infusion', 'Cleanses, exfoliates, extracts and infuses nourishing serums. Add-on.', '₹4,000']
    ] },
  { id: 'body', label: 'Body Recovery', type: 'rows',
    rows: [
      ['Swedish Massage', 'Full-body relaxation using long, flowing strokes.', '60 min ₹4,000\n90 min ₹5,500'],
      ['Balinese', 'Stretches, rhythmic massage and pressure techniques.', '60 min ₹4,500\n90 min ₹6,000'],
      ['Deep Tissue', 'Intensive release for chronic tension and stiffness.', '60 min ₹5,000\n90 min ₹7,000'],
      ['Sports / Workout Therapy', 'Performance-focused therapy for the active body.', '90 min ₹8,000\n120 min ₹10,000'],
      ['Thai Dry Therapy', 'Assisted stretching, acupressure and rhythmic movement.', '60 min ₹7,000'],
      ['Hot Stone', 'Heated volcanic stones with therapeutic massage.', '90 min ₹8,000\n120 min ₹11,000'],
      ['Bamboo Massage', 'Warm bamboo tools applying firm, flowing pressure.', '90 min ₹7,500\n120 min ₹9,500'],
      ['Lymphatic Drainage', 'Gentle technique encouraging lymphatic flow and detoxification.', '60 min ₹8,000'],
      ['Pre-Natal Therapy', 'Gentle, specialist therapy for expectant mothers.', '60 min ₹5,000\n90 min ₹6,500'],
      ['Couple Body Therapy', 'A shared wellness experience in a private suite.', '60 min ₹10,000\n90 min ₹13,000\n120 min ₹16,000'],
      ['Head & Foot Massage', 'Calming pressure-point therapy for the extremities.', '30 min ₹2,000\n45 min ₹3,000\n60 min ₹4,000'],
      ['Body Rituals', 'Signature exfoliation, wraps and detox rituals.', 'Glow-On-The-Go ₹3,500\nGlacial Detox ₹5,000\nMoor Mud Therapy ₹5,500\nBeyond Spa Journey ₹9,000']
    ] },
  { id: 'recovery', label: 'Recovery & Reset', type: 'rows',
    rows: [
      ['Ice Bath · 20 min', 'Cold immersion therapy for recovery and renewal.', '₹2,500'],
      ['Steam · 30 min', 'Heat therapy to relax the body and support recovery.', '₹2,500'],
      ['Dry Sauna · 30 min', 'Dry heat therapy for relaxation, recovery and renewal.', '₹2,500'],
      ['Body Exfoliation · 30 min', 'A luxurious exfoliating ritual for smoother, more radiant skin.', '₹3,500'],
      ['Body Wrap · 30 min', 'Deeply hydrating, detoxifying body treatment.', '₹4,000'],
      ['Rose Petal Bath · 30 min', 'Indulgent floral bathing ritual to calm the senses.', '₹3,000'],
      ['Holistic Salt & Oil Scrub', 'Mineral salts and botanical oils for softness and radiance.', '₹2,500'],
      ['Supernatural Marine Clay Wrap', 'Mineral-rich clay wrap — detoxifies, hydrates and restores balance.', '₹3,000'],
      ['Beyond Spa Signature Journey · 120 min', 'Head-to-toe signature ritual — bespoke massage and premium botanicals.', '₹9,000']
    ] },
  { id: 'nails', label: 'Nail Atelier', type: 'rows',
    rows: [
      ['Classic Manicure', 'Hand treatment.', '₹1,000'],
      ['French Manicure', 'Hand treatment.', '₹1,200'],
      ['Reset Ritual Manicure', 'Hand treatment.', '₹1,400'],
      ['24 Society Experience Manicure', 'Hand treatment.', '₹1,800'],
      ['24 Society Signature Manicure', 'The signature hand ritual.', '₹2,500'],
      ['Classic Pedicure', 'Foot treatment.', '₹1,200'],
      ['French Pedicure', 'Foot treatment.', '₹1,400'],
      ['Reset Ritual Pedicure', 'Foot treatment.', '₹1,600'],
      ['24 Society Experience Pedicure', 'Foot treatment.', '₹2,000'],
      ['24 Society Signature Pedicure', 'The signature foot ritual.', '₹2,800'],
      ['Silk Seal Therapy', 'Add-on to any manicure or pedicure.', '₹500'],
      ['Gel Polish', 'Application ₹1,200 · French ₹1,600 · Chrome ₹2,000 · Removal ₹600 · Nail art ₹100 per finger.', 'From ₹1,200'],
      ['Gel & Acrylic Extensions', 'Gel ₹3,000 · Gel X ₹2,200 · Acrylic ₹3,000 · Refill ₹2,200 · Inbuilt art / French / Ombre ₹4,000 · Removal ₹1,000.', 'From ₹2,200'],
      ['Essentials', 'Polish ₹400 · French polish ₹500 · Cut, file & polish ₹600 · Tip repair ₹350 · Toe repair ₹500.', 'From ₹350']
    ] },
  { id: 'makeup', label: 'Makeup', type: 'rows',
    rows: [
      ['Evening Party Makeup', 'Composed at the salon for evenings and events.', '₹7,000'],
      ['Eye Makeup', 'Focused eye artistry, à la carte.', '₹2,000'],
      ['Saree Draping', 'Precise draping for the occasion.', '₹1,000'],
      ['Stick-On Lash', 'Considered lash application to finish the look.', '₹1,500'],
      ['Bridal Makeup · at Salon', 'Hair & makeup, executed at the house. Consultation-led and trial-refined.', '₹30,000'],
      ['Bridal Makeup · at Venue', 'Hair & makeup, on location on your event day.', '₹65,000']
    ] }
];
